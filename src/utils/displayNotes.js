export default function displayNotes(notes) {
  notes.forEach((note) => {
    console.log("id", note.id);
    console.log("content", note.content);
    console.log("tags", note.tags);
    console.log("\n");
  });
}
