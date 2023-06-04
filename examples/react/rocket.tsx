import React, { useEffect, useState } from "react";
import type { Todo } from "./Todos";
import { Todos } from "./Todos";
import { useClient } from "./useRocketRpc";

export default function Rocket() {
  const [notes, setNotes] = useState<Todo[]>([]);

  const client = useClient("http://localhost:8080");
  const { prisma } = client;

  useEffect(() => {
    prisma.todo.findMany().then(setNotes);
  }, []);

  useEffect(() => {
    console.log({ client }, client.hello());
  }, [client]);

  return (
    <Todos
      notes={notes}
      addNote={(newNote) => {
        prisma.todo
          .create({
            data: { text: newNote, status: false },
          })
          .then((newNote) => setNotes([...notes, newNote]));
      }}
      onDone={(id, status) => {
        prisma.todo
          .update({
            where: {
              id,
            },
            data: {
              status,
            },
          })
          .then(({ id }) =>
            setNotes(
              notes.map((note) => ({
                ...note,
                status: note.id === id ? status : note.status,
              }))
            )
          );
      }}
      onDelete={(id) => {
        prisma.todo
          .delete({
            where: {
              id,
            },
          })
          .then(({ id }) => {
            setNotes(notes.filter((note) => note.id !== id));
          });
      }}
    />
  );
}
