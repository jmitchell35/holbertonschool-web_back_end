export default class HolbertonCourse {
  constructor(name, length, students) {
    if (typeof name !== 'string') {
      throw new TypeError('Name must be a string');
    }

    if (typeof length !== 'number' || Number.isNaN(length) || length < 0) {
      throw new TypeError('Length must be a number');
    }

    if (!Array.isArray(students)) {
      throw new TypeError('Students must be an array');
    }

    for (const student of students) {
      if (typeof student !== 'string') {
        throw new TypeError('Students must be an array of strings');
      }
    }

    this._name = name;
    this._length = length;
    this._students = students;
  }

  get name() {
    return this._name;
  }

  set name(newName) {
    if (typeof newName !== 'string') {
      throw new TypeError('Name must be a string');
    }

    this._name = newName;
  }

  get length() {
    return this._length;
  }

  set length(newLength) {
    if (typeof newLength !== 'number' || Number.isNaN(newLength) || newLength < 0) {
      throw new TypeError('Length must be a number');
    }

    this._length = newLength;
  }

  get students() {
    return this._students;
  }

  set students(newArray) {
    if (!Array.isArray(newArray)) {
      throw new TypeError('Students must be an array');
    }

    for (const student of newArray) {
      if (typeof student !== 'string') {
        throw new TypeError('Students must be an array of strings');
      }
    }

    this._students = newArray;
  }
}
