---
next: 
    text: Glossary
    link: /glossary
---

# 3dmigoto INI File Documentation

## Preface

This is a XXMI-based ini file documentation. This is the first version, so only the most basic syntax is covered. Some programming language knowledge may be required. But don't worry, we will update it in the future, the ultimate goal is to make `ini` easy to understand.

This wiki was originally written in chinese; Later it has been translated and revised by a non-english native and then reworked by a non-english person, so some translation errors may have occured.

## Notice

This documentation was written specifically for GIMI. Some syntax may not apply to 3DMigoto or it's forks. Most syntax won't apply in standard `.ini` files.

It is recommended to turn on file extensions in your explorer view and use the [development version of GIMI](https://github.com/SilentNightSound/GI-Model-Importer/releases) (the same version as the playable GIMI plus overlay errors) because it is useful for troubleshooting when developing `.ini` files.

---

## .ini Structure introduction

Since `ini` is not the focus of this article, and the relevant `ini` syntax can be found on the [Internet](https://en.wikipedia.org/wiki/INI_file), we will only explain how to read `ini` in short.
The following is an example, which is from a very common mod syntax.

```ini
;Constants -------------------------------
[Constants]
global value = 1
...

;Overrides -------------------------------
[TextureOverrideExampleA]
hash = abcd1234
match_first_index = 0
ib = ResourceExampleAIB
ps-t0 = ResourceExampleADiffuse
...
;Resources -------------------------------
[ResourceExampleAIB]
type = Buffer
format = DXGI_FORMAT_R32_UNIT
filename = IB.ib

[ResourceExampleADiffuse]
filename = ExampleADiffuse.dds
...

```

This can simply be divided into three parts: sections, properties, and comments.
Sections and properties are case-insensitive, but in GIMI, sections are written in uppercase camel case.

## Section

```ini
[TextureOverrideExampleA]
[ShaderOverrideExampleB]
[ResourceExampleC]
[CommandListExampleD]
...
```

The part enclosed in [] is the beginning of a **section** as well as it's identifier. A section represents a code block, and its scope includes the current line, up to the line before the next section or the end of the file. All other types need to be within a section, with the exception of [namespace](./namespace). Lastly, it's worth mentioning that INI files are case-insensitive, but in GIMI section names follow the PascalCase convention.

## Properties

```ini
...
exampleConfiguration = 1
run = CommandListExampleA
$exampleVariable = 1000
...
```

Properties are sub-items of a section, they are often used to assign values or to excecute functions within the scope of that section. They can be [Parameters](./parameters) or [Variables](./variables), more information about them can be found in their respective sections.

## Comments

Also referred to as annotations, comments start with `;` and continue until the end of the line. Here's one thing to note: in INI files, comments can only occupy a separate line. In other words, placing a semicolon after a property or section is not allowed.

```ini
; Commenting a whole line separately is allowed
[TextureOverrideA] ; Commenting after a section or property is not allowed
hash = abcd1234 ; Note that commenting in the wrong place will result in correct syntax highlighting in some software but will cause compilation issues regardless
```

That's the basic introduction to INI files. As long as you know how to distinguish between sections and properties, and how to write comments, you should be good.

## Reserved words

> There are some words that shouldn't be used as variables because they could overwrite some system-defined values.

[time]

[if, endif, else if, else]

[run]

[x123, y123, z123, w123] (These numbers can vary, they are just examples.)

There is a lot more reserved words, but they are not listed here because they are not commonly used in mods files.
<!-- TODO: add more detail about how 3dm properties can be modified from within mods files. which are likley to be mistakenly used as variables. -->
---

First timers should take a look into syntax to comprehend better how to write `.ini` files and their capabilities. More experienced users will have a better time reading specific sections of this wiki, please use the navigation tree on the side to find the section you are looking for.
