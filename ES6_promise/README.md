## Resources

**Read or watch**:

*   [Promise](/rltoken/aNukpnQLStWa6kqBScmZuA "Promise")
*   [JavaScript Promise: An introduction](/rltoken/oE70cO9HPu1lOGuPFzYXXw "JavaScript Promise: An introduction")
*   [Await](/rltoken/7IuGsWrFjpvdJkNJ2nVhNg "Await")
*   [Async](/rltoken/dA3jsQCVsvT1tslyo_8HJQ "Async")
*   [Throw / Try](/rltoken/J7MhpGC9WLbQXe4Jc5hb8Q "Throw / Try")

## Learning Objectives

At the end of this project, you are expected to be able to [explain to anyone](/rltoken/r6SRFxG2oYMlRkvuL9HSmw "explain to anyone"), **without the help of Google**:

*   Promises (how, why, and what)
*   How to use the `then`, `resolve`, `catch` methods
*   How to use every method of the Promise object
*   Throw / Try
*   The await operator
*   How to use an `async` function

## Requirements

*   All your files will be interpreted/compiled on Ubuntu 20.04 LTS using `node 20.x.x` and `npm 9.x.x`
*   Allowed editors: `vi`, `vim`, `emacs`, `Visual Studio Code`
*   All your files should end with a new line
*   A `README.md` file, at the root of the folder of the project, is mandatory
*   Your code should use the `js` extension
*   Your code will be tested using `Jest` and the command `npm run test`
*   Your code will be verified against lint using ESLint
*   All of your functions must be exported

## Tasks

### 1.

Return a Promise using this prototype `function getResponseFromAPI()`
```
bob@dylan:~$ cat 0-main.js
import getResponseFromAPI from "./0-promise.js";

const response = getResponseFromAPI();
console.log(response instanceof Promise);

bob@dylan:~$ 
bob@dylan:~$ npm run dev 0-main.js 
true
bob@dylan:~$
```
  

### 2.

Using the prototype below, return a `promise`. The parameter is a `boolean`.
```
getFullResponseFromAPI(success)
```
When the argument is:

*   `true`
    *   resolve the promise by passing an object with 2 attributes:
        *   `status`: `200`
        *   `body`: `'Success'`
*   `false`
    *   reject the promise with an error object with the message `The fake API is not working currently`

Try testing it out for yourself
```
bob@dylan:~$ cat 1-main.js
import getFullResponseFromAPI from './1-promise';

console.log(getFullResponseFromAPI(true));
console.log(getFullResponseFromAPI(false));

bob@dylan:~$ 
bob@dylan:~$ npm run dev 1-main.js 
Promise { { status: 200, body: 'Success' } }
Promise {
  <rejected> Error: The fake API is not working currently
    ...
    ...
bob@dylan:~$
```
  

### 3.

Using the function prototype below
```
function handleResponseFromAPI(promise)
```
Append three handlers to the function:

*   When the Promise resolves, return an object with the following attributes
    *   `status`: `200`
    *   `body`: `success`
*   When the Promise rejects, return an empty `Error` object
*   For every resolution, log `Got a response from the API` to the console
```
bob@dylan:~$ cat 2-main.js
import handleResponseFromAPI from "./2-then";

const promise = Promise.resolve();
handleResponseFromAPI(promise);

bob@dylan:~$ 
bob@dylan:~$ npm run dev 2-main.js 
Got a response from the API
bob@dylan:~$
```
  

### 4.

In this file, import `uploadPhoto` and `createUser` from `utils.js`

Knowing that the functions in `utils.js` return promises, use the prototype below to collectively resolve all promises and log `body firstName lastName` to the console.
```
function handleProfileSignup()
```
In the event of an error, log `Signup system offline` to the console
```
bob@dylan:~$ cat 3-main.js
import handleProfileSignup from "./3-all";

handleProfileSignup();

bob@dylan:~$ 
bob@dylan:~$ npm run dev 3-main.js 
photo-profile-1 Guillaume Salva
bob@dylan:~$
```
  

### 5.

Using the following prototype
```
function signUpUser(firstName, lastName) {
}
```
That returns a resolved promise with this object:
```
{
  firstName: value,
  lastName: value,
}

bob@dylan:~$ cat 4-main.js
import signUpUser from "./4-user-promise";

console.log(signUpUser("Bob", "Dylan"));

bob@dylan:~$ 
bob@dylan:~$ npm run dev 4-main.js 
Promise { { firstName: 'Bob', lastName: 'Dylan' } }
bob@dylan:~$
```
  

### 6.

Write and export a function named `uploadPhoto`. It should accept one argument `fileName` (string).

The function should return a Promise rejecting with an Error and the string `$fileName cannot be processed`
```
export default function uploadPhoto(filename) {

}

bob@dylan:~$ cat 5-main.js
import uploadPhoto from './5-photo-reject';

console.log(uploadPhoto('guillaume.jpg'));

bob@dylan:~$ 
bob@dylan:~$ npm run dev 5-main.js 
Promise {
  <rejected> Error: guillaume.jpg cannot be processed
  ..
    ..
bob@dylan:~$
```
  

### 7.

Import `signUpUser` from `4-user-promise.js` and `uploadPhoto` from `5-photo-reject.js`.

Write and export a function named `handleProfileSignup`. It should accept three arguments `firstName` (string), `lastName` (string), and `fileName` (string). The function should call the two other functions. When the promises are all settled it should return an array with the following structure:
```
\[
    {
      status: status\_of\_the\_promise,
      value: value or error returned by the Promise
    },
    ...
  \]

bob@dylan:~$ cat 6-main.js
import handleProfileSignup from './6-final-user';

console.log(handleProfileSignup("Bob", "Dylan", "bob\_dylan.jpg"));

bob@dylan:~$ 
bob@dylan:~$ npm run dev 6-main.js 
Promise { <pending> }
bob@dylan:~$
```
  

### 8.

Write and export a function named `loadBalancer`. It should accept two arguments `chinaDownload` (Promise) and `USDownload` (Promise).

The function should return the value returned by the promise that resolved the first.
```
export default function loadBalancer(chinaDownload, USDownload) {

}

bob@dylan:~$ cat 7-main.js
import loadBalancer from "./7-load\_balancer";

const ukSuccess = 'Downloading from UK is faster';
const frSuccess = 'Downloading from FR is faster';

const promiseUK = new Promise(function(resolve, reject) {
    setTimeout(resolve, 100, ukSuccess);
});

const promiseUKSlow = new Promise(function(resolve, reject) {
    setTimeout(resolve, 400, ukSuccess);
});

const promiseFR = new Promise(function(resolve, reject) {
    setTimeout(resolve, 200, frSuccess);
});

const test = async () => {
    console.log(await loadBalancer(promiseUK, promiseFR));
    console.log(await loadBalancer(promiseUKSlow, promiseFR));
}

test();

bob@dylan:~$ 
bob@dylan:~$ npm run dev 7-main.js 
Downloading from UK is faster
Downloading from FR is faster
bob@dylan:~$
```
  

### 9.

Write a function named `divideFunction` that will accept two arguments: `numerator` (Number) and `denominator` (Number).

When the `denominator` argument is equal to 0, the function should throw a new error with the message `cannot divide by 0`. Otherwise it should return the numerator divided by the denominator.
```
export default function divideFunction(numerator, denominator) {

}

bob@dylan:~$ cat 8-main.js
import divideFunction from './8-try';

console.log(divideFunction(10, 2));
console.log(divideFunction(10, 0));

bob@dylan:~$ 
bob@dylan:~$ npm run dev 8-main.js 
5
..../8-try.js:15
  throw Error('cannot divide by 0');
  ^
.....

bob@dylan:~$
```
  

### 10.

Write a function named `guardrail` that will accept one argument `mathFunction` (Function).

This function should create and return an array named `queue`.

When the `mathFunction` function is executed, the value returned by the function should be appended to the queue. If this function throws an error, the error message should be appended to the queue. In every case, the message `Guardrail was processed` should be added to the queue.

Example:
```
\[
  1000,
  'Guardrail was processed',
\]

bob@dylan:~$ cat 9-main.js
import guardrail from './9-try';
import divideFunction from './8-try';

console.log(guardrail(() => { return divideFunction(10, 2)}));
console.log(guardrail(() => { return divideFunction(10, 0)}));

bob@dylan:~$ 
bob@dylan:~$ npm run dev 9-main.js 
\[ 5, 'Guardrail was processed' \]
\[ 'Error: cannot divide by 0', 'Guardrail was processed' \]
bob@dylan:~$
```
