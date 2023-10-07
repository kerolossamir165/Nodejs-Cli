import { insert, getDB, saveDB } from "./db.js";

export const newNote = async (note, description) => {
  const data = {
    description,
    content: note,
    id: Date.now(),
  };
  await insert(data);
  return data;
};

export const getAllNotes = async () => {
  const db = await getDB();
  return db.notes;
};

export const findNotes = async (filter) => {
  const notes = await getAllNotes();
  return notes.filter((note) => note.id == filter);
};

export const editNote = async (note) => {
  const notes = await getAllNotes();
  let noteIndex = notes.findIndex((el) => el.id == note.id);
  notes[noteIndex].content = note.content;
  notes[noteIndex].description = note.description;
  await saveDB({
    notes: notes,
  });
  return note;
};

export const removeNote = async (id) => {
  const notes = await getAllNotes();
  const match = notes.find((note) => note.id === id);

  if (match) {
    const newNotes = notes.filter((note) => note.id !== id);
    await saveDB({ notes: newNotes });
    return id;
  }
};

export const removeAllNotes = async () => {
  await saveDB({ notes: [] });
};
