import fs from 'fs';

export default function readDatabase(path) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(path, { encoding: 'utf8' });
    let database = '';

    // This version uses stream events instead of async/await
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

        resolve(studentsByField); // from task 3 edited so that it returns the full object
      } catch (error) {
        reject(new Error('Cannot load the database'));
      }
    });

    readStream.on('error', () => {
      reject(new Error('Cannot load the database'));
    });
  });
}
