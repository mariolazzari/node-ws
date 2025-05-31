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
