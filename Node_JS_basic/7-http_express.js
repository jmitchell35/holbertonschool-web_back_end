// https://expressjs.com/en/starter/hello-world.html

const express = require('express');
const countStudents = require('./3-read_file_async');

const app = express();
const port = 1245;

app.get('/', (_req, res) => {
  res.send('Hello Holberton School!');
});

app.get('/students', async (_req, res) => {
  try {
    const students = await countStudents(process.argv[2]);
    res.send(`This is the list of our students\n${students}`);
  } catch (_error) {
    res.err('Cannot load the database');
  }
});

app.listen(port);

module.exports = app;
