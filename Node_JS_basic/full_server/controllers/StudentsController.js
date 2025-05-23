import readDatabase from '../utils.js'; // ES6 syntax because using babel-node

export default class StudentsController {
  static async getAllStudents(request, response) {
    try {
      const studentsByField = await readDatabase(process.argv[2]);

      let output = 'This is the list of our students\n';

      // Sort fields alphabetically (case insensitive)
      const sortedFields = Object.keys(studentsByField).sort((a, b) =>
        a.toLowerCase().localeCompare(b.toLowerCase())
      );

      // Build output for each field
      const fieldLines = sortedFields.map(field => {
        const students = studentsByField[field];
        return `Number of students in ${field}: ${students.length}. List: ${students.join(', ')}`;
      });

      output += fieldLines.join('\n');

      response.status(200).send(output);
    } catch (error) {
      response.status(500).send('Cannot load the database');
    }
  }

  static async getAllStudentsByMajor(request, response) {
    const { major } = request.params;

    // Validate major parameter
    if (major !== 'CS' && major !== 'SWE') {
      return response.status(500).send('Major parameter must be CS or SWE');
    }

    try {
      const studentsByField = await readDatabase(process.argv[2]);
      const students = studentsByField[major] || [];

      response.status(200).send(`List: ${students.join(', ')}`);
    } catch (error) {
      response.status(500).send('Cannot load the database');
    }
  }
}
