import url from "url";
import { StringDecoder } from "string_decoder";
import handlers from "./handlers.js";
import router from "./router.js";

export default async function serverFun(req, res, notes) {
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
