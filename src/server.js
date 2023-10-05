import http from "node:http";
import fs from "node:fs/promises";
import open from "open";
import url from "url";
import interpolate from "./utils/intepolateHtml.js";
import { StringDecoder } from "string_decoder";
import { findNotes, getAllNotes } from "./notes.js";

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
const formatNotes = (notes) => {
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

async function serverFun(req, res, notes) {
  let parsedUrl = url.parse(req.url, true);
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g, "");
  let method = req.method.toLowerCase();
  let headers = req.headers;
  let queryString = parsedUrl.query;
  let decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", function (data) {
    buffer += decoder.write(data);
  });

  req.on("end", function () {
    buffer += decoder.end();
    let data = {
      trimmedPath,
      payload: buffer,
      queryString,
      method,
      headers,
    };

    let route =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;
    route = trimmedPath.indexOf("public/") > -1 ? handlers.public : route;
    route(data, (statusCode, payload, contentType) => {
      statusCode = typeof statusCode === "number" ? statusCode : 200;
      contentType = typeof contentType == "string" ? contentType : "json";

      let payloadString = "";
      if (contentType == "json") {
        res.setHeader("Content-Type", "application/json");
        payload = typeof payload == "object" ? payload : {};
        payloadString = JSON.stringify(payload);
      }
      if (contentType == "html") {
        res.setHeader("Content-Type", "text/html");
        payloadString = typeof payload == "string" ? payload : "";
      }

      if (contentType == "css") {
        res.setHeader("Content-Type", "text/css");
        payloadString = typeof payload !== "undefined" ? payload : "";
      }

      if (contentType == "js") {
        res.setHeader("Content-Type", "text/javascript");
        payloadString = typeof payload == "string" ? payload : "";
      }
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
}

export const start = (notes, port) => {
  const server = http.createServer((req, res) => {
    serverFun(req, res, notes);
  });
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
  open(`http://localhost:${port}`);
};

let router = {
  "": handlers.index,
  note: handlers.note,
};
