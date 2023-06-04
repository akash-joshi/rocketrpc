import React from "react";

export type Todo = { text: string; status: boolean; id: string };

export const Todos = ({
  notes,
  addNote,
  onDone,
  onDelete,
}: {
  notes: Todo[];
  addNote: (newNote: string) => void;
  onDone: (index: string, done: boolean) => void;
  onDelete: (index: string) => void;
}) => {
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          // Read the form data
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);

          const newTodo = formData.get("newTodo") as string;
          if (newTodo) {
            addNote(newTodo);
            form.reset();
          }
        }}
      >
        <input required name="newTodo" type="text" />
        <button type="submit">Add Todo</button>
      </form>
      {notes.map((note) => (
        <p key={note.id}>
          <input
            onChange={(e) => onDone(note.id, e.target.checked)}
            type="checkbox"
          />
          <span>{note.text}</span>
          <button
            style={{ marginLeft: "0.5em" }}
            onClick={() => onDelete(note.id)}
          >
            ❌
          </button>
        </p>
      ))}
    </div>
  );
};