# Constants

The `[Constants]` section is used to declare and initialize variables at startup. It supports three types of variables: global, persistent, and IniParams.

## Overview

Variables declared in `[Constants]` are initialized when 3dmigoto loads the INI file and are available throughout the game session.

```ini
[Constants]
; Global variable
global $my_variable = 0.0

; Persistent variable (saved to d3dx_user.ini)
global persist $user_setting = 1

; IniParams (accessible in shaders)
x0 = 0.8
y0 = 1.0
z0 = 1.2
w0 = 2.0
```

Reference: IniHandler.cpp:2113-2132, CommandList.cpp:363-379

---

## Global Variables

Global variables are accessible from any section in the current INI file and other INI files via namespaces.

### Declaration

```ini
[Constants]
global $variable_name = initial_value
```

**Syntax Rules:**
- Must use `global` keyword
- Variable name must start with `$`
- Must be declared in `[Constants]` section
- Can only be declared once per namespace
- Initial value is required

Reference: CommandList.cpp:363-379

### Examples

```ini
[Constants]
global $screen_scale = 1.0
global $last_frame_time = 0.0
global $toggle_state = 0
global $debug_mode = 0

[Present]
; Use global variables
$current_time = time
$delta = $current_time - $last_frame_time
$last_frame_time = $current_time

if $toggle_state == 1
    run = CommandListEnabled
endif
```

### Scope

**Within Same File:**
```ini
[Constants]
global $value = 100

[Present]
; Can access directly
$temp = $value + 10

[ShaderOverride0123456789abcdef]
; Can access here too
if $value > 50
    handling = skip
endif
```

**Across Files (with namespace):**
```ini
; File: ModA/config.ini
namespace = ModA
[Constants]
global $ModA_setting = 1

; File: ModB/config.ini
; Access ModA's variable
[Present]
if $\ModA\ModA_setting == 1
    run = CommandListModBWithModA
endif
```

See [Namespace](./namespace.md) for cross-file variable access.

---

## Persistent Variables

Persistent variables are global variables that are automatically saved to `d3dx_user.ini` and restored across game sessions.

### Declaration

```ini
[Constants]
global persist $variable_name = initial_value
```

**Syntax Rules:**
- Must use both `global` and `persist` keywords
- Variable name must start with `$`
- Must be declared in `[Constants]` section
- Initial value used only on first run or after reset

Reference: CommandList.cpp:363-379

### Examples

```ini
[Constants]
; User preferences
global persist $preset_index = 0
global persist $effect_strength = 1.0
global persist $color_mode = 0

; Statistics
global persist $total_activations = 0
global persist $last_used_timestamp = 0
```

### Persistence Behavior

**First Run:**
1. Variable initialized with value from `[Constants]`
2. Variable saved to `d3dx_user.ini`

**Subsequent Runs:**
1. Variable loaded from `d3dx_user.ini` (ignores `[Constants]` value)
2. Changes during gameplay saved to `d3dx_user.ini`

**File Location:**
- `d3dx_user.ini` in same directory as `d3dx.ini`
- Created automatically by 3dmigoto
- Human-readable INI format

**Example d3dx_user.ini:**
```ini
[Constants]
global persist $preset_index = 2
global persist $effect_strength = 0.75
global persist $total_activations = 42
```

### Saving Behavior

Persistent variables are saved in two situations:

1. **Config Reload (F10):**
   - Default key: `F10`
   - Saves all persistent variables
   - Reloads all INI files

2. **Game Exit:**
   - Automatic save on clean exit
   - May not save on crash

### Resetting Persistent Variables

**Reset All Persistent Variables:**
- Default key: `Ctrl+Alt+F10` (wipe_user_config)
- Deletes `d3dx_user.ini`
- Variables reset to `[Constants]` values on next load

**Manual Reset:**
1. Exit game
2. Delete `d3dx_user.ini`
3. Restart game

### Use Cases

**User Settings:**
```ini
[Constants]
global persist $quality_preset = 1
global persist $enable_effects = 1

[KeyCyclePreset]
Key = VK_F5
type = cycle
run = CommandListCyclePreset

[CommandListCyclePreset]
$quality_preset = ($quality_preset + 1) % 3
; Automatically saved for next session
```

**Toggle States:**
```ini
[Constants]
global persist $outfit_index = 0

[KeyToggleOutfit]
Key = VK_F6
type = cycle
run = CommandListToggleOutfit

[CommandListToggleOutfit]
$outfit_index = ($outfit_index + 1) % 5
if $outfit_index == 0
    run = CustomShaderOutfit1
else if $outfit_index == 1
    run = CustomShaderOutfit2
; ... etc
endif
```

**Statistics Tracking:**
```ini
[Constants]
global persist $times_activated = 0
global persist $last_activation_frame = 0

[KeyActivate]
Key = VK_F7
type = cycle
run = CommandListActivate

[CommandListActivate]
$times_activated = $times_activated + 1
$last_activation_frame = frame_no
; Statistics saved automatically
```

---

## Local Variables

Local variables are scoped to the section where they're declared and are temporary (not saved).

### Declaration

```ini
[AnySection]
local $variable_name = initial_value
```

**Syntax Rules:**
- Must use `local` keyword
- Variable name must start with `$`
- Can be declared in any command list section
- Only visible within declaring section
- Not persisted across sections or frames

Reference: CommandList.cpp:380-405

### Examples

```ini
[CommandListCalculation]
local $temp1 = 0
local $temp2 = 0
local $result = 0

$temp1 = x0 + y0
$temp2 = x1 + y1
$result = $temp1 * $temp2
z0 = $result

[Present]
; Cannot access $temp1, $temp2, or $result here
; They are scoped to CommandListCalculation only
```

### Scope Limitations

**Same Section:**
```ini
[CommandListTest]
local $value = 10
$value = $value + 5
; $value is 15 here
```

**Different Section:**
```ini
[CommandListA]
local $value = 10

[CommandListB]
; ERROR: $value is not accessible here
$result = $value  ; This will fail
```

### Use Cases

**Temporary Calculations:**
```ini
[ShaderOverride0123456789abcdef]
local $aspect_ratio = 0
$aspect_ratio = rt_width / rt_height
x10 = $aspect_ratio * 2.0
```

**Intermediate Values:**
```ini
[CommandListComplex]
local $step1 = x0 * 2.0
local $step2 = $step1 + y0
local $step3 = $step2 / z0
w0 = $step3
```

---

## IniParams

IniParams are special parameters accessible both in INI files and shaders. They provide a way to communicate values from INI configuration to shader code.

### Declaration

```ini
[Constants]
x[index] = value
y[index] = value
z[index] = value
w[index] = value
```

**Syntax Rules:**
- No variable name (direct component access)
- Component: `x`, `y`, `z`, or `w`
- Index: 0 to 2147483647
- Value: float32
- Not namespaced (global across all INI files)

Reference: IniHandler.cpp:2113-2132, CommandList.cpp:2819-2886

### Examples

```ini
[Constants]
; IniParams[0]
x0 = 1.0
y0 = 0.5
z0 = 2.0
w0 = 1.0

; IniParams[123]
x123 = 0.8
y123 = 1.0
z123 = 1.2
w123 = 2.0

; IniParams[1] (partial)
x1 = 3.0
; y1, z1, w1 remain 0.0
```

### INI File Access

**Reading:**
```ini
[Present]
$value = x10
$separation = y20
if z5 > 0.5
    w5 = 1.0
endif
```

**Writing:**
```ini
[Present]
x0 = rt_width / 1920.0
y0 = time % 60.0
z0 = $some_variable
w0 = 1.0
```

### Shader Access

In HLSL shaders, IniParams is exposed as a Texture1D at register t120 (default):

```hlsl
// Declaration
Texture1D<float4> IniParams : register(t120);

// Define convenient names
#define OFFSET IniParams[123].x
#define SCALE IniParams[123].y
#define CONVERGENCE IniParams[123].z
#define SEPARATION IniParams[123].w
#define TIME_VALUE IniParams[0].x

// Usage
float4 main(float4 pos : SV_Position) : SV_Target
{
    float adjusted_x = pos.x * SCALE + OFFSET;
    float time_factor = TIME_VALUE;
    
    return float4(adjusted_x, time_factor, 0, 1);
}
```

### IniParams Properties

**Storage:**
- Type: Texture1D<float4>
- Format: R32G32B32A32_FLOAT
- Size: Dynamically allocated based on highest used index
- Default register: t120

**Characteristics:**
- Not namespaced (shared globally)
- Writable from INI files
- Read-only in shaders
- Can be overridden per draw call

### Dynamic Updates

IniParams can be modified at runtime:

```ini
[Present]
; Update every frame
x0 = time
y0 = frame_no

[ShaderOverride0123456789abcdef]
; Override for specific shader
x10 = vertex_count / 1000.0
```

### Best Practices

**Use High Indices:**
```ini
; BAD: Common indices (likely to conflict)
x0 = 1.0
y0 = 2.0

; GOOD: High unique indices
x5001 = 1.0
y5001 = 2.0
```

**Document Usage:**
```ini
[Constants]
; Mod: MyMod v1.0
; IniParams usage:
; x1000-x1010: Lighting parameters
; x2000-x2020: Effect parameters
x1000 = 1.0  ; Main light intensity
x1001 = 0.5  ; Ambient light
x2000 = 2.0  ; Effect strength
```

**Group Related Values:**
```ini
[Constants]
; Group: Character position (IniParams[500])
x500 = 0.0  ; Position X
y500 = 0.0  ; Position Y
z500 = 0.0  ; Position Z
w500 = 1.0  ; Scale

; Group: Color tint (IniParams[501])
x501 = 1.0  ; Red
y501 = 1.0  ; Green
z501 = 1.0  ; Blue
w501 = 1.0  ; Alpha
```

---

## Initialization Order

Variables in `[Constants]` are initialized in the order they appear:

```ini
[Constants]
; Initialized first
global $a = 1.0

; Can reference $a (already initialized)
global $b = $a * 2.0

; ERROR: Cannot reference $c (not yet initialized)
global $invalid = $c + 1.0

; Initialized after $b
global $c = 3.0

; IniParams initialized after all variables
x0 = $a + $b + $c
```

**Rules:**
1. Variables initialized top-to-bottom
2. Can reference previously declared variables
3. Cannot reference variables declared later
4. IniParams can reference any variable (processed last)

---

## Common Patterns

### Constants with Defaults

```ini
[Constants]
; Define configurable constants
global $base_separation = 2.0
global $convergence_multiplier = 1.0
global $enable_effect = 1

[Present]
; Use constants in calculations
if $enable_effect == 1
    x10 = $base_separation * (rt_width / 1920.0)
    y10 = $convergence_multiplier
endif
```

### State Machine

```ini
[Constants]
global persist $state = 0
; States: 0=off, 1=mode1, 2=mode2, 3=mode3

[KeyCycleState]
Key = VK_F8
type = cycle
run = CommandListCycleState

[CommandListCycleState]
$state = ($state + 1) % 4

[Present]
if $state == 1
    run = CustomShaderMode1
else if $state == 2
    run = CustomShaderMode2
else if $state == 3
    run = CustomShaderMode3
endif
```

### Configuration Presets

```ini
[Constants]
global persist $preset = 0
; Presets: 0=low, 1=medium, 2=high

[CommandListApplyPreset]
if $preset == 0
    ; Low quality
    x100 = 1.0
    y100 = 0.5
else if $preset == 1
    ; Medium quality
    x100 = 2.0
    y100 = 1.0
else if $preset == 2
    ; High quality
    x100 = 4.0
    y100 = 2.0
endif
```

### Timer System

```ini
[Constants]
global $last_trigger_time = 0.0
global $cooldown_seconds = 5.0

[KeyTrigger]
Key = VK_F9
type = cycle
run = CommandListTrigger

[CommandListTrigger]
if time - $last_trigger_time >= $cooldown_seconds
    ; Cooldown elapsed
    $last_trigger_time = time
    run = CustomShaderEffect
endif
```

---

## Variable Naming Conventions

**Global Variables:**
```ini
; Use descriptive names
global $character_scale = 1.0
global $effect_enabled = 1

; Include mod name for clarity
global $MyMod_setting = 0

; Use underscores for readability
global $last_activation_time = 0.0
```

**IniParams:**
```ini
; Use high indices to avoid conflicts
x5000 = 1.0  ; Better than x0

; Document what each index means
x1000 = 1.0  ; Light intensity
x1001 = 0.5  ; Ambient occlusion
```

**Local Variables:**
```ini
; Use short names for temporary values
local $temp = 0
local $result = 0

; Or descriptive names for clarity
local $aspect_ratio = rt_width / rt_height
```

---

## Debugging Constants

```ini
[Constants]
global $debug_mode = 0
global $log_to_iniparams = 1

[Present]
if $debug_mode == 1
    ; Output debug info to IniParams for shader visualization
    if $log_to_iniparams == 1
        x999 = time
        y999 = frame_no
        z999 = vertex_count
    endif
endif
```

---

## See Also

- [Variables](./properties.md#variable-declaration) - Variable types and declaration
- [Namespace](./namespace.md) - Cross-file variable access
- [Expressions](./expressions.md) - Expression syntax
- [Properties](./properties.md#iniparams) - IniParams reference
- [Command List](./command-list.md) - Command list syntax
