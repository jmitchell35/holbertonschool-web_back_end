export default function getStudentsByLocation(stdList, city) {
  return stdList.filter((student) => student.location === city);
}
