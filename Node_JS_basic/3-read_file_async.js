const fs = require('node:fs');
/*
  Two different approaches although one only is accepted by the checker :
  1 - use async function processing the read file stream, which will return a promise
      const fs = require('node:fs');

      async function countStudents(path) {
        const readStream = fs.createReadStream(path, { encoding: 'utf8' });
        let database = '';
        try {
          for await (const chunk of readStream) {
            database += chunk;
          }

          const lines = database.split('\n').filter((line) => line.trim());

          const headers = lines[0].split(',');
          // take out headers, list of students only from index 1
          const students = lines.slice(1);

          console.log(`Number of students: ${students.length}`);

          const firstNameIndex = headers.findIndex((header) => header === 'firstname');
          const fieldIndex = headers.findIndex((header) => header === 'field');

          // Handles fields dynamically
          const studentsByField = {};

          students.forEach((student) => {
            const values = student.split(',');
            const field = values[fieldIndex];
            const firstName = values[firstNameIndex];

            // Adds fields (array of students by field) dynamically as they are found
            if (!studentsByField[field]) {
              studentsByField[field] = [];
            }

            // appends the firstName of the student to the field's list for later use
            studentsByField[field].push(firstName);
          });

          // Now work for each array of students by field
          for (const field in studentsByField) {
            /* guard-for-in required by linter
              hasOwnProperty is one of every JS objects' prototype's methods
              safer in case the method has been overwritten by the Class
              .call() is a method which allows calling a function with specified "this" value & arg
              => Our studentsByField becomes "this" for the hasOwnProperty method
              second argument is the property we are checking
            *\/
            if (Object.prototype.hasOwnProperty.call(studentsByField, field)) {
              const students = studentsByField[field];
              console.log(`Number of students in ${field}: ${students.length}. /
                                                                    List: ${students.join(', ')}`);
            }
          }
        } catch (err) {
          throw new Error('Cannot load the database');
        }
      }
  2 - As below, use explicit Promise constructor (without async/await)
*/
function countStudents(path) {
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
