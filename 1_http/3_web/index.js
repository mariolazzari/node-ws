const { createServer } = require("http");

createServer((req, res) => {
  console.log(req);
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World!\n");
}).listen(3000, () => {
  console.log("Server is running at http://localhost:3000/");
});
