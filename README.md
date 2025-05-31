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