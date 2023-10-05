import http from "node:http";
import open from "open";
import serverFun from "./serverCallback.js";

export const start = (notes, port) => {
  const server = http.createServer((req, res) => {
    serverFun(req, res, notes);
  });
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
  open(`http://localhost:${port}`);
};
