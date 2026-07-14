# Present

The `[Present]` section is a special section that executes every frame. It is called by 3dmigoto's Present function, which is invoked after each frame is rendered. This section is ideal for per-frame initialization, cleanup, ongoing calculations, and executing recurring effects.

## Overview

The Present section acts like a per-frame CommandList that runs automatically without needing to be explicitly called:

```ini
[Present]
; Commands here execute every frame
post $frame_count = $frame_count + 1
run = CommandListPerFrame
```

## Execution Timing: Pre vs Post

The `[Present]` section has two execution phases controlled by the `pre` and `post` modifiers. Understanding the difference is crucial for correct behavior.

### Understanding Frame Boundaries

The DirectX `Present()` API call is the **frame boundary** that separates Frame N from Frame N+1. The timing of `pre` and `post` commands is relative to this Present() call:

```
Frame N rendering completes
    ↓
[1] "pre" commands execute  ← Before Present() call
    ↓
[2] Present() API call      ← Frame boundary (swaps buffers)
    ↓
[3] "post" commands execute ← After Present() call
    ↓
Frame N+1 rendering begins
```

**Important:** The naming is relative to the Present() call, not to conceptual "frame start/end":
- `pre` = **before Present()** = end of Frame N (after rendering completes)
- `post` = **after Present()** = start of Frame N+1 (before rendering begins)

### Pre (Before Present Call)

`pre` commands execute **before the Present() API call**, at the end of Frame N after all rendering is complete:

```ini
[Present]
; Execute before Present() call (end of Frame N)
pre run = CommandListDrawOverlay
pre $frame_complete = 1
```

**Use `pre` (before Present) for:**
- Drawing overlays on top of the rendered frame
- Post-processing effects
- Capturing final frame state
- Final calculations after all rendering

**Frame association:** Commands belong to Frame N (the frame that just finished rendering)

### Post (After Present Call) - Default

By default, or when explicitly using `post`, commands execute **after the Present() API call**, at the start of Frame N+1 before any rendering occurs:

```ini
[Present]
; These all execute after Present() call (start of Frame N+1)
$frame_init = 0
post $frame_init = 0        ; Explicit post (same as above)
post ResourceTemp = null    ; Clear resource before frame starts
```

**Use `post` (after Present) for:**
- Initializing variables for the new frame
- Clearing temporary resources
- Resetting counters
- Setting up state before rendering begins

**Frame association:** Commands belong to Frame N+1 (the frame about to start rendering)

### Execution Order

The complete execution order across frame boundaries:

1. **Frame N rendering** (game draw calls and shader overrides)
2. **Frame N `pre` commands** (before Present call)
3. **Present() API call** ← **Frame boundary**
4. **Frame N+1 `post` commands** (after Present call)
5. **Frame N+1 rendering** (game draw calls and shader overrides)

```ini
[Present]
; After Present() call - initialize new frame
post $frame_start = time
post x10 = 0

; Before Present() call - finalize completed frame
pre $frame_end = time
pre x11 = x10
pre run = CommandListOverlay
```

## Common Use Cases

### Frame Counter

```ini
[Present]
; Increment at start of each frame
post $frame = $frame + 1

; Reset every 3600 frames (60 seconds at 60fps)
if $frame >= 3600
    post $frame = 0
endif
```

### Resource Cleanup

```ini
[Present]
; Clear temporary resources at start of frame
post ResourceTempA = null
post ResourceTempB = null

; Reset per-frame limits
post reset_per_frame_limits = resourceExpensiveResource
```

### Per-Frame Animation

```ini
[Present]
; Update animation time
post $anim_time = time % 10

; Cycle through textures
$texture_index = (time // 0.5) % 4
if $texture_index == 0
    x20 = 0
elif $texture_index == 1
    x20 = 1
elif $texture_index == 2
    x20 = 2
else
    x20 = 3
endif
```

### Overlay Drawing

```ini
[Present]
; Draw custom overlay at end of frame
pre run = CustomShaderOverlay
pre special = draw_3dmigoto_overlay
```

### State Management

```ini
[Present]
; Initialize state at frame start
post $processing = 0

; Update throughout frame via shader overrides
; ...

; Check state at frame end
pre if $processing > 0
    x25 = 1
else
    x25 = 0
endif
```

## Practical Examples

### Example 1: Frame Timing

```ini
[Present]
; Record frame start time
post $frame_start_time = time

; Calculate delta time (after frame ends)
pre $delta_time = time - $frame_start_time
pre x30 = $delta_time
```

### Example 2: Conditional Per-Frame Effect

```ini
[KeyToggleEffect]
key = VK_F2
$effect_enabled = !$effect_enabled

[Present]
; Only run effect if enabled
if $effect_enabled
    pre run = CustomShaderBlur
    pre x15 = 1
else
    pre x15 = 0
endif
```

### Example 3: Resource Ping-Pong

```ini
[Present]
; Toggle between two buffers each frame
post $buffer_toggle = !$buffer_toggle

if $buffer_toggle
    post ps-t100 = ResourceBufferA
else
    post ps-t100 = ResourceBufferB
endif
```

### Example 4: Performance Monitoring

```ini
[Present]
; Count shader invocations (reset each frame)
post $shader_count = 0

; After frame, check count
pre if $shader_count > 1000
    x40 = 1  ; High usage indicator
else
    x40 = 0
endif
```

### Example 5: Resolution Change Detection

```ini
[Present]
; Check for resolution changes at start of frame
if res_width != $last_width || res_height != $last_height
    post $resolution_changed = 1
    post $last_width = res_width
    post $last_height = res_height
    
    ; Trigger resolution-dependent updates
    post run = CommandListResolutionUpdate
else
    post $resolution_changed = 0
endif
```

### Example 6: Multi-Pass Effect Chain

```ini
[Present]
; Execute multi-pass effect at end of frame
pre run = CustomShaderPass1
pre run = CustomShaderPass2
pre run = CustomShaderPass3

; Copy final result
pre ResourceFinalOutput = copy o0
```

## Pre vs Post Decision Guide

Choose `post` (start of frame) when:
- Initializing variables
- Clearing resources
- Resetting counters
- Setting up initial state
- You need values ready before rendering starts

Choose `pre` (end of frame) when:
- Drawing overlays
- Post-processing effects
- Capturing rendered output
- Finalizing calculations
- You need to process the completed frame

## Common Pitfalls

### Wrong Execution Phase

```ini
; WRONG: Trying to process frame output at start
[Present]
post ResourceBackup = copy o0  ; o0 hasn't been rendered yet!

; CORRECT: Process output at end of frame
[Present]
pre ResourceBackup = copy o0
```

### Order Dependencies

```ini
; WRONG: Using variable before initialization
[Present]
x10 = $value + 1
post $value = 0  ; Initialized after use

; CORRECT: Initialize first
[Present]
post $value = 0
x10 = $value + 1
```

### Resource Timing

```ini
; WRONG: Clearing resource after it's needed
[Present]
pre ResourceTemp = null
; But shaders during the frame need ResourceTemp!

; CORRECT: Clear at start of next frame
[Present]
post ResourceTemp = null
```

## Combining with Other Sections

Present works alongside other sections:

```ini
[Present]
; Per-frame setup
post $frame_active = 1
post run = CommandListFrameInit

[ShaderOverrideExample]
hash = abcd1234
; This runs when shader is used (during frame)
if $frame_active
    run = CommandListProcessShader
endif

[KeyToggle]
key = VK_F1
; This runs when key is pressed
$feature_enabled = !$feature_enabled
```

## Performance Considerations

Present runs every frame, so keep operations efficient:

```ini
[Present]
; GOOD: Lightweight operations
post x0 = x0 + 1
post $toggle = !$toggle

; CAUTION: Expensive every frame
pre run = CustomShaderExpensiveEffect  ; Consider if needed every frame

; BETTER: Conditional execution
if $expensive_effect_enabled
    pre run = CustomShaderExpensiveEffect
endif
```

## Built-in Uses

The Present section can also invoke built-in operations:

```ini
[Present]
; Switch backbuffer for upscaling support
special = upscaling_switch_bb

; Draw 3dmigoto overlay
pre special = draw_3dmigoto_overlay
```
