
# Modifiers
 Modifiers are keywords that can be used to modify the behavior of a property. They are placed at the beginning of a property and are separated from the property name by a space. The following modifiers are available:

---

## post

Specifies that the corresponding parameter is computed at the ***beginning of a frame***, such as setting the start time of a frame.
```ini
post $triggerDate = time
```

## pre

Specifies that the corresponding parameter is computed at the ***end of a frame***, such as calculating the number of times [Present](#present) has been executed.
```ini
pre $auxTime = $auxTime + 1
```

## ref

`ref` or `reference` are used as pointers to a resource. It's up to the programmer to take advantage of this powerful tool. Advanced discussion of this topic can be found at: https://github.com/bo3b/3Dmigoto/wiki/Resource-Copying
```ini
pre ResourceHelp = ref ResourceHelpFull
pre ResourceHelp = reference ResourceHelpFull
```
## copy

It copies the resource into the new one. Very helpful to keep a copy of a resource before it gets modified by another shader or draw call.
```ini
pre ResourceHelp = copy ResourceHelpFull
```

## run

Declares the section to be executed.
Commonly used to refer to a [CommandList](#commandlist) for further computations.
```ini
[KeyChangeColor]
run = CommandListLumineChangeDressColor
```
