const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    return res.end("This is the HOME page");
  }
  if (req.url === "/about") {
    return res.end("This is the ABOUT page");
  }
  res.end(`
  <h1>Oops!</h1>
  <p>Page is not found</p>
  <a href="/">Back HOME</a>
  `);
});

server.listen(3000, () => {
  console.log("Server is running on poprt 3000...");
});
