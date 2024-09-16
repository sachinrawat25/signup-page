const http = require("http");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");
const PORT = 3000;
const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    // Serve the signup page
    fs.readFile(path.join(__dirname, "signup.html"), (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  } else if (req.method === "POST" && req.url === "/signup") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const parsedData = qs.parse(body);
      const { username, email, password } = parsedData;

      const userData = {
        username,
        email,
        password,
      };

      fs.readFile(path.join(__dirname, "users.json"), (err, data) => {
        let users = [];
        if (!err) {
          users = JSON.parse(data);
        }

        users.push(userData);

        fs.writeFile(
          path.join(__dirname, "users.json"),
          JSON.stringify(users, null, 2),
          (err) => {
            if (err) {
              res.writeHead(500, { "Content-Type": "text/plain" });
              res.end("Internal Server Error");
            } else {
              res.writeHead(200, { "Content-Type": "text/plain" });
              res.end("Signup successful!");
            }
          }
        );
      });
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
