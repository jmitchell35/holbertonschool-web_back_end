export default class HolbertonCourse {
  constructor(name, length, students) {
    if (typeof name !== 'string') {
      throw new TypeError('name must be a string');
    }

    if (typeof length !== 'number' || isNaN(length) || length < 0) {
      throw new TypeError('length must be a positive number');
    }

    if (!Array.isArray(students)) {
      throw new TypeError('students must be an array');
    }

    for (const student of students) {
      if (typeof student !== 'string') {
        throw new TypeError('students must be an array of strings');
      }
    }

    this._name = name;
    this._length = length;
    this._students = students;
  }

  get name() {
    return this._name;
  }

  set name(newName){
    if (typeof newName !== 'string') {
      throw new TypeError('newName must be a string');
    }

    this._name = newName;
  }

  get length() {
    return this._length;
  }

  set length(newLength){
    if (typeof newLength !== 'number' || isNaN(newLength) || newLength < 0) {
      throw new TypeError('newLength must be a positive number');
    }

    this._length = newLength;
  }

  get students() {
    return this._students;
  }

  set students(newArray){
    if (!Array.isArray(newArray)) {
      throw new TypeError('newArray must be an array');
    }

    for (const student of newArray) {
      if (typeof student !== 'string') {
        throw new TypeError('newArray must be an array of strings');
      }
    }

    this._students = newArray;
  }
}
