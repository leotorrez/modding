# CommandList

CommandLists are akin to functions in your averge program language. You can call them from within overrides, present and other commandlists. When called they can create a new draw call. In order too verify if this is the case, the best is to make a framedump analysis and check the render targets. If you see a new render target, then you know that a new draw call was created.

## Definition:
```ini
[CommandList*]
...

[CommandListToggleLogic]
...

[CommandListFixReflection]
...
```

## Usage:
```ini
[Present]
run = CommandListExample
post run = CommandListExample2

...

[CommandListNesting]
run = CommandListExample3

...
```
Since the `CommandList` section is all about advanced operations, there are no fixed properties. The only elements that might be repeated are various [Variables](#variable) and [Conditions](#condition).

---
