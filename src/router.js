import handlers from "./handlers.js";
let router = {
  "": handlers.index,
  note: handlers.note,
};

export default router;
