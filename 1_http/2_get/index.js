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
