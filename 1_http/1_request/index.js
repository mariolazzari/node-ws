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
