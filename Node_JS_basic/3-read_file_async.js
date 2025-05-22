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
        .call() is a method which allows calling a function with specified "this" value and arg
        => Our studentsByField becomes "this" for the hasOwnProperty method
        second argument is the property we are checking
      */
      if (Object.prototype.hasOwnProperty.call(studentsByField, field)) {
        const students = studentsByField[field];
        console.log(`Number of students in ${field}: ${students.length}. List: ${students.join(', ')}`);
      }
    }
  } catch (err) {
    throw new Error('Cannot load the database');
  }
}

module.exports = countStudents;
