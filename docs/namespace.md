# Namespace

Namespaces provide a way to organize and isolate variables, command lists, and resources across multiple INI files. They prevent naming conflicts and enable cross-mod communication.

## Overview

Every INI file has a namespace. By default, the namespace is the relative path from the d3dx.ini directory to the INI file.

**Benefits:**
- Prevent naming conflicts between mods
- Access variables/resources from other mods
- Organize complex mod structures
- Enable mod interoperability

Reference: IniHandler.cpp:682-749

---

## Default Namespace

When no explicit namespace is declared, 3dmigoto uses the file's relative path.

**File Structure:**
```
d3dx.ini
Mods/
  ModA/
    character.ini      ; Default namespace: Mods\ModA\character
  ModB/
    effects.ini        ; Default namespace: Mods\ModB\effects
```

**Resulting Namespaces:**
- `Mods\ModA\character.ini` → namespace: `Mods\ModA\character`
- `Mods\ModB\effects.ini` → namespace: `Mods\ModB\effects`

---

## Explicit Namespace Declaration

Override the default namespace by declaring it on the first line of the INI file.

### Syntax

```ini
namespace = path\to\namespace
```

**Rules:**
- Must be on the first line (before any sections)
- Use backslash `\` as separator (Windows path style)
- Case-sensitive
- Can contain alphanumeric characters, underscores, hyphens
- Should be unique across all mods

Reference: IniHandler.cpp:682-749

### Examples

```ini
; File: Mods/Character/config.ini
namespace = MyMod\Character

[Constants]
global $enabled = 1
```

```ini
; File: Mods/Effects/lighting.ini
namespace = LeoTorreZ\Lighting\Advanced

[Constants]
global $intensity = 1.0
```

---

## Namespace Best Practices

### Make Namespaces Unique

Include identifying information:

```ini
; Include creator name
namespace = CreatorName\ModName

; Include character and mod type
namespace = LeoTorreZ\Mona\FontaineDress

; Include version for major changes
namespace = Creator\ModName\v2
```

### Use Consistent Structure

```ini
; Mod root namespace
namespace = MyMod

; Sub-components
namespace = MyMod\Character
namespace = MyMod\Effects
namespace = MyMod\Utilities
```

### Avoid Generic Names

```ini
; BAD: Too generic, likely to conflict
namespace = character
namespace = effects
namespace = config

; GOOD: Specific and unique
namespace = JohnDoe\CharacterEnhancer
namespace = VisualMods\LightingOverhaul
```

---

## Accessing Namespaced Resources

Use the namespace prefix to access variables, command lists, and resources from other namespaces.

### Syntax

```
[Type]\[Namespace]\[Name]
```

**Types:**
- `$` - Variables
- `CommandList` - Command lists
- `Resource` - Resources
- `CustomShader` - Custom shaders

---

## Variable Access

### Same Namespace (Local)

Within the same INI file, access variables directly:

```ini
; File: mod.ini
namespace = MyMod

[Constants]
global $setting = 1

[Present]
; Direct access within same namespace
if $setting == 1
    run = CommandListEffect
endif
```

### Different Namespace (Cross-File)

Access variables from other namespaces using full path:

```ini
; File: modA.ini
namespace = ModA

[Constants]
global $enabled = 1
global $intensity = 0.5
```

```ini
; File: modB.ini
namespace = ModB

[Present]
; Access ModA's variables
if $\ModA\enabled == 1
    $local_intensity = $\ModA\intensity
    x10 = $local_intensity * 2.0
endif
```

### Syntax Details

**Variable Access:**
```ini
$\Namespace\variable_name
```

**Examples:**
```ini
; Read from another namespace
$value = $\OtherMod\setting

; Write to own variable using other namespace's value
$\MyNamespace\result = $\OtherMod\input * 2.0

; Use in expressions
if $\SharedMod\enable == 1 && $\SharedMod\quality > 2
    run = CommandListHighQuality
endif
```

---

## Command List Access

### Same Namespace

```ini
; File: mod.ini
namespace = MyMod

[CommandListHelper]
x0 = 1.0

[Present]
; Direct access within same namespace
run = CommandListHelper
```

### Different Namespace

```ini
; File: sharedUtils.ini
namespace = SharedUtils

[CommandListColorCorrection]
x100 = 1.2
y100 = 1.0
z100 = 0.8
```

```ini
; File: myMod.ini
namespace = MyMod

[Present]
; Access command list from SharedUtils
run = CommandList\SharedUtils\ColorCorrection

[ShaderOverride0123456789abcdef]
run = CommandList\SharedUtils\ColorCorrection
```

---

## Resource Access

### Same Namespace

```ini
; File: mod.ini
namespace = MyMod

[ResourceCustomTexture]
filename = Textures/custom.dds

[ShaderOverride0123456789abcdef]
; Direct access within same namespace
ps-t0 = ResourceCustomTexture
```

### Different Namespace

```ini
; File: textureLibrary.ini
namespace = TextureLib

[ResourceCommonEffect]
filename = Effects/glow.dds
type = Texture2D
```

```ini
; File: myEffect.ini
namespace = MyEffect

[ShaderOverride0123456789abcdef]
; Access resource from TextureLib
ps-t0 = Resource\TextureLib\CommonEffect
```

---

## CustomShader Access

### Same Namespace

```ini
; File: mod.ini
namespace = MyMod

[CustomShaderEffect]
vs = Shaders/effect_vs.hlsl
ps = Shaders/effect_ps.hlsl

[Present]
run = CustomShaderEffect
```

### Different Namespace

```ini
; File: shaderLibrary.ini
namespace = ShaderLib

[CustomShaderPost]
ps = PostProcess/sharpen.hlsl
```

```ini
; File: myMod.ini
namespace = MyMod

[Present]
; Run shader from ShaderLib
run = CustomShader\ShaderLib\Post
```

---

## Cross-Mod Communication

Namespaces enable mods to communicate without knowing each other's file structure.

### Shared State Example

**Tracking Mod (provides data):**
```ini
; File: BufferValues/tracking.ini
namespace = global\tracking

[Constants]
global $isSwimming = 0
global $isFlying = 0
global $characterHeight = 1.0

[Present]
; Logic to detect swimming
if some_condition
    $isSwimming = 1
else
    $isSwimming = 0
endif
```

**Consumer Mod (uses data):**
```ini
; File: EffectMod/main.ini
namespace = EffectMod

[Present]
; React to swimming state
if $\global\tracking\isSwimming == 1
    run = CustomShaderUnderwaterEffect
endif

; Use character height
$scale = $\global\tracking\characterHeight
x20 = $scale
```

### Feature Toggles

**Feature Provider:**
```ini
; File: CoreMod/features.ini
namespace = CoreMod

[Constants]
global persist $feature_lighting = 1
global persist $feature_shadows = 1
global persist $feature_reflections = 0

[KeyToggleLighting]
Key = VK_F6
type = cycle
run = CommandListToggleLighting

[CommandListToggleLighting]
$feature_lighting = !$feature_lighting
```

**Feature Consumer:**
```ini
; File: VisualEnhancement/main.ini
namespace = VisualEnhancement

[Present]
; Enable enhancement only if CoreMod enables lighting
if $\CoreMod\feature_lighting == 1
    run = CustomShaderEnhancedLighting
endif
```

### Configuration Synchronization

**Configuration Provider:**
```ini
; File: Settings/config.ini
namespace = Settings

[Constants]
global persist $graphics_quality = 2
global persist $effect_intensity = 1.0
global persist $enable_advanced = 1
```

**Multiple Consumers:**
```ini
; File: ModA/init.ini
namespace = ModA

[Present]
$quality = $\Settings\graphics_quality
if $quality >= 2
    run = CustomShaderHighQuality
endif
```

```ini
; File: ModB/init.ini
namespace = ModB

[Present]
$intensity = $\Settings\effect_intensity
x50 = $intensity
```

---

## Include Directive with Namespaces

The `[Include]` directive loads other INI files with optional namespace override.

### Basic Include

```ini
; File: main.ini
[IncludeShared]
include = Shared/utilities.ini
```

**Result:** `utilities.ini` keeps its own namespace (default or declared).

### Include with Namespace Override

```ini
; File: main.ini
[IncludeUtils]
include = Shared/utilities.ini
namespace = MyMod\Utils
```

**Result:** `utilities.ini` runs with namespace `MyMod\Utils` instead of its default.

### Recursive Include

Included files can include other files, each with their own namespace:

```ini
; File: main.ini
namespace = Main

[Include1]
include = submod1.ini

[Include2]
include = submod2.ini
```

```ini
; File: submod1.ini
namespace = Main\Sub1

[Include3]
include = shared.ini
namespace = Shared
```

Reference: IniHandler.cpp:3268-3339

---

## Namespace Resolution

### Relative vs Absolute

**Absolute Path (starts with `\`):**
```ini
; Always refers to root namespace
$\ModA\variable
run = CommandList\ModA\Helper
```

**Relative Path (no leading `\`):**
```ini
; Relative to current namespace
; If current namespace is "MyMod", this refers to "MyMod\SubModule"
$SubModule\variable
```

### Current Namespace

Variables without namespace prefix refer to current namespace:

```ini
; File: mod.ini
namespace = MyMod

[Constants]
global $setting = 1

[Present]
; These are equivalent in this file:
$setting = 2
$\MyMod\setting = 2
```

---

## Debugging Namespaces

### Log Namespace Values

```ini
[Constants]
global $debug_namespace = 1

[Present]
if $debug_namespace == 1
    ; Copy values to IniParams for shader visualization
    x900 = $\ModA\value1
    x901 = $\ModB\value2
    x902 = $\SharedConfig\setting
endif
```

### Test Cross-Namespace Access

```ini
[Constants]
global $test_mode = 1

[Present]
if $test_mode == 1
    ; Verify other mod is loaded
    if $\OtherMod\initialized == 1
        ; Other mod available
        x100 = 1.0
    else
        ; Other mod missing
        x100 = 0.0
    endif
endif
```

---

## Common Patterns

### Mod Initialization Flag

**Provider:**
```ini
; File: mymod.ini
namespace = MyMod

[Constants]
global $initialized = 1
global $version = 2.5
```

**Consumer:**
```ini
[Present]
; Check if MyMod is loaded
if $\MyMod\initialized == 1
    ; MyMod available, safe to use its features
    run = CommandList\MyMod\Effect
endif
```

### Shared Configuration

**Configuration File:**
```ini
; File: Shared/config.ini
namespace = Shared\Config

[Constants]
global persist $master_enable = 1
global persist $quality = 2
global persist $intensity = 1.0

[KeyToggle]
Key = VK_F10
type = cycle
run = CommandListToggle

[CommandListToggle]
$master_enable = !$master_enable
```

**Multiple Mods:**
```ini
; Mod1
[Present]
if $\Shared\Config\master_enable == 1
    $local_quality = $\Shared\Config\quality
    ; Use shared settings
endif
```

```ini
; Mod2
[Present]
if $\Shared\Config\master_enable == 1
    $local_intensity = $\Shared\Config\intensity
    ; Use shared settings
endif
```

### Feature Registry

**Registry:**
```ini
; File: registry.ini
namespace = Registry

[Constants]
global $feature_postprocess = 0
global $feature_lighting = 0
global $feature_shadows = 0
```

**Feature Providers:**
```ini
; PostProcess Mod
namespace = PostProcess
[Constants]
$\Registry\feature_postprocess = 1
```

```ini
; Lighting Mod
namespace = Lighting
[Constants]
$\Registry\feature_lighting = 1
```

**Feature Consumer:**
```ini
[Present]
if $\Registry\feature_postprocess == 1 && $\Registry\feature_lighting == 1
    ; Both features available
    run = CustomShaderCombined
endif
```

---

## Namespace Conflicts

### Detecting Conflicts

When two mods use the same namespace, the later loaded file overwrites:

```ini
; File: modA/config.ini (loaded first)
namespace = Shared

[Constants]
global $value = 1
```

```ini
; File: modB/config.ini (loaded second)
namespace = Shared

[Constants]
global $value = 2
```

**Result:** `$\Shared\value` is 2 (modB overwrites modA)

### Avoiding Conflicts

1. **Use unique namespaces:**
```ini
namespace = CreatorName\ModName
```

2. **Include mod identifier:**
```ini
namespace = MyModUniqueName\Component
```

3. **Check for conflicts in d3d11_log.txt:**
```
WARNING: Duplicate section found - [Constants] in namespace Shared
```

---

## Advanced Usage

### Conditional Loading

```ini
[Constants]
global $use_enhanced_effects = 1

[Present]
if $use_enhanced_effects == 1
    ; Only load enhanced effects if enabled
    if $\EnhancedEffects\available == 1
        run = CommandList\EnhancedEffects\Apply
    endif
endif
```

### Version Checking

```ini
[Constants]
global $required_coremod_version = 2.0

[Present]
if $\CoreMod\version >= $required_coremod_version
    ; CoreMod version compatible
    run = CommandList\CoreMod\NewFeature
else
    ; Use fallback
    run = CommandListFallback
endif
```

### Dynamic Resource Selection

```ini
[Present]
; Use high-res textures if quality mod is installed
if $\QualityMod\hires_enabled == 1
    ps-t0 = Resource\QualityMod\HighResTexture
else
    ps-t0 = ResourceStandardTexture
endif
```

---

## See Also

- [Constants](./constants.md) - Variable declaration and initialization
- [Properties](./properties.md#variable-declaration) - Variable types
- [Command List](./command-list.md) - Command list syntax
- [Include](./include.md) - Including other INI files
- [Glossary](./glossary.md#namespace) - Namespace terminology
