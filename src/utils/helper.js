export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export const formatNotes = (notes) => {
  return notes
    .map((note) => {
      return `
              
            <section data-id=${note.id}>
            <h2>${capitalize(note.content)}</h2>
              <div>
             
                <p>${note.description}</p>  
               
              </div>
              <button class="delete">Delete</button>
              <button class="edit">Edit</button>
          </section>
          `;
    })
    .join("\n");
};

export let parseJsonToObject = function (str) {
  try {
    var obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};
