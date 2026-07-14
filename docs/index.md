# 3DMigoto Configuration Reference

Welcome to the comprehensive 3DMigoto INI configuration documentation. This reference covers the configuration system used by 3DMigoto and its forks (XXMI, GIMI, WWMI, SRMI, etc.) for modding DirectX 11 games.

## What is 3DMigoto?

3DMigoto is a DirectX 11 shader manipulation and asset replacement framework. It allows you to:

- **Replace game assets** - Swap textures, models, and shaders
- **Modify rendering** - Change how objects are rendered
- **Inject custom code** - Add new rendering effects
- **Debug graphics** - Hunt shaders and analyze frames
- **Create interactive mods** - Bind actions to keys

All of this is configured through INI files using a powerful command-based syntax.

## Quick Start

### For New Users

If you're new to 3DMigoto modding:

1. **Start with basics** - [INI File Structure](#ini-file-structure) below
2. **Learn core concepts** - [Core Concepts](#core-concepts)
3. **Follow a tutorial** - [Common Workflows](#common-workflows)
4. **Reference as needed** - Use the sidebar to find specific topics

### For Experienced Users

Jump directly to what you need:

- **[Override](/docs/override.md)** - ShaderOverride and TextureOverride overview
- **[Command List](/docs/command-list.md)** - Command syntax reference
- **[Resource](/docs/resource.md)** - Define custom resources
- **[Glossary](/docs/glossary.md)** - Quick term lookup
- **[Troubleshooting](/docs/troubleshooting.md)** - Common issues

---

## INI File Structure

3DMigoto uses INI files for configuration. Understanding the basic structure is essential.

### Sections

Sections are code blocks identified by names in square brackets:

```ini
[TextureOverrideCharacter]
hash = abc12345
vb0 = ResourcePositionBuffer

[ResourcePositionBuffer]
type = Buffer
filename = character.buf
```

**Section names are case-insensitive** but conventionally use PascalCase.

### Properties

Properties are key-value pairs within sections:

```ini
[TextureOverrideExample]
hash = abc12345           ; Property: identifier
vb0 = ResourceName        ; Property: resource binding
$variable = 1.0           ; Property: variable assignment
```

### Comments

Comments start with `;` and continue to end of line:

```ini
; This is a comment
[TextureOverrideExample]  ; Comments AFTER sections/properties are NOT allowed
hash = abc12345           ; This will cause errors
```

::: warning
Comments must be on their own line. Inline comments (after properties) are not supported and will cause parsing errors.
:::

### Variables

Two types of variables:

```ini
; IniParams (x, y, z, w with optional index)
x = 1.0
y5 = 2.5

; Named variables (must be declared in [Constants])
$my_variable = 10
```

### Reserved Words

Avoid using these as variable names:
- Control flow: `if`, `else`, `else if`, `endif`
- Commands: `run`, `draw`, `handling`
- Built-ins: `time`, `cursor_showing`, `active_index`
- IniParams: `x`, `y`, `z`, `w` (with or without numbers)

---

## Core Concepts

### 1. Override System

The foundation of 3DMigoto modding. Override sections match game objects and execute commands.

**[Override](/docs/override.md)** - Central overview and comparison

**[ShaderOverride](/docs/shader-override.md)** - Match shaders by hash, execute commands on draw calls
```ini
[ShaderOverrideCharacter]
hash = abc12345def67890
ps-t0 = ResourceCustomTexture
```

**[TextureOverride](/docs/texture-override.md)** - Match textures/buffers by hash or properties
```ini
[TextureOverrideCustomModel]
hash = abc12345
vb0 = ResourceNewModel
ib = ResourceNewIndices
```

### 2. Resources

Define custom assets to inject into the game.

**[Resource](/docs/resource.md)** - Complete resource reference
```ini
[ResourceCustomTexture]
filename = custom_texture.dds

[ResourceCustomBuffer]
type = Buffer
format = DXGI_FORMAT_R32G32B32_FLOAT
filename = vertices.buf
```

### 3. Command Lists

Execute logic and commands conditionally or sequentially.

**[Command List](/docs/command-list.md)** - Complete command syntax
```ini
[CustomCommandList]
if $condition == 1
    ps-t0 = ResourceA
    x = 1.0
else
    ps-t0 = ResourceB
    x = 0.0
endif
```

### 4. Key Bindings

Create interactive mods with keyboard/mouse/controller input.

**[Key](/docs/key.md)** - Complete key binding reference
```ini
[KeyToggleEffect]
key = F1
type = toggle
$effect_enabled = 1
```

### 5. Variables and Expressions

Store values and perform calculations.

**[Constants](/docs/constants.md)** - Variable declaration and IniParams
```ini
[Constants]
global $effect_strength = 1.0
```

**[Expressions](/docs/expressions.md)** - Expression syntax and operators
```ini
x = ($var1 + $var2) * 2.0
if x > 10 && y < 5
    run = SomeLogic
endif
```

---

## Common Workflows

### Workflow 1: Replace a Texture

```ini
; 1. Find texture hash (use hunting mode F10, frame analysis F8)
; 2. Create override section
[TextureOverrideCharacterSkin]
hash = abc12345

; 3. Define custom texture resource
ps-t0 = ResourceCustomSkin

; 4. Define the resource
[ResourceCustomSkin]
filename = custom_skin.dds
```

### Workflow 2: Replace a Model

```ini
; 1. Find texture hash for the model's draw call
[TextureOverrideCharacterBody]
hash = abc12345
handling = skip              ; Skip original draw
vb0 = ResourceNewPosition    ; Replace vertex buffers
vb1 = ResourceNewTexcoord
ib = ResourceNewIndices      ; Replace index buffer
drawindexed = auto           ; Re-draw with new data

; 2. Define resources
[ResourceNewPosition]
type = Buffer
stride = 40
filename = body_position.buf

[ResourceNewTexcoord]
type = Buffer
stride = 24
filename = body_texcoord.buf

[ResourceNewIndices]
type = Buffer
format = DXGI_FORMAT_R32_UINT
filename = body_indices.buf
```

### Workflow 3: Hide an Object

```ini
; Find shader hash and skip its draw calls
[ShaderOverrideHideObject]
hash = abc12345def67890
handling = skip
```

### Workflow 4: Toggle Effect with Key

```ini
; 1. Declare variable
[Constants]
global $effect_enabled = 0

; 2. Create key binding
[KeyToggleEffect]
key = F1
type = toggle
$effect_enabled = 1

; 3. Use in shader override
[ShaderOverrideEffect]
hash = abc12345def67890
if $effect_enabled == 1
    ps-t0 = ResourceEffectTexture
endif
```

### Workflow 5: Conditional Rendering

```ini
; Execute commands based on conditions
[ShaderOverrideConditional]
hash = abc12345def67890
run = ConditionalLogic

[ConditionalLogic]
if cursor_showing
    ; In menu
    x = 0.0
else
    ; In game
    x = 1.0
    ps-t0 = ResourceGameTexture
endif
```

---

## Documentation Sections

### Essential Topics

Start here for core functionality:

- **[Override](/docs/override.md)** - ShaderOverride and TextureOverride overview
- **[Resource](/docs/resource.md)** - Defining custom assets
- **[Command List](/docs/command-list.md)** - Command syntax and flow control
- **[Constants](/docs/constants.md)** - Variables and IniParams
- **[Key](/docs/key.md)** - Keyboard and controller bindings

### Advanced Topics

Dive deeper into powerful features:

- **[Shader Regex](/docs/shader-regex.md)** - Pattern-based shader patching
- **[Fuzzy Matching](/docs/fuzzy-matching.md)** - Match resources by properties
- **[Custom Shader](/docs/custom-shader.md)** - Write custom shaders
- **[Namespace](/docs/namespace.md)** - Variable scoping and isolation
- **[Expressions](/docs/expressions.md)** - Expression syntax and operators

### Reference Documentation

Detailed references for specific features:

- **[Draw Calls](/docs/draw-calls.md)** - Draw and dispatch commands
- **[Modifiers](/docs/modifiers.md)** - Command modifiers (post, pre, etc.)
- **[Flags](/docs/flags.md)** - DirectX 11 flag reference
- **[System Values](/docs/system-values.md)** - Shader semantic reference
- **[Properties](/docs/properties.md)** - Configuration parameter reference
- **[Operators](/docs/operators.md)** - Expression operator reference

### Debugging and Tools

Help with development and troubleshooting:

- **[Debugging](/docs/debugging.md)** - Hunting mode and frame analysis
- **[Logs](/docs/logs.md)** - Log file format and interpretation
- **[Troubleshooting](/docs/troubleshooting.md)** - Common issues and solutions
- **[3DM Statics](/docs/3dm-statics.md)** - Static analysis tools

### Other Topics

Additional features and concepts:

- **[Present](/docs/present.md)** - Per-frame commands
- **[Lifespan of a Frame](/docs/lifespan-of-a-frame.md)** - Frame execution flow
- **[DirectX Pipeline](/docs/directx-pipeline.md)** - DirectX 11 background

---

## Quick Reference

### Finding Hashes

1. **Enable hunting mode** - Press F10 in game
2. **Hunt shaders** - Numpad 1/2 (pixel shaders), 3/4 (vertex shaders)
3. **Frame analysis** - Press F8 to dump all resources
4. **Check logs** - Open d3d11_log.txt for hash information

See [Debugging](/docs/debugging.md) for detailed instructions.

### Common Commands

```ini
; Resource bindings
ps-t0 = ResourceName          ; Bind texture to pixel shader slot 0
vs-cb0 = ResourceName         ; Bind constant buffer to vertex shader
vb0 = ResourceName            ; Bind vertex buffer to slot 0
ib = ResourceName             ; Bind index buffer

; Draw commands
handling = skip               ; Skip this draw call
drawindexed = auto            ; Re-issue draw call
draw = 100, 0                 ; Draw 100 vertices

; Control flow
if condition                  ; Conditional execution
    ; commands
else if condition2
    ; commands
else
    ; commands
endif

; Variables
x = 1.0                       ; Set IniParam
$var = 2.0                    ; Set named variable

; Command lists
run = CommandListName         ; Execute command list
```

### Common Pseudo-Registers

```ini
; Built-in values you can read
time                          ; Time in seconds since launch
cursor_showing                ; 1 if game menu/cursor visible, 0 otherwise
rt_width                      ; Render target width
rt_height                     ; Render target height
res_width                     ; Resolution width
res_height                    ; Resolution height

; Shader filter indices (read in any shader override)
oVS                           ; Vertex shader filter_index
oHS                           ; Hull shader filter_index
oDS                           ; Domain shader filter_index
oGS                           ; Geometry shader filter_index
oPS                           ; Pixel shader filter_index

; Depth buffer state
oD                            ; -0.0 if no depth buffer bound, else 1-based depth buffer index
```

---

## Best Practices

### Organization

**Group related sections together:**
```ini
;---------------------------------------
; Character Model Override
;---------------------------------------
[ShaderOverrideCharacter]
; ...

[TextureOverrideCharacterBody]
; ...

[ResourceCharacterPosition]
; ...

;---------------------------------------
; UI Modifications
;---------------------------------------
[ShaderOverrideUI]
; ...
```

### Naming Conventions

**Use descriptive names:**
```ini
; Good
[ShaderOverrideCharacterOutline]
[TextureOverrideWeaponDiffuse]
[ResourceCustomNormalMap]

; Bad
[ShaderOverride1]
[TextureOverride_A]
[Resource123]
```

### Comments

**Document your code:**
```ini
; Character body shader - controls lighting and shadows
; Hash found via frame analysis on character model
[ShaderOverrideCharacterBody]
hash = abc12345def67890

; Custom normal map - 2048x2048, DXT5 compressed
[ResourceCustomNormalMap]
filename = normal_map.dds
```

### Testing

**Test incrementally:**
1. Add one override at a time
2. Test in game after each addition
3. Check logs for errors
4. Use frame analysis to verify changes

---

## Getting Help

### Documentation Resources

- **[Glossary](/docs/glossary.md)** - Quick term lookup
- **[Troubleshooting](/docs/troubleshooting.md)** - Common problems and solutions
- **Search this documentation** - Use your browser's find function (Ctrl+F)

### Debugging Tools

- **Hunting Mode (F10)** - Hunt shaders interactively
- **Frame Analysis (F8)** - Dump all frame resources
- **Logs (d3d11_log.txt)** - Check for errors and warnings
- **Overlay (enabled in d3dx.ini)** - See real-time information

### Community

- **3DMigoto GitHub** - https://github.com/bo3b/3dmigoto
- **Game-specific forks** - Check for GIMI, WWMI, SRMI, etc.
- **Mod communities** - Game-specific Discord servers and forums

---

## About This Documentation

This documentation covers the INI configuration system used by 3DMigoto and its forks. All content is:

- **Game-agnostic** - Applies to any DirectX 11 game
- **Source-verified** - Based on actual 3DMigoto source code
- **Comprehensive** - Covers basic to advanced topics
- **Example-rich** - Practical examples throughout

**Note:** This is configuration documentation. For game-specific guides, shader code, or tutorials, check your game's modding community.

### Version Information

This documentation is based on XXMI-Libs-Package (3DMigoto fork) and is compatible with:
- 3DMigoto (original)
- XXMI-based forks (GIMI, WWMI, SRMI, etc.)
- Most 3DMigoto forks with INI configuration

Some features may vary between forks. Check your fork's release notes for specific differences.

---

## Next Steps

**New to 3DMigoto?**
1. Read [Override](/docs/override.md) to understand the core concept
2. Learn about [Resources](/docs/resource.md) for asset replacement
3. Try a [workflow](#common-workflows) from this page
4. Experiment with [Keys](/docs/key.md) for interactive mods

**Need something specific?**
- Use the sidebar navigation to find topics
- Check the [Glossary](/docs/glossary.md) for term definitions
- Search with Ctrl+F within any page

**Having problems?**
- Check [Troubleshooting](/docs/troubleshooting.md) for common issues
- Review [Debugging](/docs/debugging.md) for tools and techniques
- Check [Logs](/docs/logs.md) to understand error messages

Happy modding!
