# Key

Key sections allow you to bind keyboard keys, mouse buttons, and Xbox controller buttons to custom actions. When a key is pressed, you can set variables, change rendering parameters, execute command lists, or cycle through presets. Keys are essential for interactive modding, enabling users to toggle effects, adjust settings, or trigger custom behavior during gameplay.

## Overview

Key sections bind input events to actions that modify game rendering or 3DMigoto state. They support four primary modes of operation:

- **Activate** (default): Set values immediately when pressed
- **Hold**: Apply values while key is held, restore previous values on release
- **Toggle**: Switch between two states (on/off) with each press
- **Cycle**: Rotate through multiple preset configurations

Keys can control:
- **IniParams variables** (`x`, `y`, `z`, `w`, `x0-x99`, `y0-y99`, etc.)
- **Named variables** (declared in [Constants] sections)
- **Built-in parameters** (`convergence`, `separation`)
- **Command lists** (complex logic and operations)

```ini
; Simple key binding - Set variables
[KeyToggleEffect]
key = VK_F1
type = toggle
$effect_enabled = 1

; Advanced key binding - Cycle with transitions
[KeyCyclePresets]
key = E
key = XB_RIGHT_SHOULDER
type = cycle
convergence = 1.0, 1.5, 2.0
z = 0.25, 0.5, 0.75
transition = 100
transition_type = cosine
```

## Syntax

### Section Header

```ini
[Key<UniqueIdentifier>]
```

The section name must start with `Key` followed by any unique identifier. The identifier is for your reference only.

**Examples:**
```ini
[KeyToggleMod]
[Key1]
[Key_F1_Toggle]
[KeyCyclePOV]
```

---

## Properties Reference

### key

**Type:** String (key name or virtual key code)  
**Required:** Yes (at least one)  
**Multiple:** Yes (multiple `key =` lines allowed)

Specifies which keyboard key, mouse button, or Xbox controller button triggers this action. Multiple keys can be specified to share the same state.

```ini
; Single key
[KeyExample1]
key = F1

; Multiple keys sharing state
[KeyExample2]
key = Q
key = XB_LEFT_SHOULDER
```

**Keyboard Keys:**
- **A-Z and 0-9:** Use the single character (case insensitive)
  ```ini
  key = W
  key = 5
  ```
  
- **Function keys:** `F1` through `F12`
  ```ini
  key = F10
  ```

- **Special keys:** Use the Windows virtual key name (with or without `VK_` prefix)
  ```ini
  key = VK_SPACE
  key = TAB
  key = RETURN
  key = ESCAPE
  key = VK_INSERT
  key = VK_DELETE
  key = VK_HOME
  key = VK_END
  key = VK_PRIOR        ; Page Up
  key = VK_NEXT         ; Page Down
  ```

**Mouse Buttons:**
```ini
key = LBUTTON         ; Left mouse button
key = RBUTTON         ; Right mouse button
key = MBUTTON         ; Middle mouse button
key = XBUTTON1        ; Mouse 4
key = XBUTTON2        ; Mouse 5
```

**Xbox Controller Buttons:**
```ini
key = XB_LEFT_TRIGGER
key = XB_RIGHT_TRIGGER
key = XB_LEFT_SHOULDER    ; Left bumper
key = XB_RIGHT_SHOULDER   ; Right bumper
key = XB_LEFT_THUMB       ; Left stick click
key = XB_RIGHT_THUMB      ; Right stick click
key = XB_DPAD_UP
key = XB_DPAD_DOWN
key = XB_DPAD_LEFT
key = XB_DPAD_RIGHT
key = XB_A
key = XB_B
key = XB_X
key = XB_Y
key = XB_START
key = XB_BACK
key = XB_GUIDE
```

By default, all attached controllers respond to XBox button bindings. To bind a specific controller (1-4):

```ini
key = XB2_LEFT_TRIGGER      ; Only controller 2
```

**Key Combinations:**

Combine multiple keys by separating them with spaces:

```ini
; Ctrl+F1
key = CTRL F1

; Shift+Q
key = SHIFT Q

; Ctrl+Alt+Delete
key = CTRL ALT VK_DELETE
```

**Excluding Keys:**

Use `NO_` prefix to require a key NOT be pressed:

```ini
; F1 without Alt (prevents conflict with Alt+F1 screenshot)
key = NO_ALT F1

; Q without any modifiers
key = NO_MODIFIERS Q

; Specific exclusions
key = NO_CTRL NO_ALT F2
```

`NO_MODIFIERS` is shorthand for excluding all standard modifiers (Ctrl, Alt, Shift, Windows).

**Reference:** For complete virtual key codes list, see:  
https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes

Reference: Input.cpp:433-483

---

### type

**Type:** Enum  
**Default:** `activate`  
**Values:** `activate`, `hold`, `toggle`, `cycle`

Controls the key's behavior mode.

```ini
; activate - Apply values immediately (default)
[KeyActivate]
key = F1
$effect = 1

; hold - Active while held, restore on release
[KeyHold]
key = RBUTTON
type = hold
convergence = 0.5

; toggle - Switch between on/off states
[KeyToggle]
key = T
type = toggle
$toggle_var = 1

; cycle - Rotate through multiple presets
[KeyCycle]
key = E
type = cycle
$preset = 0, 1, 2
```

#### activate (default)

Sets values immediately when key is pressed. Values remain until changed by another action.

```ini
[KeyActivate]
key = F1
x = 1.0
y = 2.0
```

**Use Case:** Setting persistent values, triggering one-time events.

#### hold

Applies values while key is held, restores previous values when released.

```ini
[KeyHold]
key = RBUTTON
type = hold
convergence = 0.1
y = 0.5
```

**Use Case:** Temporary adjustments like aiming mode, zooming, or UI positioning.

**Note:** The `post` phase of command lists runs on release with `type = hold`.

#### toggle

Switches between two states each time the key is pressed. First press applies values, second press restores previous values.

```ini
[KeyToggle]
key = Q
type = toggle
separation = 0.0
$ui_hidden = 1
```

**Use Case:** On/off switches for effects, UI elements, or features.

**Behavior:** 
- First press: Apply specified values, save previous values
- Second press: Restore saved values
- Remembers the state between presses

#### cycle

Rotates through multiple preset configurations. Each press advances to the next preset.

```ini
[KeyCycle]
key = E
type = cycle
convergence = 1.0, 1.5, 2.0, 2.5
z = 0.25, 0.5, 0.75, 1.0
```

**Use Case:** Multiple POV presets, different effect intensities, scene-specific settings.

See [cycle properties](#wrap-cycle-only) for additional cycle-specific options.

Reference: Override.h:11-24

---

### wrap (cycle only)

**Type:** Boolean  
**Default:** `true`  
**Applies to:** `type = cycle` only

Controls whether cycling wraps around from the last preset back to the first.

```ini
[KeyCycleWrap]
key = E
type = cycle
wrap = true          ; Default: E E E cycles 1→2→3→1→2→3...
$preset = 1, 2, 3

[KeyCycleNoWrap]
key = Q
type = cycle
wrap = false         ; Q Q Q cycles 1→2→3 (stops at 3)
$preset = 1, 2, 3
```

**Values:**
- `true` (default): Cycle wraps from last to first preset
- `false`: Cycle stops at the last preset

**Use Case:** Use `wrap = false` when presets represent a linear progression (e.g., quality settings: Low → Medium → High).

Reference: Override.cpp:253

---

### smart (cycle only)

**Type:** Boolean  
**Default:** `true`  
**Applies to:** `type = cycle` only

Enables intelligent preset synchronization. When activated, checks if current values match the current cycle position and resynchronizes if necessary.

```ini
[KeySmartCycle]
key = W
type = cycle
smart = true         ; Default: Auto-detect current preset
$variable = 0, 1, 2
```

**Values:**
- `true` (default): Automatically detect and sync with current preset
- `false`: Always advance to next preset regardless of current values

**How it works:**
1. Key pressed
2. Check if current values match any preset
3. If match found, advance from that preset
4. If no match, advance from last known position

**Use Case:** Use `smart = true` (default) when you want the key to work correctly even if values were changed by other means (another key, command list, or manual adjustment). Use `smart = false` only if you need strict sequential cycling.

**Comparison with toggle:**

```ini
; toggle - Remembers arbitrary values
[KeyToggle]
type = toggle
$var = 5            ; Toggle between 5 and whatever it was before

; cycle (smart) - Toggle between exact values
[KeyCycle]
type = cycle
smart = true
$var = 0, 5         ; Intelligently toggle between exactly 0 and 5
```

Reference: Override.cpp:254, 368-389

---

### back (cycle only)

**Type:** String (key name)  
**Default:** None  
**Applies to:** `type = cycle` only

Specifies an additional key that cycles backward through presets.

```ini
[KeyCycleBidirectional]
key = E               ; Forward
key = XB_RIGHT_SHOULDER
back = Q              ; Backward
back = XB_LEFT_SHOULDER
type = cycle
$preset = 1, 2, 3, 4
```

**Use Case:** Provide both forward and backward navigation through presets, especially useful with `wrap = false`.

**Example:**
```ini
[KeyCyclePOV]
key = PRIOR           ; Page Up - next preset
back = NEXT           ; Page Down - previous preset
type = cycle
wrap = false
convergence = 1.0, 1.3, 1.6, 2.0
z = 0.25, 0.5, 0.75, 1.0
```

Reference: Override.h:179-188

---

### transition

**Type:** Integer (milliseconds)  
**Default:** `0` (instant)

Duration of smooth transition when applying values.

```ini
[KeyWithTransition]
key = F1
convergence = 1.5
transition = 500           ; 0.5 second smooth change
transition_type = cosine   ; Smooth easing
```

**Use Case:** Smooth visual changes, sync with game animations, prevent jarring adjustments.

**Applies to:** All key types. For cycles, applies when advancing to next preset.

Reference: Override.cpp:60

---

### release_transition

**Type:** Integer (milliseconds)  
**Default:** `0` (instant)  
**Applies to:** `type = hold` primarily

Duration of transition when releasing a hold key.

```ini
[KeyHoldTransition]
key = RBUTTON
type = hold
convergence = 0.5
transition = 100           ; Fast transition on press
release_transition = 500   ; Slow transition on release
```

**Use Case:** Different timing for press and release (e.g., quick aim entry, slow aim exit).

Reference: Override.cpp:61

---

### transition_type

**Type:** Enum  
**Default:** `linear`  
**Values:** `linear`, `cosine`

Easing function for value transitions.

```ini
[KeyLinear]
key = F1
convergence = 1.5
transition = 500
transition_type = linear   ; Constant speed change

[KeyCosine]
key = F2
convergence = 2.0
transition = 500
transition_type = cosine   ; Smooth acceleration/deceleration
```

**Values:**
- `linear`: Constant rate of change (uniform speed)
- `cosine`: Smooth easing in and out (starts slow, speeds up, ends slow)

**Use Case:** Use `cosine` for more natural, game-like transitions. Use `linear` for steady, predictable changes.

Reference: Override.h:26-35, Override.cpp:63

---

### release_transition_type

**Type:** Enum  
**Default:** `linear`  
**Values:** `linear`, `cosine`  
**Applies to:** `type = hold` primarily

Easing function for release transitions.

```ini
[KeyHoldEasing]
key = RBUTTON
type = hold
y = 0.5
transition_type = linear         ; Sharp entry
release_transition_type = cosine ; Smooth exit
```

Reference: Override.cpp:64

---

### delay (hold only)

**Type:** Integer (milliseconds)  
**Default:** `0` (no delay)  
**Applies to:** `type = hold` only

Delay before applying values when key is pressed and held.

```ini
[KeyDelayedHold]
key = RBUTTON
type = hold
convergence = 0.5
delay = 200            ; Wait 200ms after press
transition = 100       ; Then transition over 100ms
```

**Use Case:** Sync with game animations (e.g., wait for gun raise animation before adjusting convergence).

**Timeline Example:**
```
Key Pressed → [200ms delay] → [100ms transition] → Values Applied
```

Reference: Override.cpp:60 (implementation in Input.cpp:460-469)

---

### release_delay (hold only)

**Type:** Integer (milliseconds)  
**Default:** `0` (no delay)  
**Applies to:** `type = hold` only

Delay before restoring values when key is released.

```ini
[KeyDelayedRelease]
key = RBUTTON
type = hold
convergence = 0.5
release_delay = 100    ; Wait 100ms after release
release_transition = 200
```

**Use Case:** Delay restoration to sync with un-aim animations.

Reference: Override.cpp:61 (implementation in Input.cpp:460-469)

---

### condition

**Type:** Expression (boolean)  
**Default:** None (always active)

Conditional activation - only apply values if expression evaluates to true.

```ini
[KeyConditional]
key = F1
condition = $mod_enabled == 1 && cursor_showing
$effect = 1
convergence = 1.5
```

**Use Case:** Context-sensitive keys, mode-dependent behaviors, safety checks.

**Expression Syntax:** See [Expressions](/docs/expressions.md) for complete expression reference.

**Example - Only in menu:**
```ini
[KeyMenuOnly]
key = M
condition = cursor_showing
$menu_action = 1
```

Reference: Override.cpp:66-76

---

### run

**Type:** String (command list name)  
**Default:** None

Execute a command list when the key is pressed. Allows complex logic beyond simple value assignment.

```ini
[KeyCommandList]
key = F
run = CommandListF

[CommandListF]
if $foo == 0 && cursor_showing
    $foo = $bar * 3.14 / rt_width
else
    $foo = 0
endif
```

**Behavior:**
- **activate/cycle:** Command list runs on key press
- **hold:** Command list runs on press, `post` commands run on release
- **toggle:** Command list runs on toggle on, `post` commands run on toggle off

**Use Case:** Complex conditional logic, multiple operations, resource manipulation, anything beyond simple value assignment.

**Example - Complex Toggle:**
```ini
[KeyComplexToggle]
key = T
type = toggle
run = ToggleEffect

[ToggleEffect]
; Pre/activation commands
$effect_enabled = 1
ps-t0 = ResourceEffect
post $effect_enabled = 0
post ps-t0 = null
```

Reference: Override.cpp:86-91

---

## Value Assignment

Key sections can directly set IniParams and named variables.

### IniParams (x, y, z, w, x0-x99, y0-y99, z0-z99, w0-w99)

```ini
[KeySetParams]
key = F1
x = 1.0
y = 2.0
z3 = 3.5
w15 = 4.2
```

**Use Case:** Pass values to shaders via IniParams constant buffer.

### Named Variables

Named variables declared in [Constants] sections can be set:

```ini
[Constants]
global $effect_strength = 1.0
global $ui_depth = 0.5

[KeySetVariables]
key = F2
$effect_strength = 2.0
$ui_depth = 0.75
```

**Use Case:** Control mod logic, shader behavior, conditional execution.

### Cycle Values

For `type = cycle`, specify comma-separated values to cycle through:

```ini
[KeyCycle]
key = E
type = cycle
x = 1.0, 2.0, 3.0
$preset = 0, 1, 2
convergence = 0.5, 1.0, 1.5, 2.0
```

All cycle variables must have the same number of values (or be omitted from some presets by leaving empty).

**Mixed Length Example:**
```ini
[KeyCycleMixed]
key = E
type = cycle
x = 1.0, 2.0, 3.0          ; 3 values
y = 0.5, , 1.5             ; Value 2 unchanged (empty)
$mode = 0, 1, 2            ; 3 values
```

Reference: Override.cpp:258-270, 280-334

---

## Deprecated Parameters

### convergence

**Type:** Float  
**Status:** Works but built-in stereo parameters are game-specific

Sets stereo convergence value. Works in games with Nvidia 3D Vision or similar stereo rendering.

```ini
[KeyConvergence]
key = F3
convergence = 1.5
```

::: warning GAME-SPECIFIC
This parameter only works if the game supports stereo 3D rendering. For most modern games, you'll need to control depth/parallax through shader modifications instead.
:::

---

### separation

**Type:** Float  
**Status:** Works but built-in stereo parameters are game-specific

Sets stereo eye separation value.

```ini
[KeySeparation]
key = F4
separation = 100.0
```

::: warning GAME-SPECIFIC
Like convergence, this only works with games that have stereo 3D support.
:::

---

## Common Use Cases

### 1. Simple Toggle

Toggle an effect on and off:

```ini
[Constants]
global $effect_enabled = 0

[KeyToggleEffect]
key = F1
type = toggle
$effect_enabled = 1

[ShaderOverrideEffect]
hash = abc12345def67890
if $effect_enabled == 1
    ps-t0 = ResourceCustomTexture
endif
```

### 2. Aiming Mode (Hold)

Adjust convergence while aiming:

```ini
[KeyAiming]
key = RBUTTON
key = XB_LEFT_TRIGGER
type = hold
x = 0.5              ; Pass to shader for depth adjustment
delay = 100          ; Wait for aim animation
transition = 100     ; Smooth transition in
release_transition = 300  ; Smooth transition out
transition_type = cosine
```

### 3. POV Cycle

Cycle through multiple POV presets:

```ini
[KeyCyclePOV]
key = E
key = XB_RIGHT_SHOULDER
back = Q
back = XB_LEFT_SHOULDER
type = cycle
wrap = false
x = 1.0, 1.3, 1.6, 2.0       ; Different depth values
z = 0.25, 0.5, 0.75, 1.0     ; UI depth adjustments
transition = 150
transition_type = cosine
```

### 4. Conditional Key

Only work when conditions are met:

```ini
[KeyConditionalAction]
key = M
condition = cursor_showing && $mod_enabled == 1
run = MenuAction
```

### 5. Multi-State Toggle

Toggle between specific states using smart cycle:

```ini
[KeySmartToggle]
key = T
type = cycle
smart = true
$state = 0, 1          ; Always toggle between 0 and 1
transition = 100
```

### 6. Complex Command List Key

Execute complex logic with a key:

```ini
[KeyComplex]
key = G
run = ComplexLogic

[CommandListComplex]
; Save current depth
$saved_depth = x

if cursor_showing
    ; Menu mode
    x = 0.0
    y = 0.5
    $ui_mode = 1
else
    ; Game mode  
    x = $saved_depth
    y = 0.0
    $ui_mode = 0
endif
```

### 7. Cycle with Command Lists

Different actions for each cycle position:

```ini
[KeyCycleCommands]
key = F
type = cycle
$mode = 0, 1, 2
run = Mode0Commands, Mode1Commands, Mode2Commands

[Mode0Commands]
ps-t0 = ResourceA

[Mode1Commands]
ps-t0 = ResourceB
vs-cb0 = ResourceDataB

[Mode2Commands]
ps-t0 = ResourceC
run = CustomShaderC
```

### 8. Instant Preset Switch

Switch to specific configuration instantly:

```ini
[KeyPresetA]
key = F5
x = 1.0
y = 0.25
$preset = 0
run = ActivatePresetA

[KeyPresetB]
key = F6
x = 1.5
y = 0.5
$preset = 1
run = ActivatePresetB
```

---

## Best Practices

### Key Selection

**Avoid conflicts:**
- Check what keys the game uses
- Avoid common game keys (WASD, Space, Ctrl, Shift for movement games)
- Use function keys (F1-F12) for safety
- Consider numpad keys if users have them
- Mouse buttons work well for aiming/shooting games

**Provide alternatives:**
```ini
[KeyToggle]
key = T               ; Keyboard
key = XB_Y            ; Controller
type = toggle
```

### Transitions

**Use transitions for smooth experience:**
```ini
; Good - smooth change
[KeySmooth]
key = F1
convergence = 1.5
transition = 200
transition_type = cosine

; Bad - jarring instant change
[KeyJarring]
key = F2
convergence = 1.5
```

**Match game timing:**
```ini
[KeyAim]
key = RBUTTON
type = hold
x = 0.5
delay = 150           ; Match gun raise animation time
transition = 100
```

### Organization

**Group related keys:**
```ini
; POV controls
[KeyPOVNext]
key = E
; ...

[KeyPOVPrev]
key = Q
; ...

; Effect toggles
[KeyToggleEffect1]
key = F1
; ...

[KeyToggleEffect2]
key = F2
; ...
```

### Variable Naming

**Use descriptive names:**
```ini
; Good
$ui_depth = 0.5
$character_effect_enabled = 1
$shadow_quality = 2

; Bad
$x = 0.5
$flag = 1
$mode = 2
```

### Testing

**Test all key types:**
1. **activate:** Verify values set correctly
2. **hold:** Test press and release behavior
3. **toggle:** Test multiple presses
4. **cycle:** Test all presets and wrap behavior

**Test combinations:**
- Key combinations (Ctrl+Key, etc.)
- Multiple keys sharing state
- Transitions and delays
- Conditions

---

## Troubleshooting

### Key Not Responding

**Problem:** Key binding defined but nothing happens when pressed.

**Solutions:**
1. **Check key name** - Verify correct virtual key code or name
2. **Test in-game** - Ensure game has focus (click on game window)
3. **Check conflicts** - Game might be using that key
4. **Try different key** - Use function key for testing
5. **Check logs** - Look for "UNABLE TO PARSE KEY BINDING" warnings
6. **Verify condition** - If using `condition =`, check if expression is true

### Key Conflicts with Game

**Problem:** Key works but also triggers game action.

**Solutions:**
1. **Use unused keys** - Function keys often safe
2. **Use combinations** - Shift+Key, Ctrl+Key
3. **Use controller buttons** - Often less conflicted
4. **Block game input** - Some mods can block key passthrough (advanced)

### Transitions Not Smooth

**Problem:** Value changes feel jerky or stepped.

**Solutions:**
1. **Increase transition time** - Use longer duration (200-500ms)
2. **Use cosine easing** - `transition_type = cosine` for smoothness
3. **Check frame rate** - Very low FPS can make transitions appear jerky

### Cycle Getting Out of Sync

**Problem:** Cycle key advances to wrong preset.

**Solutions:**
1. **Enable smart mode** - `smart = true` (default) auto-detects current preset
2. **Check value matches** - Ensure cycle values exactly match what's actually set
3. **Use toggle instead** - If only two states, `type = toggle` more reliable for simple cases

### Hold Key Not Releasing

**Problem:** Hold key values persist after release.

**Solutions:**
1. **Verify type** - Ensure `type = hold` is set
2. **Check focus** - Game must have focus to receive release event  
3. **Avoid Alt-Tab** - Releasing while alt-tabbed can miss the event
4. **Test with logging** - Add logging to verify release detection

### Condition Not Working

**Problem:** Conditional key never activates.

**Solutions:**
1. **Test condition** - Use logging to print condition variables
2. **Check syntax** - Verify expression syntax correct (see [Expressions](/docs/expressions.md))
3. **Variable scope** - Ensure variables accessible (declared in [Constants])
4. **Debug values** - Print variable values to verify condition should be true

### Command List Not Running

**Problem:** `run =` specified but command list not executing.

**Solutions:**
1. **Check command list exists** - Verify section name matches
2. **Check syntax** - Look for errors in command list
3. **Enable logging** - Set `calls = 1` in [Logging] to see execution
4. **Test isolation** - Comment out other commands to isolate issue

---

## Related Documentation

- [Constants](/docs/constants.md) - Declare named variables for use in keys
- [Command List](/docs/command-list.md) - Complete command reference for `run =`
- [Expressions](/docs/expressions.md) - Expression syntax for `condition =`
- [Preset](/docs/preset.md) - Preset sections for ShaderOverride activation
- [Override](/docs/override.md) - Override section syntax
