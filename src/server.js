import http from "node:http";
import fs from "node:fs/promises";
import open from "open";
import interpolate from "./utils/intepolateHtml.js";

const formatNotes = (notes) => {
  return notes
    .map((note) => {
      return `
            <div>
            <p>${note.content}</p>
            <div>
                ${note.tags.map((tag) => `<span>${tag}</span>`).join("")}
            </div>
            </div>

        `;
    })
    .join("\n");
};

function createServer(notes) {
  return http.createServer(async function (req, res) {
    let pathHtml = new URL("./template.html", import.meta.url);
    const temp = await fs.readFile(pathHtml, "utf8");
    let newHtml = interpolate(temp, { notes: formatNotes(notes) });
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(newHtml);
  });
}

export const start = (notes, port) => {
  const server = createServer(notes);
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
  open(`http://localhost:${port}`);
};
