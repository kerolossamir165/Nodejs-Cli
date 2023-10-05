import { findNotes, getAllNotes } from "./notes.js";
import interpolate from "./utils/intepolateHtml.js";
import fs from "node:fs/promises";
import { capitalize, formatNotes } from "./utils/helper.js";
let handlers = {};
handlers.acceptabelMethods = ["get", "post", "put", "delete"];

handlers.index = async (data, callback) => {
  try {
    // Do interpolation on the string
    let notes = await getAllNotes();

    let pathHtml = new URL("./template.html", import.meta.url);
    let temp = await fs.readFile(pathHtml, "utf8");
    let newHtml = interpolate(temp, { notes: formatNotes(notes) });
    callback(false, newHtml, "html");
  } catch (err) {
    callback("No template could be found");
  }
};

handlers.note = (data, callback) => {
  if (handlers.acceptabelMethods.indexOf(data.method) !== -1) {
    handlers._note[data.method](data, callback);
  }
};

handlers.public = async (data, callback) => {
  if (data.method == "get") {
    // Get the filename being requested
    var trimmedAssetName = data.trimmedPath.replace("public/", "").trim();
    if (trimmedAssetName.length > 0) {
      // Read in the asset's data
      trimmedAssetName =
        typeof trimmedAssetName == "string" && trimmedAssetName.length > 0
          ? trimmedAssetName
          : false;

      if (trimmedAssetName) {
        let publicDir = new URL(
          `../public/${trimmedAssetName}`,
          import.meta.url
        );
        let dataPublic = await fs.readFile(publicDir, "utf-8");

        try {
          // Determine the content type (default to plain text)
          var contentType = "plain";

          if (trimmedAssetName.indexOf(".css") > -1) {
            contentType = "css";
          }

          if (trimmedAssetName.indexOf(".png") > -1) {
            contentType = "png";
          }

          if (trimmedAssetName.indexOf(".jpg") > -1) {
            contentType = "jpg";
          }

          if (trimmedAssetName.indexOf(".ico") > -1) {
            contentType = "favicon";
          }

          if (trimmedAssetName.indexOf(".js") > -1) {
            contentType = "js";
          }

          // Callback the data
          callback(200, dataPublic, contentType);
        } catch (err) {
          callback(404);
        }
      }
    } else {
      callback(404);
    }
  } else {
    callback(405);
  }
};

handlers.notFound = (data, callback) => {
  callback(404);
};

handlers._note = {};

handlers._note.get = function (data, callback) {
  // data.queryStringObject = JSON.parse(data.queryStringObject);
  findNotes("first")
    .then((data) => {
      callback(200, data, "json");
    })
    .catch((err) => {
      callback(404);
    });
};
handlers._note.delete = function (data, callback) {};

export default handlers;
