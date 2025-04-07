export default function getStudentIdsSum(stdList) {
  return stdList.reduce((sum, student) => sum + student.id, 0)
}
