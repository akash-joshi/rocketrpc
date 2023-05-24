import { useState } from "react";
import type { Note} from "~/components/Todos";
import { Todos } from "~/components/Todos";

export default function Normal() {
  const [notes, setNotes] = useState<Note[]>([]);

  return (
    <Todos
      notes={notes}
      addNote={(newNote) => {
        setNotes((notes) => [
          ...notes,
          { text: newNote, done: false, id: new Date().toISOString() },
        ]);
      }}
      onDone={(id, done) => {
        setNotes(
          notes.map((note) => ({
            ...note,
            done: note.id === id ? done : note.done,
          }))
        );
      }}
      onDelete={(removedId) => {
        setNotes(notes.filter((note) => note.id !== removedId));
      }}
    />
  );
}
