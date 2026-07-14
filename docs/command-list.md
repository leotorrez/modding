# CommandList

CommandLists are reusable blocks of commands that function like subroutines in programming. They can be called from [ShaderOverride](/docs/shader-override.md), [TextureOverride](/docs/texture-override.md), [Present](/docs/present.md), [Key](/docs/key.md), and other CommandLists. CommandLists allow you to organize complex logic, reuse code, and execute custom operations at specific points during rendering.

## Definition

CommandLists are defined with sections named `[CommandList*]` where `*` can be any identifier:

```ini
[CommandListExample]
; Commands go here
x0 = x0 + 1
ps-t0 = ResourceCustomTexture

[CommandListToggleLogic]
$enabled = !$enabled
if $enabled
    run = CommandListEnable
else
    run = CommandListDisable
endif

[CommandListFixReflection]
; Copy depth buffer for reflection calculations
vs-t110 = oD
```

## Usage

CommandLists are invoked using the `run` command:

```ini
[Present]
; Run every frame
run = CommandListPerFrame
post run = CommandListFrameStart

[KeyToggle]
key = VK_F1
run = CommandListToggle

[ShaderOverrideExample]
hash = abcd1234
run = CommandListProcessShader

[CommandListNesting]
; CommandLists can call other CommandLists
run = CommandListSubroutine
```

## Available Commands

CommandList sections support a wide variety of commands for manipulating resources, controlling flow, and performing draw operations.

### Resource Binding Commands

Resource binding commands assign resources to shader pipeline slots or copy resources between locations.

#### Shader Stage Slots

Resources can be bound to specific shader stages using the following syntax:

**Format:** `<shader>-<type><slot> = <source> [options]`

**Shader Stages:**
- `vs` - Vertex Shader
- `hs` - Hull Shader (tessellation control)
- `ds` - Domain Shader (tessellation evaluation)
- `gs` - Geometry Shader
- `ps` - Pixel Shader (Fragment Shader)
- `cs` - Compute Shader

**Resource Types:**
- `t#` - Shader Resource View (textures, buffers) - Slots 0-127
- `cb#` - Constant Buffer - Slots 0-14
- `u#` - Unordered Access View (read/write, pixel/compute only) - Slots 0-7

**Examples:**

```ini
; Bind texture to vertex shader slot 0
vs-t0 = ResourceCustomTexture

; Bind constant buffer to pixel shader slot 1
ps-cb1 = ResourceParameters

; Bind UAV to compute shader slot 0
cs-u0 = ResourceComputeOutput

; Copy texture from pixel shader to vertex shader
vs-t5 = ps-t0

; Bind depth buffer to vertex shader for depth-aware effects
vs-t110 = oD
```

#### Render Targets and Buffers

**Render Targets:**
- `o0` through `o7` - Render target output slots
- `oD` - Depth/Stencil target (also written as `od`)

**Vertex and Index Buffers:**
- `vb#` - Vertex buffer slots (0-15)
- `ib` - Index buffer

**Stream Output:**
- `so#` - Stream output buffer slots (0-3)

**Examples:**

```ini
; Copy render target 0 to custom resource
ResourceBackup = o0

; Swap index buffers
ib = ResourceCustomIB

; Assign vertex buffer
vb0 = ResourcePositions
vb1 = ResourceNormals
```

#### Special Source Values

**Built-in Sources:**
- `null` - Unbind/clear the slot
- `this` - Reference the current resource being processed
- `bb` - Back buffer (swap chain)
- `r_bb` - Real back buffer
- `f_bb` - Fake back buffer
- `iniparams` - IniParams texture
- `cursor_mask` - Cursor mask texture
- `cursor_color` - Cursor color texture
- `Resource*` - Custom resource by name

**Examples:**

```ini
; Unbind texture slot
ps-t0 = null

; Use the texture being overridden
ps-t1 = this

; Access the back buffer
ps-t100 = bb

; Reference a custom resource
ps-t0 = ResourceDiffuse
```

#### Resource Binding Options

Options modify how resources are bound or copied. Multiple options can be combined with spaces.

| Option          | Description                                              |
|-----------------|----------------------------------------------------------|
| `copy`          | Force a full resource copy instead of reference         |
| `reference`     | Use lightweight reference (default for compatible ops)  |
| `unless_null`   | Only bind if source exists (skip if source is null)     |
| `resolve_msaa`  | Resolve multisampled texture when copying               |
| `mono`          | Force mono instead of stereo                             |
| `stereo2mono`   | Convert stereo to mono (alternative name)               |
| `copy_desc`     | Copy resource description instead of data               |
| `set_viewport`  | Adjust viewport when copying                             |
| `no_view_cache` | Don't cache views of this resource                       |
| `raw_view`      | Create raw buffer view                                   |

**Examples:**

```ini
; Copy depth buffer instead of referencing
vs-t110 = copy oD

; Only bind if resource exists
ps-t0 = unless_null ResourceOptional

; Resolve MSAA texture when copying
ResourceResolved = resolve_msaa o0

; Copy with multiple options
ResourceBackup = copy set_viewport o0

; Reference unless null
ps-t1 = reference unless_null ps-t0
```

### Flow Control Commands

#### run

Execute another CommandList or CustomShader:

**Syntax:** `run = <CommandListName>` or `run = <CustomShaderName>`

```ini
[CommandListMain]
run = CommandListSubroutine

[CommandListConditional]
if x0 > 10
    run = CommandListHighValue
else
    run = CommandListLowValue
endif

[ShaderOverrideExample]
hash = abcd1234
; Run custom shader
run = CustomShaderBlur
```

#### checktextureoverride

Check for and execute TextureOverride sections matching textures in specified slots:

**Syntax:** `checktextureoverride = <slot>`

```ini
[ShaderOverrideExample]
hash = abcd1234
; Check if ps-t0 has a TextureOverride and run its commands
checktextureoverride = ps-t0

; Check multiple slots
checktextureoverride = ps-t1
checktextureoverride = ps-t2
```

#### handling

Control the execution of the original draw call:

**Syntax:** `handling = skip | abort`

- `skip` - Prevent the game's original draw call from executing (pre only)
- `abort` - Stop executing the current CommandList

```ini
[ShaderOverrideExample]
hash = abcd1234
; Skip the original draw call
handling = skip

; Draw our custom version instead
ib = ResourceCustomIB
ps-t0 = ResourceCustomTexture
drawindexed = auto

[CommandListConditional]
if $should_abort
    handling = abort
endif
; Commands here won't execute if $should_abort is true
```

### Draw and Dispatch Commands

Draw and dispatch commands create new draw calls. See [Draw Calls](/docs/draw-calls.md) for comprehensive documentation.

#### draw

Direct vertex drawing without index buffer:

**Syntax:** 
- `draw = <vertex_count>, <start_vertex>`
- `draw = auto` - Auto-calculate from vertex buffer
- `draw = from_caller` - Use parameters from original draw call

```ini
; Draw 100 vertices starting at vertex 0
draw = 100, 0

; Auto-calculate vertex count
draw = auto

; Use original call parameters
draw = from_caller
```

#### drawauto

DrawAuto call (vertex count determined by stream output):

```ini
drawauto
```

#### drawindexed

Draw using index buffer:

**Syntax:**
- `drawindexed = <index_count>, <start_index>, <base_vertex>`
- `drawindexed = auto` - Auto-calculate from index buffer

```ini
; Draw 1000 indices starting at index 0, base vertex 0
drawindexed = 1000, 0, 0

; Auto-calculate from index buffer
drawindexed = auto
```

#### drawindexedinstanced

Draw multiple instances using index buffer:

**Syntax:**
- `drawindexedinstanced = <index_count>, <instance_count>, <start_index>, <base_vertex>, <start_instance>`
- `drawindexedinstanced = auto` - Auto-calculate counts

```ini
; Draw 1000 indices, 10 instances
drawindexedinstanced = 1000, 10, 0, 0, 0

; Auto-calculate
drawindexedinstanced = auto
```

#### drawinstanced

Draw multiple instances without index buffer:

**Syntax:**
- `drawinstanced = <vertex_count>, <instance_count>, <start_vertex>, <start_instance>`

```ini
; Draw 100 vertices, 5 instances
drawinstanced = 100, 5, 0, 0
```

#### dispatch

Execute compute shader:

**Syntax:** `dispatch = <thread_group_x>, <thread_group_y>, <thread_group_z>`

```ini
; Dispatch compute shader with 16x16x1 thread groups
dispatch = 16, 16, 1

; Can use expressions
dispatch = res_width // 8, res_height // 8, 1
```

#### Indirect Draw/Dispatch Commands

Execute draw/dispatch with parameters from a buffer:

```ini
; Draw indexed instanced indirect
drawindexedinstancedindirect = ResourceDrawArgs, 0

; Draw instanced indirect
drawinstancedindirect = ResourceDrawArgs, 0

; Dispatch indirect
dispatchindirect = ResourceDispatchArgs, 0
```

### Variable and Parameter Operations

Set variables and IniParams using [expressions](/docs/expressions.md):

```ini
; IniParams
x0 = 10
y0 = x0 * 2
z0 = time % 60

; Variables
$counter = $counter + 1
$enabled = !$enabled
$value = rt_width / res_width

; Conditional assignment
if x0 > 100
    x0 = 0
else
    x0 = x0 + 1
endif
```

See [Properties](/docs/properties.md) and [Expressions](/docs/expressions.md) for more details.

### Clear Commands

Clear render targets, depth buffers, or UAVs:

**Syntax:**
- `clear = <target> <r> <g> <b> <a>` - Clear render target
- `clear = <target> <value> int` - Clear UAV as integer
- `clear = <target> <value> float` - Clear UAV as float
- `clear = <target> depth stencil` - Clear depth/stencil

```ini
; Clear render target 0 to black
clear = o0 0 0 0 0

; Clear to red
clear = o0 1 0 0 1

; Clear depth and stencil
clear = oD depth stencil

; Clear UAV to zero as integer
clear = ps-u0 0 int

; Clear UAV as float
clear = ps-u0 0.5 float
```

### Frame Analysis and Debugging Commands

#### dump

Dump resources during frame analysis:

**Syntax:** `dump = [options] <target>`

**Options:** `buf`, `vb`, `ib`, `tex`, `dds`, `jps`, `bin`, `txt`, `mono`, `stereo`, `share_dupes`

```ini
; Dump texture in ps-t0
dump = tex dds ps-t0

; Dump custom resource
dump = ResourceDepthBuffer

; Dump with multiple options
pre dump = tex dds mono o0
```

#### analyse_options

Change frame analysis options mid-frame:

**Syntax:** `analyse_options = <options> [persist]`

```ini
; Change frame analysis options for this draw call
analyse_options = dump_rt

; Change persistently for rest of frame
analyse_options = dump_rt persist
```

### Performance Commands

#### reset_per_frame_limits

Reset per-frame execution or copy counters:

**Syntax:** 
- `reset_per_frame_limits = resource<ResourceName>`
- `reset_per_frame_limits = customshader<ShaderName>`

```ini
[Present]
; Reset resource copy counter at start of frame
post reset_per_frame_limits = resourceBackupBuffer

; Reset custom shader execution counter
post reset_per_frame_limits = customshaderBlurEffect
```

### Stereo/3D Commands

Commands for controlling stereoscopic 3D rendering:

#### separation

Override stereo separation value:

**Syntax:** `separation = <value | expression>`

```ini
; Set fixed separation
separation = 1.5

; Dynamic separation based on resolution
separation = rt_width / 1920

; Restore default
separation = default
```

#### convergence

Override convergence value:

**Syntax:** `convergence = <value | expression>`

```ini
; Set fixed convergence
convergence = 0.5

; Dynamic convergence
convergence = x0

; Restore default
convergence = default
```

#### direct_mode_eye

Select which eye to render in direct mode:

**Syntax:** `direct_mode_eye = mono | left | right`

```ini
; Render as mono
direct_mode_eye = mono

; Render left eye only
direct_mode_eye = left

; Render right eye only
direct_mode_eye = right
```

### Preset Commands

#### preset

Activate a preset:

**Syntax:** `preset = <PresetName>`

```ini
[ShaderOverrideExample]
hash = abcd1234
; Activate preset when this shader is used
preset = PresetCinematic
```

#### exclude_preset

Exclude a preset from activation:

**Syntax:** `exclude_preset = <PresetName>`

```ini
[ShaderOverrideExample]
hash = abcd1234
; Don't activate this preset here
exclude_preset = PresetDefaultSeparation
```

See [Key](/docs/key.md) for more information on presets.

### Special Commands

#### special

Execute special built-in operations:

**Syntax:** `special = <operation>`

**Available operations:**
- `upscaling_switch_bb` - Switch back buffer for upscaling support
- `draw_3dmigoto_overlay` - Draw the 3dmigoto overlay

```ini
[Present]
; Switch back buffer for upscaling
special = upscaling_switch_bb

; Draw overlay
special = draw_3dmigoto_overlay
```

## Pre and Post Modifiers

Commands can be prefixed with `pre` or `post` to control when they execute relative to draw calls:

- `pre` (default) - Execute before the draw call
- `post` - Execute after the draw call completes

```ini
[ShaderOverrideExample]
hash = abcd1234

; Backup render target before draw call
pre ResourceBackup = copy o0

; Process result after draw call
post ResourceProcessed = copy o0
post run = CommandListPostProcess

[Present]
; Execute at start of frame
post x0 = 0
post ResourceTemp = null

; Execute at end of frame (default)
run = CommandListFrameEnd
```

## Conditional Execution

CommandLists support conditional logic using `if`, `elif`, `else`, and `endif`:

```ini
[CommandListExample]
if x0 > 100
    run = CommandListHighValue
    ps-t0 = ResourceHighDetail
elif x0 > 50
    run = CommandListMediumValue
    ps-t0 = ResourceMediumDetail
else
    run = CommandListLowValue
    ps-t0 = ResourceLowDetail
endif

; Nested conditions
if $enabled
    if x0 > 0
        run = CommandListActive
    endif
endif
```

See [Expressions](/docs/expressions.md) for more details on conditionals and operators.

## Built-in CommandLists

3dmigoto provides some built-in CommandLists for common operations:

### BuiltInCommandListUnbindAllRenderTargets

Unbinds all render target and depth/stencil slots:

```ini
[CommandListExample]
; Unbind all render targets
run = BuiltInCommandListUnbindAllRenderTargets

; Equivalent to:
; o0 = null
; o1 = null
; o2 = null
; o3 = null
; o4 = null
; o5 = null
; o6 = null
; o7 = null
; oD = null
```

## Practical Examples

### Example 1: Toggle Feature with Key

```ini
[KeyToggleFeature]
key = VK_F1
run = CommandListToggleFeature

[CommandListToggleFeature]
; Toggle enabled state
$feature_enabled = !$feature_enabled

; Update IniParam for shader access
if $feature_enabled
    x10 = 1
else
    x10 = 0
endif
```

### Example 2: Backup and Restore Render Target

```ini
[ShaderOverrideBackup]
hash = abcd1234
; Backup render target before shader runs
pre ResourceBackup = copy o0

[ShaderOverrideRestore]
hash = efgh5678
; Restore backed up render target
o0 = ResourceBackup
```

### Example 3: Custom Post-Process Effect

```ini
[Present]
; Run custom blur effect at end of frame
run = CustomShaderBlur

[CustomShaderBlur]
; Bind back buffer as input
ps-t0 = o0

; Run blur shader
vs = ShaderFixes\fullscreen_vs.hlsl
ps = ShaderFixes\blur_ps.hlsl

; Draw fullscreen triangle
draw = 6, 0

; Copy result back to render target
post o0 = ps-u0
```

### Example 4: Resolution-Dependent Logic

```ini
[CommandListAdaptive]
; Different behavior based on resolution
if res_width >= 3840 && res_height >= 2160
    ; 4K settings
    x0 = 2.0
    ps-t10 = ResourceHighResTexture
elif res_width >= 2560 && res_height >= 1440
    ; 1440p settings
    x0 = 1.5
    ps-t10 = ResourceMediumResTexture
else
    ; 1080p or lower
    x0 = 1.0
    ps-t10 = ResourceLowResTexture
endif
```

### Example 5: Frame-Based Animation

```ini
[Present]
post run = CommandListAnimate

[CommandListAnimate]
; Increment frame counter
$frame = $frame + 1

; Cycle through 4 textures every 15 frames
$texture_index = ($frame // 15) % 4

if $texture_index == 0
    ps-t100 = ResourceTex0
elif $texture_index == 1
    ps-t100 = ResourceTex1
elif $texture_index == 2
    ps-t100 = ResourceTex2
else
    ps-t100 = ResourceTex3
endif
```

### Example 6: Conditional Resource Swapping

```ini
[ShaderOverrideExample]
hash = abcd1234

; Check if cursor is visible
if cursor_showing && cursor_x > 100 && cursor_x < 200
    ; Cursor over UI element - use highlight texture
    ps-t0 = ResourceHighlight
    x5 = 1
else
    ; Normal texture
    ps-t0 = ResourceNormal
    x5 = 0
endif

checktextureoverride = ps-t0
drawindexed = auto
```

## Common Pitfalls

### Order Matters

Commands execute in the order they appear:

```ini
; WRONG: Resource used before it's populated
ps-t0 = ResourceTemp
ResourceTemp = copy oD

; CORRECT: Populate resource first
ResourceTemp = copy oD
ps-t0 = ResourceTemp
```

### Pre vs Post

Use `post` when you need the draw call results:

```ini
; WRONG: Trying to copy output before draw happens
ResourceResult = copy o0
drawindexed = auto

; CORRECT: Copy after draw completes
drawindexed = auto
post ResourceResult = copy o0
```

### Reference vs Copy

Understand when to use references vs copies:

```ini
; Reference is fine for shader-to-shader binding
vs-t0 = ps-t0              ; Lightweight reference

; Copy needed for render target access
vs-t110 = copy oD          ; Must copy depth buffer

; Unless_null avoids errors
ps-t1 = unless_null ResourceMaybeEmpty
```
