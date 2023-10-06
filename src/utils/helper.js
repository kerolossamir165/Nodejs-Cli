export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export const formatNotes = (notes) => {
  return notes
    .map((note) => {
      return `
              
            <section>
            <h2>${capitalize(note.content)}</h2>
            <div>
                <ul>
                <li>${note.description}</li>  
                </ul>
              </div>
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
