## Resources

**Read or watch**:

*   [PEP 530 – Asynchronous Comprehensions](/rltoken/UFCR8qW3nHmEDZZaHqXL7Q "PEP 530 -- Asynchronous Comprehensions")
*   [What’s New in Python: Asynchronous Comprehensions / Generators](/rltoken/PAGwxZUyVGBR8EMFGGNnGg "What’s New in Python: Asynchronous Comprehensions / Generators")
*   [Type-hints for generators](/rltoken/SAxOMI925qJrJVGmZ0JBNw "Type-hints for generators")

## Learning Objectives

At the end of this project, you are expected to be able to [explain to anyone](/rltoken/7bPmbDGSheZBV1GZtaNBXg "explain to anyone"), **without the help of Google**:

*   How to write an asynchronous generator
*   How to use async comprehensions
*   How to type-annotate generators

## Requirements

### General

*   Allowed editors: `vi`, `vim`, `emacs`
*   All your files will be interpreted/compiled on Ubuntu 20.04 LTS using `python3` (version 3.9)
*   All your files should end with a new line
*   The first line of all your files should be exactly `#!/usr/bin/env python3`
*   A `README.md` file, at the root of the folder of the project, is mandatory
*   Your code should use the `pycodestyle` style (version 2.5.x)
*   The length of your files will be tested using `wc`
*   All your modules should have a documentation (`python3 -c 'print(__import__("my_module").__doc__)'`)
*   All your functions should have a documentation (`python3 -c 'print(__import__("my_module").my_function.__doc__)'`
*   A documentation is not a simple word, it’s a real sentence explaining what’s the purpose of the module, class or method (the length of it will be verified)
*   All your functions and coroutines must be type-annotated.

## Tasks

### 1.

Write a coroutine called `async_generator` that takes no arguments.

The coroutine will loop 10 times, each time asynchronously wait 1 second, then yield a random number between 0 and 10. Use the `random` module.
```
bob@dylan:~$ cat 0-main.py
#!/usr/bin/env python3

import asyncio

async\_generator = \_\_import\_\_('0-async\_generator').async\_generator

async def print\_yielded\_values():
    result = \[\]
    async for i in async\_generator():
        result.append(i)
    print(result)

asyncio.run(print\_yielded\_values())

bob@dylan:~$ ./0-main.py
\[4.403136952967102, 6.9092712604587465, 6.293445466782645, 4.549663490048418, 4.1326571686139015, 9.99058525304903, 6.726734105473811, 9.84331704602206, 1.0067279479988345, 1.3783306401737838\]
```
  

### 2.

Import `async_generator` from the previous task and then write a coroutine called `async_comprehension` that takes no arguments.

The coroutine will collect 10 random numbers using an async comprehensing over `async_generator`, then return the 10 random numbers.
```
bob@dylan:~$ cat 1-main.py
#!/usr/bin/env python3

import asyncio

async\_comprehension = \_\_import\_\_('1-async\_comprehension').async\_comprehension

async def main():
    print(await async\_comprehension())

asyncio.run(main())

bob@dylan:~$ ./1-main.py
\[9.861842105071727, 8.572355293354995, 1.7467182056248265, 4.0724372912858575, 0.5524750922145316, 8.084266576021555, 8.387128918690468, 1.5486451376520916, 7.713335177885325, 7.673533267041574\]
```
  

### 3.

Import `async_comprehension` from the previous file and write a `measure_runtime` coroutine that will execute `async_comprehension` four times in parallel using `asyncio.gather`.

`measure_runtime` should measure the total runtime and return it.

Notice that the total runtime is roughly 10 seconds, explain it to yourself.
```
bob@dylan:~$ cat 2-main.py
#!/usr/bin/env python3

import asyncio

measure\_runtime = \_\_import\_\_('2-measure\_runtime').measure\_runtime

async def main():
    return await(measure\_runtime())

print(
    asyncio.run(main())
)

bob@dylan:~$ ./2-main.py
10.021936893463135
```
