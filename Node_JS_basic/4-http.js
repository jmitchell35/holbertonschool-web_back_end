// https://www.youtube.com/watch?v=dZ707QnDCmE

const http = require('node:http');

// req as request, res as response
const app = http.createServer((_req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.write('Hello Holberton School!');
  res.end();
});

const port = 1245;

app.listen(port);

module.exports = app;
