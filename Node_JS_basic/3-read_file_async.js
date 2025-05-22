const fs = require('node:fs');

function countStudents(path) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(path, { encoding: 'utf8' });
    let database = '';

    readStream.on('data', (chunk) => {
      database += chunk;
    });

    readStream.on('end', () => {
      try {
        const lines = database.split('\n').filter((line) => line.trim());
        const headers = lines[0].split(',');
        const students = lines.slice(1);

        console.log(`Number of students: ${students.length}`);

        const firstNameIndex = headers.findIndex((header) => header === 'firstname');
        const fieldIndex = headers.findIndex((header) => header === 'field');

        const studentsByField = {};

        students.forEach((student) => {
          const values = student.split(',');
          const field = values[fieldIndex];
          const firstName = values[firstNameIndex];

          if (!studentsByField[field]) {
            studentsByField[field] = [];
          }
          studentsByField[field].push(firstName);
        });

        for (const field in studentsByField) {
          if (Object.prototype.hasOwnProperty.call(studentsByField, field)) {
            const students = studentsByField[field];
            console.log(`Number of students in ${field}: ${students.length}. List: ${students.join(', ')}`);
          }
        }

        resolve(); // Explicitly resolve when done
      } catch (error) {
        reject(new Error('Cannot load the database'));
      }
    });

    readStream.on('error', () => {
      reject(new Error('Cannot load the database'));
    });
  });
}

module.exports = countStudents;
