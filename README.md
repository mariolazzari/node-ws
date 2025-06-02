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

## npm

### The package.json file

```sh
npm init -y
```

### Using import statement

```json
{
  "name": "2_import",
  "version": "1.0.0",
  "main": "main.js",
  "type": "module",
  "scripts": {
    "start": "node main.js"
  },
  "keywords": [],
  "author": "Mario Lazzari",
  "license": "ISC",
  "description": ""
}
```

### Using minimist

```sh
npm i argv
```

```js
import parseArgs from "argv";

const { time } = parseArgs.option(process.argv);

if (!time) {
  console.error("Please provide a time argument.");
  process.exit(1);
}

if (isNaN(time)) {
  console.error("The time argument must be a number.");
  process.exit(1);
}

console.log("time", time);
```

### Using tiny-timer

```sh
npm i tiny-timer
```

```js
import parseArgs from "argv";
import Timer from "tiny-timer";

const { time } = parseArgs.option(process.argv);

if (!time) {
  console.error("Please provide a time argument.");
  process.exit(1);
}

if (isNaN(time)) {
  console.error("The time argument must be a number.");
  process.exit(1);
}

const timer = new Timer();

timer.on("tick", ms => {
  console.log(`Tick: ${ms} ms`);
});

timer.on("done", () => {
  console.log("Timer finished!");
});

timer.start(time * 1000);
```

### Managing packages

```json
{
  "name": "5_manager",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index.js --time 5"
  },
  "keywords": [],
  "author": "Mario Lazzari",
  "license": "ISC",
  "type": "commonjs"
}
```

## Web servers

### File servers with serve

```sh
npx serve .
```

### Intro to Express

```js
import express from "express";
import skiTerms from "./ski-terms.json" assert { type: "json" };

const app = express();

app.use("/", express.static("./client"));
app.get("/dictionary", (_req, res) => {
  res.json(skiTerms);
});

app.listen(3000, () => console.log("ski dictionary running at 3000"));
```

### Handling POST requests

```js
import express from "express";
import skiTerms from "./ski-terms.json" assert { type: "json" };
import bodyParser from "body-parser";
import fs from "fs";

const app = express();

app.use("/", express.static("./client"));
app.get("/dictionary", (req, res) => {
  res.json(skiTerms);
});

app.post("/dictionary", bodyParser.json(), (req, res) => {
  skiTerms.push(req.body);
  save();
  res.json({
    status: "success",
    term: req.body,
  });
});

const save = () => {
  fs.writeFile("./ski-terms.json", JSON.stringify(skiTerms, null, 2), err => {
    if (err) {
      throw err;
    }
  });
};

app.listen(3000, () => console.log("ski dictionary running at 3000"));
```

### Handling DELETE requests

```js
import express from "express";
import skiTerms from "./ski-terms.json" assert { type: "json" };
import bodyParser from "body-parser";
import fs from "fs";

const app = express();

let definitions = skiTerms;

app.use("/", express.static("./client"));
app.get("/dictionary", (req, res) => {
  res.json(definitions);
});

app.post("/dictionary", bodyParser.json(), (req, res) => {
  definitions.push(req.body);
  save();
  res.json({
    status: "success",
    term: req.body
  });
});

app.delete("/dictionary/:term", (req, res) => {
  definitions = definitions.filter(
    ({ term }) => term !== req.params.term
  );
  save();
  res.json({
    status: "success",
    removed: req.params.term,
    newLength: definitions.length
  });
});

const save = () => {
  fs.writeFile(
    "./ski-terms.json",
    JSON.stringify(definitions, null, 2),
    (err) => {
      if (err) {
        throw err;
      }
    }
  );
};

app.listen(3000, () =>
  console.log("ski dictionary running at 3000")
);
```

### Using Express middleware

```js
import express from "express";
import skiTerms from "./ski-terms.json" assert { type: "json" };
import bodyParser from "body-parser";
import fs from "fs";

const app = express();

let definitions = skiTerms;

app.use("/", express.static("./client"));
app.get("/dictionary", (req, res) => {
  res.json(definitions);
});

app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  if (Object.keys(req.body).length) {
    console.log(req.body);
  }
  next();
});

app.post("/dictionary", bodyParser.json(), (req, res) => {
  definitions.push(req.body);
  save();
  res.json({
    status: "success",
    term: req.body,
  });
});

app.delete("/dictionary/:term", (req, res) => {
  definitions = definitions.filter(({ term }) => term !== req.params.term);
  save();
  res.json({
    status: "success",
    removed: req.params.term,
    newLength: definitions.length,
  });
});

const save = () => {
  fs.writeFile(
    "./ski-terms.json",
    JSON.stringify(definitions, null, 2),
    err => {
      if (err) {
        throw err;
      }
    }
  );
};

app.listen(3000, () => console.log("ski dictionary running at 3000"));
```

## WebSocket

### Creating a WebSocket

MDN [docs](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

```sh
npm i ws
```

```js
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });

wss.on("connection", ws => {
  console.log("New client connected");

  ws.on("message", message => {
    console.log(`Received message: ${message}`);
    ws.send(`Echo: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
```

### Broadcasting messages with a WebSocket

```js
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });

const messages = [];

wss.on("connection", ws => {
  ws.on("message", message => {
    console.log(message.toString());
    messages.push(message.toString());
    if (message.toString() === "exit") {
      ws.close();
    } else {
      wss.clients.forEach(client => client.send(message.toString()));
    }
  });

  ws.on("close", () => {
    console.log("user disconnected");
  });
  
  console.log("new socket connected");
  ws.send("Welcome to Live Chat!");
  if (messages.length) {
    ws.send("Chat currently in session");
    messages.forEach(message => ws.send(message.toString()));
  }
});

console.log("chat server waiting for connections on ws://localhost:3000");
```

### Broadcasting messages with a WebSocket

[Docs](https://socket.io/)

```js
import { createServer } from "http";
import { Server } from "socket.io";

const server = createServer().listen(3000);
const io = new Server(server);

io.on("connection", socket => {
  console.log(`${io.engine.clientsCount} connections`);
  socket.on("chat", message => {
    console.log(`${socket.id}: ${message}`);
    io.sockets.emit("message", message, socket.id);
  });
  socket.on("disconnect", () => {
    console.log("disconnect", socket.id);
  });
});

console.log("socket server");
```

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("socket io client is connected");
});
```

### Emitting Socket.IO events

```js
import { createServer } from "http";
import { Server } from "socket.io";

const server = createServer().listen(3000);
const io = new Server(server);

io.on("connection", socket => {
  console.log(`${io.engine.clientsCount} connections`);

  socket.on("chat", message => {
    console.log(`${socket.id}: ${message}`);
    io.sockets.emit("message", message, socket.id);
  });

  socket.on("disconnect", () => {
    console.log("disconnect", socket.id);
  });
});

console.log("socket server");
```

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("socket io client is connected");
});

socket.on("message", (message, id) => {
  console.log(`${id}: ${message}`);
});

process.stdin.on("data", data => {
  socket.emit("chat", data.toString().trim());
});
```

## Tesing

### Creating modular projects

```js
import app from "./app.js";

app.listen(3000, () => console.log("ski dictionary running at 3000"));
```

### Configuring Babel with Jest

[Docs](https://babeljs.io/)

```json
{
    "presets": ["@babel/preset-env"],
    "plugins": ["@babel/plugin-syntax-import-assertions"]
}
```

### 