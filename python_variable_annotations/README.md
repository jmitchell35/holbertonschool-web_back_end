## Resources

**Read or watch**:

*   [Python 3 typing documentation](/rltoken/HkhGh45geTWVPwYQtwZxuw "Python 3 typing documentation")
*   [MyPy cheat sheet](/rltoken/puu3jc5JT5rMI2B7EYdnXA "MyPy cheat sheet")

## Learning Objectives

### General

At the end of this project, you are expected to be able to [explain to anyone](/rltoken/u8rxH9rCLFQwUn_V3bV7aw "explain to anyone"), **without the help of Google**:

*   Type annotations in Python 3
*   How you can use type annotations to specify function signatures and variable types
*   Duck typing
*   How to validate your code with `mypy`

## Requirements

### General

*   Allowed editors: `vi`, `vim`, `emacs`
*   All your files will be interpreted/compiled on Ubuntu 20.04 LTS using `python3` (version 3.9)
*   All your files should end with a new line
*   The first line of all your files should be exactly `#!/usr/bin/env python3`
*   A `README.md` file, at the root of the folder of the project, is mandatory
*   Your code should use the `pycodestyle` style (version 2.5.)
*   All your files must be executable
*   The length of your files will be tested using `wc`
*   All your modules should have a documentation (`python3 -c 'print(__import__("my_module").__doc__)'`)
*   All your classes should have a documentation (`python3 -c 'print(__import__("my_module").MyClass.__doc__)'`)
*   All your functions (inside and outside a class) should have a documentation (`python3 -c 'print(__import__("my_module").my_function.__doc__)'` and `python3 -c 'print(__import__("my_module").MyClass.my_function.__doc__)'`)
*   A documentation is not a simple word, it’s a real sentence explaining what’s the purpose of the module, class or method (the length of it will be verified)

## Tasks

### 1.

Write a type-annotated function `add` that takes a float `a` and a float `b` as arguments and returns their sum as a float.
```
bob@dylan:~$ cat 0-main.py
#!/usr/bin/env python3
add = \_\_import\_\_('0-add').add

print(add(1.11, 2.22) == 1.11 + 2.22)
print(add.\_\_annotations\_\_)

bob@dylan:~$ ./0-main.py
True
{'a':  <class 'float'>, 'b': <class 'float'>, 'return': <class 'float'>}
```
  

### 2.

Write a type-annotated function `concat` that takes a string `str1` and a string `str2` as arguments and returns a concatenated string
```
bob@dylan:~$ cat 1-main.py
#!/usr/bin/env python3
concat = \_\_import\_\_('1-concat').concat

str1 = "egg"
str2 = "shell"

print(concat(str1, str2) == "{}{}".format(str1, str2))
print(concat.\_\_annotations\_\_)

bob@dylan:~$ ./1-main.py
True
{'str1': <class 'str'>, 'str2': <class 'str'>, 'return': <class 'str'>}
```
  

### 3.

Write a type-annotated function `floor` which takes a float `n` as argument and returns the floor of the float.
```
bob@dylan:~$ cat 2-main.py
#!/usr/bin/env python3

import math

floor = \_\_import\_\_('2-floor').floor

ans = floor(3.14)

print(ans == math.floor(3.14))
print(floor.\_\_annotations\_\_)
print("floor(3.14) returns {}, which is a {}".format(ans, type(ans)))

bob@dylan:~$ ./2-main.py
True
{'n': <class 'float'>, 'return': <class 'int'>}
floor(3.14) returns 3, which is a <class 'int'>
```
  

### 4.

Write a type-annotated function `to_str` that takes a float `n` as argument and returns the string representation of the float.
```
bob@dylan:~$ cat 3-main.py
#!/usr/bin/env python3
to\_str = \_\_import\_\_('3-to\_str').to\_str

pi\_str = to\_str(3.14)
print(pi\_str == str(3.14))
print(to\_str.\_\_annotations\_\_)
print("to\_str(3.14) returns {} which is a {}".format(pi\_str, type(pi\_str)))

bob@dylan:~$ ./3-main.py
True
{'n': <class 'float'>, 'return': <class 'str'>}
to\_str(3.14) returns 3.14, which is a <class 'str'>
```
  

### 5.

Define and annotate the following variables with the specified values:

*   `a`, an integer with a value of 1
*   `pi`, a float with a value of 3.14
*   `i_understand_annotations`, a boolean with a value of True
*   `school`, a string with a value of “Holberton”
```
bob@dylan:~$ cat 4-main.py
#!/usr/bin/env python3

a = \_\_import\_\_('4-define\_variables').a
pi = \_\_import\_\_('4-define\_variables').pi
i\_understand\_annotations = \_\_import\_\_('4-define\_variables').i\_understand\_annotations
school = \_\_import\_\_('4-define\_variables').school

print("a is a {} with a value of {}".format(type(a), a))
print("pi is a {} with a value of {}".format(type(pi), pi))
print("i\_understand\_annotations is a {} with a value of {}".format(type(i\_understand\_annotations), i\_understand\_annotations))
print("school is a {} with a value of {}".format(type(school), school))

bob@dylan:~$ ./4-main.py
a is a <class 'int'> with a value of 1
pi is a <class 'float'> with a value of 3.14
i\_understand\_annotations is a <class 'bool'> with a value of True
school is a <class 'str'> with a value of Holberton
```
  

### 6.

Write a type-annotated function `sum_list` which takes a list `input_list` of floats as argument and returns their sum as a float.
```
bob@dylan:~$ cat 5-main.py
#!/usr/bin/env python3

sum\_list = \_\_import\_\_('5-sum\_list').sum\_list

floats = \[3.14, 1.11, 2.22\]
floats\_sum = sum\_list(floats)
print(floats\_sum == sum(floats))
print(sum\_list.\_\_annotations\_\_)
print("sum\_list(floats) returns {} which is a {}".format(floats\_sum, type(floats\_sum)))

bob@dylan:~$ ./5-main.py
True
{'input\_list': typing.List\[float\], 'return': <class 'float'>}
sum\_list(floats) returns 6.470000000000001 which is a <class 'float'>
```
  

### 7.

Write a type-annotated function `sum_mixed_list` which takes a list `mxd_lst` of integers and floats and returns their sum as a float.
```
bob@dylan:~$ cat 6-main.py
#!/usr/bin/env python3

sum\_mixed\_list = \_\_import\_\_('6-sum\_mixed\_list').sum\_mixed\_list

print(sum\_mixed\_list.\_\_annotations\_\_)
mixed = \[5, 4, 3.14, 666, 0.99\]
ans = sum\_mixed\_list(mixed)
print(ans == sum(mixed))
print("sum\_mixed\_list(mixed) returns {} which is a {}".format(ans, type(ans)))

bob@dylan:~$ ./6-main.py
{'mxd\_lst': typing.List\[typing.Union\[int, float\]\], 'return': <class 'float'>}
True
sum\_mixed\_list(mixed) returns 679.13 which is a <class 'float'>
```
  

### 8.

Write a type-annotated function `to_kv` that takes a string `k` and an int OR float `v` as arguments and returns a tuple. The first element of the tuple is the string `k`. The second element is the square of the int/float `v` and should be annotated as a float.
```
bob@dylan:~$ cat 7-main.py
#!/usr/bin/env python3

to\_kv = \_\_import\_\_('7-to\_kv').to\_kv

print(to\_kv.\_\_annotations\_\_)
print(to\_kv("eggs", 3))
print(to\_kv("school", 0.02))

bob@dylan:~$ ./7-main.py
{'k': <class 'str'>, 'v': typing.Union\[int, float\], 'return': typing.Tuple\[str, float\]}
('eggs', 9)
('school', 0.0004)
```
  

### 9.

Write a type-annotated function `make_multiplier` that takes a float `multiplier` as argument and returns a function that multiplies a float by `multiplier`.
```
bob@dylan:~$ cat 8-main.py
#!/usr/bin/env python3

make\_multiplier = \_\_import\_\_('8-make\_multiplier').make\_multiplier
print(make\_multiplier.\_\_annotations\_\_)
fun = make\_multiplier(2.22)
print("{}".format(fun(2.22)))

bob@dylan:~$ ./8-main.py
{'multiplier': <class 'float'>, 'return': typing.Callable\[\[float\], float\]}
4.928400000000001
```
  

### 10.

Annotate the below function’s parameters and return values with the appropriate types
```
def element\_length(lst):
    return \[(i, len(i)) for i in lst\]

bob@dylan:~$ cat 9-main.py 
#!/usr/bin/env python3

element\_length =  \_\_import\_\_('9-element\_length').element\_length

print(element\_length.\_\_annotations\_\_)

bob@dylan:~$ ./9-main.py 
{'lst': typing.Iterable\[typing.Sequence\], 'return': typing.List\[typing.Tuple\[typing.Sequence, int\]\]}
```
