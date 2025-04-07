export default function updateStudentGradeByCity(stdList, city, newGrades) {
  return stdList // method chaining struction
    .filter((student) => student.location === city) // first step : filter by location
    .map((student) => { // second : map with custom extended callback function
      const gradeObj = newGrades.find((grade) => grade.studentId === student.id); // for each std
      return { // constructor literal with properties from student + grade from gradeObj
        ...student,
        grade: gradeObj ? gradeObj.grade : 'N/A', // ternary : value if any, or N/A
      }; // good practice to return new obj rather than updating passed args (hence constructor)
    });
}
