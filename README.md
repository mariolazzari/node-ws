# Node.js: Web Servers, Tests, and Deployment

## The HTTP module

### Making a request

```js
const https = require("https");
const fs = require("fs");

const options = {
  hostname: "it.wikipedia.org",
  port: 443,
  path: "/wiki/Immanuel_Kant",
  method: "GET",
};

const request = https.request(options, res => {
  let resBody = "";

  res.setEncoding("utf8");

  res.on("data", chunk => {
    resBody += chunk;
    console.log(`${chunk.length} bytes received`);
  });

  res.on("end", () => {
    console.log("Response ended");
    fs.writeFile("kant.html", resBody, err => {
      if (err) {
        return console.error("Error writing file:", err);
      }
      console.log("Response saved to kant.html");
    });
  });
});

request.end();
```

### Making a request with the GET method

```js
const https = require("https");
const fs = require("fs");

const url = "https://it.wikipedia.org/wiki/Immanuel_Kant";

const request = https.get(url, res => {
  let download = fs.createWriteStream("kant.html");
  console.log(`Downloading ${url}...`);
  res.pipe(download);
  res.on("end", () => {
    console.log("Download complete.");
    download.close();
  });
});

request.end();
```

### Building a web server

```js
const { createServer } = require("http");

createServer((req, res) => {
  console.log(req);
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World!\n");
}).listen(3000, () => {
  console.log("Server is running at http://localhost:3000/");
});
```

### Creating a file server

```js
const { createServer } = require("http");
const { createReadStream } = require("fs");

const sendFile = (res, status, type, file) => {
  res.writeHead(status, { "Content-Type": type });
  createReadStream(file).pipe(res);
};

createServer((req, res) => {
  switch (req.url) {
    case "/":
      return sendFile(res, 200, "text/html", "index.html");

    case "/img/image.jpg":
      return sendFile(res, 200, "image/jpeg", "./image.jpg");

    case "styles.css":
      return sendFile(res, 200, "text/css", "styles.css");

    default:
      return sendFile(res, 404, "text/html", "404.html");
  }
}).listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
```

### Serving JSON data

```js
const { createServer } = require("http");
const cats = require("./cats");

const filterByName = name =>
  cats.filter(cat => cat.name.toLowerCase() === name.toLowerCase());

createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/json" });
  let data;

  switch (req.url.toLowerCase()) {
    case "/biscuit":
      data = filterByName("Biscuit");
      break;

    case "/jungle":
      data = filterByName("Jungle");
      break;

    default:
      data = cats;
  }

  res.end(JSON.stringify(data));
}).listen(3000);
```