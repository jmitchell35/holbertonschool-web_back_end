## Resources

**Read or watch**:

*   [Array](/rltoken/fXeF-M30vPa-VR4qdM1hbQ "Array")
*   [Typed Array](/rltoken/K8YavMi9P0JsBDS4W8PXvw "Typed Array")
*   [Set Data Structure](/rltoken/47KxkohflmsBUjMCzRxMkQ "Set Data Structure")
*   [Map Data Structure](/rltoken/c01xzbbE1CXwbXEW8jS0gQ "Map Data Structure")
*   [WeakMap](/rltoken/f-CLehBUa4LvtJt5c_tEUw "WeakMap")

## Learning Objectives

At the end of this project, you are expected to be able to [explain to anyone](/rltoken/zzHjkh9ju_sW7hoJXB_gfQ "explain to anyone"), **without the help of Google**:

*   How to use map, filter and reduce on arrays
*   Typed arrays
*   The Set, Map, and Weak link data structures

## Requirements

*   All your files will be interpreted/compiled on Ubuntu 20.04 LTS using `node 20.x.x` and `npm 9.x.x`
*   Allowed editors: `vi`, `vim`, `emacs`, `Visual Studio Code`
*   All your files should end with a new line
*   A `README.md` file, at the root of the folder of the project, is mandatory
*   Your code should use the `js` extension
*   Your code will be tested using `Jest` and the command `npm run test`
*   Your code will be verified against lint using ESLint
*   Your code needs to pass all the tests and lint. You can verify the entire project running `npm run full-test`
*   All of your functions must be exported

## Tasks

### 1.

Create a function named `getListStudents` that returns an array of objects.

Each object should have three attributes: `id` (Number), `firstName` (String), and `location` (String).

The array contains the following students in order:

*   `Guillaume`, id: `1`, in `San Francisco`
*   `James`, id: `2`, in `Columbia`
*   `Serena`, id: `5`, in `San Francisco`
```
bob@dylan:~$ cat 0-main.js
import getListStudents from "./0-get\_list\_students.js";

console.log(getListStudents());

bob@dylan:~$ 
bob@dylan:~$ npm run dev 0-main.js 
\[
  { id: 1, firstName: 'Guillaume', location: 'San Francisco' },
  { id: 2, firstName: 'James', location: 'Columbia' },
  { id: 5, firstName: 'Serena', location: 'San Francisco' }
\]
bob@dylan:~$
```
  

### 2.

Create a function `getListStudentIds` that returns an array of ids from a list of object.

This function is taking one argument which is an array of objects - and this array is the same format as `getListStudents` from the previous task.

If the argument is not an array, the function is returning an empty array.

You must use the `map` function on the array.
```
bob@dylan:~$ cat 1-main.js
import getListStudentIds from "./1-get\_list\_student\_ids.js";
import getListStudents from "./0-get\_list\_students.js";

console.log(getListStudentIds("hello"));
console.log(getListStudentIds(getListStudents()));

bob@dylan:~$ 
bob@dylan:~$ npm run dev 1-main.js 
\[\]
\[ 1, 2, 5 \]
bob@dylan:~$
```
  

### 3.

Create a function `getStudentsByLocation` that returns an array of objects who are located in a specific city.

It should accept a list of students (from `getListStudents`) and a `city` (string) as parameters.

You must use the `filter` function on the array.
```
bob@dylan:~$ cat 2-main.js
import getListStudents from "./0-get\_list\_students.js";
import getStudentsByLocation from "./2-get\_students\_by\_loc.js";

const students = getListStudents();

console.log(getStudentsByLocation(students, 'San Francisco'));

bob@dylan:~$ 
bob@dylan:~$ npm run dev 2-main.js 
\[
  { id: 1, firstName: 'Guillaume', location: 'San Francisco' },
  { id: 5, firstName: 'Serena', location: 'San Francisco' }
\]
bob@dylan:~$
```
  

### 4.

Create a function `getStudentIdsSum` that returns the sum of all the student ids.

It should accept a list of students (from `getListStudents`) as a parameter.

You must use the `reduce` function on the array.
```
bob@dylan:~$ cat 3-main.js
import getListStudents from "./0-get\_list\_students.js";
import getStudentIdsSum from "./3-get\_ids\_sum.js";

const students = getListStudents();
const value = getStudentIdsSum(students);

console.log(value);

bob@dylan:~$ 
bob@dylan:~$ npm run dev 3-main.js 
8
bob@dylan:~$
```
  

### 5.

Create a function `updateStudentGradeByCity` that returns an array of students for a specific city with their new grade

It should accept a list of students (from `getListStudents`), a `city` (String), and `newGrades` (Array of “grade” objects) as parameters.

`newGrades` is an array of objects with this format:
```
{
    studentId: 31,
    grade: 78,
  }
```
If a student doesn’t have grade in `newGrades`, the final grade should be `N/A`.

You must use `filter` and `map` combined.
```
bob@dylan:~$ cat 4-main.js
import getListStudents from "./0-get\_list\_students.js";
import updateStudentGradeByCity from "./4-update\_grade\_by\_city.js";

console.log(updateStudentGradeByCity(getListStudents(), "San Francisco", \[{ studentId: 5, grade: 97 }, { studentId: 1, grade: 86 }\]));

console.log(updateStudentGradeByCity(getListStudents(), "San Francisco", \[{ studentId: 5, grade: 97 }\]));

bob@dylan:~$ 
bob@dylan:~$ npm run dev 4-main.js 
\[
  {
    id: 1,
    firstName: 'Guillaume',
    location: 'San Francisco',
    grade: 86
  },
  { id: 5, firstName: 'Serena', location: 'San Francisco', grade: 97 }
\]
\[
  {
    id: 1,
    firstName: 'Guillaume',
    location: 'San Francisco',
    grade: 'N/A'
  },
  { id: 5, firstName: 'Serena', location: 'San Francisco', grade: 97 }
\]
bob@dylan:~$
```
  

### 6.

Create a function named `createInt8TypedArray` that returns a new `ArrayBuffer` with an `Int8` value at a specific position.

It should accept three arguments: `length` (Number), `position` (Number), and `value` (Number).

If adding the value is not possible the error `Position outside range` should be thrown.
```
bob@dylan:~$ cat 5-main.js
import createInt8TypedArray from "./5-typed\_arrays.js";

console.log(createInt8TypedArray(10, 2, 89));

bob@dylan:~$ 
bob@dylan:~$ npm run dev 5-main.js 
DataView {
  byteLength: 10,
  byteOffset: 0,
  buffer: ArrayBuffer {
    \[Uint8Contents\]: <00 00 59 00 00 00 00 00 00 00>,
    byteLength: 10
  }
}
bob@dylan:~$
```
  

### 7.

Create a function named `setFromArray` that returns a `Set` from an array.

It accepts an argument (Array, of any kind of element).
```
bob@dylan:~$ cat 6-main.js
import setFromArray from "./6-set.js";

console.log(setFromArray(\[12, 32, 15, 78, 98, 15\]));

bob@dylan:~$ 
bob@dylan:~$ npm run dev 6-main.js 
Set { 12, 32, 15, 78, 98 }
bob@dylan:~$
```
  

### 8.

Create a function named `hasValuesFromArray` that returns a boolean if all the elements in the array exist within the set.

It accepts two arguments: a `set` (Set) and an `array` (Array).
```
bob@dylan:~$ cat 7-main.js
import hasValuesFromArray from "./7-has\_array\_values.js";

console.log(hasValuesFromArray(new Set(\[1, 2, 3, 4, 5\]), \[1\]));
console.log(hasValuesFromArray(new Set(\[1, 2, 3, 4, 5\]), \[10\]));
console.log(hasValuesFromArray(new Set(\[1, 2, 3, 4, 5\]), \[1, 10\]));

bob@dylan:~$ 
bob@dylan:~$ npm run dev 7-main.js 
true
false
false
bob@dylan:~$
```
  

### 9.

Create a function named `cleanSet` that returns a string of all the set values that start with a specific string (`startString`).

It accepts two arguments: a `set` (Set) and a `startString` (String).

When a value starts with `startString` you only append the rest of the string. The string contains all the values of the set separated by `-`.
```
bob@dylan:~$ cat 8-main.js
import cleanSet from "./8-clean\_set.js";

console.log(cleanSet(new Set(\['bonjovi', 'bonaparte', 'bonappetit', 'banana'\]), 'bon'));
console.log(cleanSet(new Set(\['bonjovi', 'bonaparte', 'bonappetit', 'banana'\]), ''));

bob@dylan:~$ 
bob@dylan:~$ npm run dev 8-main.js 
jovi-aparte-appetit

bob@dylan:~$
```
  

### 10.

Create a function named `groceriesList` that returns a map of groceries with the following items (name, quantity):
```
Apples, 10
Tomatoes, 10
Pasta, 1
Rice, 1
Banana, 5
```
Result:
```
bob@dylan:~$ cat 9-main.js
import groceriesList from "./9-groceries\_list.js";

console.log(groceriesList());

bob@dylan:~$ 
bob@dylan:~$ npm run dev 9-main.js 
Map {
  'Apples' => 10,
  'Tomatoes' => 10,
  'Pasta' => 1,
  'Rice' => 1,
  'Banana' => 5
}
bob@dylan:~$
```
  

### 11.

Create a function named `updateUniqueItems` that returns an updated map for all items with initial quantity at 1.

It should accept a map as an argument. The map it accepts for argument is similar to the map you create in the previous task.

For each entry of the map where the quantity is 1, update the quantity to 100. If updating the quantity is not possible (argument is not a map) the error `Cannot process` should be thrown.
```
bob@dylan:~$ cat 10-main.js
import updateUniqueItems from "./10-update\_uniq\_items.js";
import groceriesList from "./9-groceries\_list.js";

const map = groceriesList();
console.log(map);

updateUniqueItems(map)
console.log(map);

bob@dylan:~$ 
bob@dylan:~$ npm run dev 10-main.js 
Map {
  'Apples' => 10,
  'Tomatoes' => 10,
  'Pasta' => 1,
  'Rice' => 1,
  'Banana' => 5
}
Map {
  'Apples' => 10,
  'Tomatoes' => 10,
  'Pasta' => 100,
  'Rice' => 100,
  'Banana' => 5
}
bob@dylan:~$
```
