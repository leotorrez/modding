# Namespace
A namespace is useful to access and modify the variables and CommandLists of a specific mod from another mod, without having to worry about the folder structure. This functionality allows for mods to interact without having to force the user to follow a specific folder structure. By default a namespace will be thier folder address.

It's use is rather advanced but very powerful.
## Definition

```ini
 namespace = example\address\to\your\namespace 
 ```
It must go on the first line of your ini file. It's recommended but not obligatory to make your namespaces unique. Either by including the creator name, character and/or mod name in it. Having a unique namespace will prevent conflicts with other mods.

```ini
 namespace = LeoTorreZ\Mona\FontaineDressMona 
 ```
## Usage
Variables, CommandLists, Resources and such are all called in a similar syntax:

```ini
[type]\[namespace]\[variable name]
```

```ini
; main.ini
$\namespace\variable = 0
run = CommandList\namespace\name
this = Resource\namespace\Texture

; namespace.ini
[Constants]
$\namespace\variable = 1
...

[CommandListname]
...

[ResourceTexture]
filename = .\example.dds
...
```
## Example
You can have a main.ini that contains your mod definitions and you call a different mod to track if your character is swimming. The namespace of tracking.ini is what you use to access those values.

```ini
;/Mods/main.ini
...
[Present]
$swapvar = $\global\tracking\isSwimming
...
```

```ini
namespace = global\tracking
;/Mods/BufferValues/tracking.ini

[Constants]
global $isSwimming = 0
...

[Present]
$isSwimming = 1
;in this section you'd develop your logic to properly track if the character is swimming or not. In this example we just set it to 1 for simplicity.
...
```

