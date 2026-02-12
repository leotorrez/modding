# Lifespan of a Frame

This page documents the complete execution flow of a frame in 3dmigoto, from initialization through rendering to Present() and into the next frame.

## Overview

Understanding frame execution order is critical for proper mod behavior, especially when using `pre` and `post` modifiers, manipulating resources, and coordinating multiple mods.

A "frame" represents one complete render cycle, from the start of drawing to the display of the final image on screen.

---

## Frame Execution Phases

Each frame goes through several distinct phases:

```
┌─────────────────────────────────────────────────────┐
│ Frame N+1 Initialization (post)                    │
├─────────────────────────────────────────────────────┤
│ Draw Call Processing                                │
│   - Vertex Shader Execution                         │
│   - Hull/Domain/Geometry Shader Execution           │
│   - Pixel Shader Execution                          │
│   - ShaderOverride Command Lists                    │
│   - TextureOverride Command Lists                   │
│   - ClearRenderTargetView/DepthStencilView          │
├─────────────────────────────────────────────────────┤
│ Frame N Finalization (pre)                          │
├─────────────────────────────────────────────────────┤
│ Present() Call ← FRAME BOUNDARY                     │
├─────────────────────────────────────────────────────┤
│ Frame N+2 Initialization (post)                    │
└─────────────────────────────────────────────────────┘
```

---

## Complete Frame Timeline

### Phase 1: Frame Initialization (post)

**When:** After Present() call, before any rendering

**What Happens:**
1. Frame counter increments
2. `[Present]` section `post` commands execute (default)
3. Variables initialized for new frame
4. Temporary resources cleared
5. State prepared for rendering

**Example:**
```ini
[Present]
; Default timing is post (after Present() call)
$frame_start_time = time
$draw_call_count = 0

; Clear temporary resources
ResourceTemp = null

; Initialize frame state
post x100 = 0
post y100 = 0
```

**Purpose:**
- Reset per-frame counters
- Clear temporary data
- Set initial state for upcoming draw calls

Reference: HackerDXGI.cpp (Present handling)

---

### Phase 2: Game Rendering Begins

**When:** Frame N rendering starts

**What Happens:**
- Game engine issues DirectX draw calls
- 3dmigoto intercepts and processes each call
- ShaderOverride and TextureOverride sections may execute

---

### Phase 3: Draw Call Processing

For each draw call issued by the game:

#### Step 1: Pre-Draw Setup

1. **Identify Bound Resources:**
   - Vertex/index buffers
   - Textures (shader resource views)
   - Constant buffers
   - Render targets
   - Depth/stencil buffers

2. **Calculate Hashes:**
   - Shader hashes (vertex, pixel, etc.)
   - Texture hashes
   - Buffer hashes

3. **Check Overrides:**
   - Match `[ShaderOverride*]` by shader hash
   - Match `[TextureOverride*]` by texture hash or properties

#### Step 2: ShaderOverride Execution

If shader hash matches a `[ShaderOverride*]` section:

```ini
[ShaderOverride0123456789abcdef]
hash = 0123456789abcdef

; Pre-draw commands execute BEFORE draw call
run = CommandListPreDraw

; Handling affects draw call behavior
handling = skip  ; Don't execute draw call
```

**Execution Order:**
1. Pre-draw command lists execute
2. Resource bindings modified
3. Pipeline state changed
4. Draw call handling determined (skip/normal)

Reference: HackerContext.cpp:2036-2577

#### Step 3: TextureOverride Execution

If texture matches a `[TextureOverride*]` section:

```ini
[TextureOverrideRenderTarget]
hash = 12345678
ps-t0 = ResourceCustomRT
run = CommandListTextureSetup
```

**Execution Order:**
1. Texture match evaluated
2. Command list executes
3. Resource replacements applied
4. `checktextureoverride` may trigger from ShaderOverride

Reference: Override.cpp:787-1090

#### Step 4: Draw Call Execution

**If not skipped:**
1. Bound resources finalized
2. Pipeline state set
3. Draw call issued to GPU
4. GPU processes vertices and pixels

**If skipped (handling=skip):**
- Draw call not sent to GPU
- Shader doesn't execute
- No pixels rendered

#### Step 5: Post-Draw Cleanup

1. Resource references released
2. Modified state may persist for next draw
3. Draw call count incremented

---

### Phase 4: Render Target Clears

`[ClearRenderTargetView]` and related sections execute when game clears render targets:

```ini
[ClearRenderTargetView]
run = CommandListOnClear
```

**Timing:** Whenever game calls `ClearRenderTargetView()`, typically at:
- Start of frame
- Between rendering passes
- Before post-processing

Reference: HackerContext.cpp:165-200

---

### Phase 5: Compute Shader Dispatches

Compute shaders execute asynchronously from rendering pipeline:

```ini
[ShaderOverride_ComputeShader]
hash = cs_hash_here
run = CommandListComputeSetup
```

**Characteristics:**
- Can execute at any point during frame
- May run in parallel with rendering
- Access buffers and textures via UAVs

Reference: HackerContext.cpp (Dispatch handling)

---

### Phase 6: Frame Finalization (pre)

**When:** After all rendering complete, before Present() call

**What Happens:**
1. Final rendering completed
2. `[Present]` section `pre` commands execute
3. Post-processing applied
4. Overlays drawn
5. Final state captured

**Example:**
```ini
[Present]
; Before Present() call - after rendering completes
pre $frame_end_time = time
pre $frame_duration = $frame_end_time - $frame_start_time

; Draw overlay on completed frame
pre run = CustomShaderOverlay

; Capture final state
pre x101 = $draw_call_count
```

**Purpose:**
- Post-processing effects
- Overlay rendering
- Frame statistics collection
- Screen capture preparation

Reference: HackerDXGI.cpp (Present handling)

---

### Phase 7: Present() Call

**The Frame Boundary**

```
Present() ← Frame N ends, Frame N+1 begins
```

**What Happens:**
1. Back buffer swapped to front buffer (displayed)
2. GPU command queue flushed
3. VSync may occur (if enabled)
4. Frame timing recorded

**This is the conceptual boundary between frames.**

Reference: HackerDXGI.cpp:243-406

---

## Timing Visualization

### Single Frame

```
Time →
    │
    ├─ [Frame N post] Initialize
    │
    ├─ DrawIndexed(...)         ← ShaderOverride may execute
    ├─ DrawIndexed(...)         ← TextureOverride may execute
    ├─ Draw(...)
    ├─ DrawIndexed(...)
    │  ... thousands of draw calls ...
    ├─ ClearRenderTargetView()  ← Clear sections may execute
    ├─ DrawIndexed(...)
    │
    ├─ [Frame N pre] Finalize
    │
    ├─ Present() ←─────────────── FRAME BOUNDARY
    │
    ├─ [Frame N+1 post] Initialize
    │
    └─ ...
```

### Multiple Frames

```
Frame N:
    [post] Initialize N
    Draw calls...
    [pre] Finalize N
    Present() ←─── Frame Boundary
    
Frame N+1:
    [post] Initialize N+1
    Draw calls...
    [pre] Finalize N+1
    Present() ←─── Frame Boundary
    
Frame N+2:
    [post] Initialize N+2
    ...
```

---

## Command Execution Contexts

### [Present] Commands

Execute once per frame (unless frame analysis hold mode):

```ini
[Present]
; post (default) - after Present(), before rendering
$counter = $counter + 1

; pre - before Present(), after rendering
pre $final_value = x10
```

**Frequency:** Every frame

### [ShaderOverride*] Commands

Execute when shader is used in a draw call:

```ini
[ShaderOverride0123456789abcdef]
hash = 0123456789abcdef
run = CommandListCharacter
```

**Frequency:** 0-many times per frame (depends on draw calls)

### [TextureOverride*] Commands

Execute when texture is bound or when `checktextureoverride` called:

```ini
[TextureOverrideRT]
hash = 12345678
run = CommandListRTSetup
```

**Frequency:** 0-many times per frame

### [Key*] Commands

Execute when key pressed/released:

```ini
[KeyToggle]
Key = VK_F5
type = cycle
run = CommandListToggle
```

**Frequency:** On user input only

---

## Resource Lifespan

### Frame-Local Resources

Created and destroyed within single frame:

```ini
[Present]
; Create temporary resource
post ResourceTemp = copy ps-t0

[ShaderOverride...]
; Use temporary resource
ps-t5 = ResourceTemp

[Present]
; Clear temporary resource
pre ResourceTemp = null
```

### Persistent Resources

Survive across frames:

```ini
[ResourcePersistent]
type = Texture2D
width = 1920
height = 1080

[Present]
; Always available
ps-t10 = ResourcePersistent
```

### Reference vs Copy

**Reference (ref):**
- No data copied
- Points to same GPU resource
- Changes to original affect reference
- Lightweight

**Copy:**
- Data duplicated
- Independent GPU resource
- Changes to original don't affect copy
- Heavier operation

See [Modifiers - ref](./modifiers.md#ref) for details.

---

## Draw Call Order

Draw calls execute in the order the game issues them, which typically follows rendering logic:

### Typical Render Order

1. **Depth Pre-pass**
   - Render geometry to depth buffer only
   - No color output

2. **Shadow Maps**
   - Render from light's perspective
   - Create shadow depth maps

3. **Opaque Geometry**
   - Main scene geometry
   - Front-to-back sorting (usually)

4. **Sky/Environment**
   - Skybox or environment map

5. **Transparent Geometry**
   - Glass, water, particles
   - Back-to-front sorting

6. **Post-Processing**
   - Screen-space effects
   - Tone mapping, bloom, etc.

7. **UI/HUD**
   - 2D interface elements
   - Rendered last (on top)

**Note:** Actual order varies by game engine and rendering technique.

---

## Frame Analysis Implications

Frame analysis captures a complete frame including all phases:

```
FrameAnalysis-2024-02-10-150000/
├── log.txt                 ← Complete frame timeline
├── 000000-vb0=...          ← First draw call resources
├── 000001-ps-t0=...        ← Textures
├── 000042-o0=...           ← Render target at specific draw
└── ...
```

**Log Format:**
```
000000 Draw(...)           ← Draw call 0
000000 VS: hash=...        ← Vertex shader
000000 PS: hash=...        ← Pixel shader
000001 DrawIndexed(...)    ← Draw call 1
...
```

See [Debugging - Frame Analysis](./debugging.md#frame-analysis) for details.

---

## Performance Considerations

### Minimize Per-Frame Work

**Bad:**
```ini
[Present]
; Heavy calculation every frame
post run = CustomShaderExpensive
```

**Better:**
```ini
[Present]
; Only when needed
post if $trigger == 1
    run = CustomShaderExpensive
    $trigger = 0
endif
```

### Avoid Redundant Operations

**Bad:**
```ini
[ShaderOverride...]
; Copies every draw call
ps-t10 = copy ResourceLarge
```

**Better:**
```ini
[Present]
; Copy once per frame
post ps-t10 = copy ResourceLarge
```

### Use References When Possible

**Bad:**
```ini
; Copies data every time
ps-t5 = copy ps-t0
```

**Better:**
```ini
; Just references, no copy
ps-t5 = ref ps-t0
```

---

## Common Patterns

### Per-Frame Initialization

```ini
[Present]
; Reset counters at frame start
post $draw_count = 0
post $visible_objects = 0

[ShaderOverride...]
; Track draws
$draw_count = $draw_count + 1
```

### Frame Timing

```ini
[Constants]
global $last_frame_time = 0

[Present]
post $current_time = time
post $delta_time = $current_time - $last_frame_time
post $last_frame_time = $current_time
post $fps = 1.0 / $delta_time
```

### Progressive Effects

```ini
[Constants]
global persist $effect_accumulator = 0

[Present]
; Accumulate over frames
post $effect_accumulator = $effect_accumulator + 0.01
post if $effect_accumulator > 1.0
    $effect_accumulator = 1.0
endif
post x20 = $effect_accumulator
```

### Capture Final Frame State

```ini
[Present]
; Before Present() - frame is complete
pre $final_rt_width = rt_width
pre $final_rt_height = rt_height
pre run = CustomShaderCapture
```

---

## Deferred Contexts

Games using deferred contexts have multiple render timelines executing in parallel:

```
Immediate Context (Main):
    [post] Initialize
    Draw calls...
    [pre] Finalize
    Present()

Deferred Context 1:
    CommandList recording
    Draw calls...
    ExecuteCommandList() → Merges to immediate

Deferred Context 2:
    CommandList recording
    Draw calls...
    ExecuteCommandList() → Merges to immediate
```

**Implications:**
- Multiple threads recording commands
- Commands execute when ExecuteCommandList() called
- Frame analysis creates separate logs per context

Reference: HackerContext.cpp (deferred context handling)

---

## Best Practices

### Use Correct Timing

```ini
[Present]
; Initialize BEFORE rendering starts
post $frame_counter = $frame_counter + 1
post ResourceTemp = null

; Finalize AFTER rendering completes
pre run = CustomShaderOverlay
pre $frame_stats = x100
```

### Avoid Side Effects in ShaderOverride

```ini
; BAD: Modifies global state during draw call
[ShaderOverride...]
$global_counter = $global_counter + 1  ; Runs many times!

; GOOD: Collect data, process in [Present]
[ShaderOverride...]
$this_draw_flag = 1

[Present]
pre if $this_draw_flag == 1
    $global_counter = $global_counter + 1
    $this_draw_flag = 0
endif
```

### Clear Temporary State

```ini
[Present]
; Clear at start of frame
post $temp_value = 0
post ResourceTemp = null

; Use during frame
[ShaderOverride...]
$temp_value = vertex_count

; Process at end of frame
[Present]
pre x50 = $temp_value
```

---

## Debugging Frame Flow

### Log Frame Boundaries

```ini
[Present]
post x990 = frame_no
post y990 = time

pre x991 = frame_no
pre y991 = time
```

### Track Draw Call Count

```ini
[Constants]
global $draw_call_count = 0

[Present]
post $draw_call_count = 0

[ShaderOverride...]
$draw_call_count = $draw_call_count + 1

[Present]
pre x995 = $draw_call_count
```

### Visualize Timing

```ini
[Present]
post $frame_start = time
pre $frame_end = time
pre $frame_duration = ($frame_end - $frame_start) * 1000.0
pre x996 = $frame_duration  ; Frame time in milliseconds
```

---
