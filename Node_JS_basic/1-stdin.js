const displayMessage = require('./0-console');

function prompt() {
  displayMessage('Welcome to Holberton School, what is your name?');
  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk !== null) {
      displayMessage(`Your name is: ${chunk.trim()}`);
    }
  });

  process.stdin.on('end', function() {
    displayMessage('This important software is now closing');
  });
}

module.exports = {};
