
# Arimethical Operators

This is just a list of operators allowed in GIMI and does not include any usage tutorials.

| Operators | Name           | Note                            |
| --------- | -------------- | ------------------------------- |
| +         | Addition       |                                 |
| -         | Subtraction    |                                 |
| *         | Multiplication |                                 |
| /         | Division       |                                 |
| //        | Division Floor |                                 |
| %         | Modulus        |                                 |
| =         | Assignment     |                                 |
| ==        | Equal          |                                 |
| !=        | Not equal      |                                 |
| !==       | Not equal      | Similar to `!=` but more strict |

# Logical Operators

This is just a list of operators allowed in GIMI and does not include any usage tutorials.

| Operators | Name           | Note                      |
| --------- | -------------- | ------------------------- |
| &&        | AND            |                           |
| \|\|      | OR             |                           |
| ( )       | Parenthesis    |                           |

# Condition

GIMI has control structures as reserved words, including `if`, `else if`, `else`, and `endif`.
The condition block starts with `if` and ends with `endif`. Nesting is supported.
If you are new to programming, it is recommended to familiarize yourself with condition control syntax in other programming languages. This explanation will not delve into it extensively. 

```ini
if time == $lest_date + 10.0
    run = CommandListA
else if time == $lest_date + 15.0
    run = CommandListB
else
    run = CommandListC
endif
```

It's worth mentioning other control structures such as for, while, and switch are not supported in GIMI at the time of writing this document.