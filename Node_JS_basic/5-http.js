/*  https://www.youtube.com/watch?v=dZ707QnDCmE
    https://dev.to/ajkachnic/make-a-simple-http-server-with-node-in-6-steps-491c
    https://stackoverflow.com/questions/55113447/node-js-http-server-routing
*/

const http = require('node:http');
const countStudents = require('./3-read_file_async');

// req as request, res as response, make it async to use and await countStudents
const app = http.createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  if (req.url === '/') {
    res.write('Hello Holberton School!');
  }

  if (req.url === '/students') {
    res.write('This is the list of our students\n');
    try {
      let students = await countStudents(process.argv[2]);
      res.write(students);
    } catch (_error) {
      res.write('Cannot load the database')
    }
  }
  res.end();
});

const port = 1245;

app.listen(port);

module.exports = app;
