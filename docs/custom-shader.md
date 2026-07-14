# CustomShader

CustomShader sections define custom shader pipelines with full control over shaders, render states, resource bindings, and draw/dispatch commands. They act as reusable rendering operations that can be invoked from anywhere using `run = CustomShaderName`.

## Overview

CustomShader sections enable advanced rendering techniques by providing:

- **Complete Shader Control** - Assign vertex, hull, domain, geometry, pixel, and compute shaders
- **Render State Configuration** - Control blending, depth/stencil, rasterizer states
- **Resource Binding** - Bind textures, buffers, constant buffers, UAVs, render targets
- **Draw/Dispatch Commands** - Execute rendering or compute operations
- **Command Lists** - Pre and post command lists for setup and cleanup
- **State Merging** - Selectively modify states without replacing entire pipeline

**Syntax:**
```ini
[CustomShaderName]
; Shader assignments
vs = vertex_shader.hlsl
ps = pixel_shader.hlsl

; Render states
blend = ADD SRC_ALPHA INV_SRC_ALPHA
depth_enable = false

; Resource binding
ps-t0 = ResourceInput
o0 = ResourceOutput

; Draw command
draw = 4, 0

; Cleanup
post ps-t0 = null
```

**Invocation:**
```ini
[Present]
run = CustomShaderName
```

---

## Shader Assignment

Assign custom shaders to pipeline stages. Shaders are compiled to Shader Model 5.0 and cached to `.bin` files for faster loading.

### Shader Stage Properties

```ini
vs = shader.hlsl          ; Vertex Shader
hs = shader.hlsl          ; Hull Shader (tessellation)
ds = shader.hlsl          ; Domain Shader (tessellation)
gs = shader.hlsl          ; Geometry Shader
ps = shader.hlsl          ; Pixel Shader
cs = shader.hlsl          ; Compute Shader
```

**File Paths:**
- Relative to 3dmigoto installation directory
- Relative to namespace path (if in namespaced section)
- Use forward slashes: `shaders/blur.hlsl`

**Special Value:**
```ini
ps = null                 ; Unbinds pixel shader instead of setting one
```

### Compilation Flags

Control shader compilation with the `flags` property:

```ini
flags = optimization_level3 | debug | pack_matrix_row_major
```

**Available Flags:**
- `debug` - Enable debug information
- `skip_validation` - Skip shader validation
- `skip_optimization` - Disable all optimization
- `pack_matrix_row_major` - Pack matrices in row-major order (default)
- `pack_matrix_column_major` - Pack matrices in column-major order
- `partial_precision` - Allow partial precision
- `avoid_flow_control` - Minimize branching
- `prefer_flow_control` - Prefer branching over math
- `enable_strictness` - Enable strict compilation
- `ieee_strictness` - IEEE strict floating point
- `optimization_level0` - No optimization
- `optimization_level1` - Basic optimization (default)
- `optimization_level2` - Medium optimization
- `optimization_level3` - Maximum optimization
- `warnings_are_errors` - Treat warnings as compilation errors

**Combining Flags:**
Use `|` to combine multiple flags:
```ini
flags = optimization_level3 | ieee_strictness
```

### Preprocessor Macros

Each shader type automatically gets a preprocessor macro defined:

| Shader | Macro |
|--------|-------|
| vs | `VERTEX_SHADER` |
| hs | `HULL_SHADER` |
| ds | `DOMAIN_SHADER` |
| gs | `GEOMETRY_SHADER` |
| ps | `PIXEL_SHADER` |
| cs | `COMPUTE_SHADER` |

**Example Usage:**
```hlsl
#ifdef PIXEL_SHADER
float4 main() : SV_Target {
    return float4(1, 0, 0, 1);
}
#endif

#ifdef VERTEX_SHADER
void main(uint id : SV_VertexID, out float4 pos : SV_Position) {
    // Vertex shader code
}
#endif
```

---

## Blend State

Control color blending for each render target. Blend states determine how pixel shader output combines with existing render target values.

### Per-Render-Target Blend

```ini
; Apply to all render targets (no index)
blend = <BlendOp> <SrcBlend> <DestBlend>
alpha = <AlphaOp> <SrcBlendAlpha> <DestBlendAlpha>
mask = 0xf

; Per-render-target configuration (index 0-7)
blend[0] = ADD SRC_ALPHA INV_SRC_ALPHA
alpha[0] = ADD ONE ZERO
mask[0] = 0x7              ; RGB only (no alpha channel)

; Disable blending entirely
blend = disable
```

### Blend Operations

Determines how source and destination are combined:

| Operation | Description |
|-----------|-------------|
| `ADD` | Source + Destination |
| `SUBTRACT` | Source - Destination |
| `REV_SUBTRACT` | Destination - Source |
| `MIN` | min(Source, Destination) |
| `MAX` | max(Source, Destination) |

### Blend Factors

Control how source and destination are weighted:

| Factor | Value |
|--------|-------|
| `ZERO` | (0, 0, 0, 0) |
| `ONE` | (1, 1, 1, 1) |
| `SRC_COLOR` | Source RGB |
| `INV_SRC_COLOR` | 1 - Source RGB |
| `SRC_ALPHA` | Source Alpha |
| `INV_SRC_ALPHA` | 1 - Source Alpha |
| `DEST_ALPHA` | Destination Alpha |
| `INV_DEST_ALPHA` | 1 - Destination Alpha |
| `DEST_COLOR` | Destination RGB |
| `INV_DEST_COLOR` | 1 - Destination RGB |
| `SRC_ALPHA_SAT` | Saturate(Source Alpha) |
| `BLEND_FACTOR` | Constant blend factor |
| `INV_BLEND_FACTOR` | 1 - Constant blend factor |
| `SRC1_COLOR` | Secondary source RGB (dual-source blending) |
| `INV_SRC1_COLOR` | 1 - Secondary source RGB |
| `SRC1_ALPHA` | Secondary source Alpha |
| `INV_SRC1_ALPHA` | 1 - Secondary source Alpha |

### Global Blend Properties

```ini
alpha_to_coverage = true           ; Alpha-to-coverage for MSAA
blend_factor[0] = 1.0              ; Constant blend factor R
blend_factor[1] = 1.0              ; Constant blend factor G
blend_factor[2] = 1.0              ; Constant blend factor B
blend_factor[3] = 1.0              ; Constant blend factor A
sample_mask = 0xffffffff           ; MSAA sample mask
blend_state_merge = true           ; Merge with current state
```

### Render Target Write Mask

Control which color channels are written (RGBA = 0xf):

```ini
mask = 0xf      ; RGBA (all channels) = 1111
mask = 0x7      ; RGB only            = 0111
mask = 0x8      ; Alpha only          = 1000
mask = 0x3      ; RG only             = 0011
mask = 0x0      ; None (no writes)    = 0000
```

### Blend State Merging

When `blend_state_merge = true`, only specified properties are changed:

```ini
[CustomShaderPartialBlend]
; Only modify render target 0 blending, keep everything else
blend_state_merge = true
blend[0] = ADD SRC_ALPHA INV_SRC_ALPHA
```

Without merging, the entire blend state is replaced.

### Blend Examples

**Alpha Blending (Standard Transparency):**
```ini
blend = ADD SRC_ALPHA INV_SRC_ALPHA
alpha = ADD ONE ZERO
```

**Additive Blending (Glow Effects):**
```ini
blend = ADD ONE ONE
alpha = ADD ONE ONE
```

**Multiplicative Blending (Shadows/Darkening):**
```ini
blend = ADD ZERO SRC_COLOR
alpha = ADD ZERO ONE
```

**Premultiplied Alpha:**
```ini
blend = ADD ONE INV_SRC_ALPHA
alpha = ADD ONE INV_SRC_ALPHA
```

**Dual-Source Blending:**
```ini
blend = ADD SRC_COLOR SRC1_COLOR
alpha = ADD SRC_ALPHA SRC1_ALPHA
```

**Source:** `IniHandler.cpp:3405-3470`, `CommandList.cpp:1999-2040`

---

## Depth Stencil State

Configure depth testing, depth writing, and stencil operations.

### Depth Properties

```ini
depth_enable = true                    ; Enable depth testing
depth_write_mask = ALL                 ; Enable depth writes
depth_func = LESS                      ; Depth comparison function
```

**Depth Write Masks:**
- `ZERO` - Disable depth writes (read-only depth buffer)
- `ALL` - Enable depth writes

**Depth Comparison Functions:**
- `NEVER` - Always fail (discard all pixels)
- `LESS` - Pass if `source < destination` (default, standard depth test)
- `EQUAL` - Pass if `source == destination`
- `LESS_EQUAL` - Pass if `source <= destination`
- `GREATER` - Pass if `source > destination` (reverse depth)
- `NOT_EQUAL` - Pass if `source != destination`
- `GREATER_EQUAL` - Pass if `source >= destination`
- `ALWAYS` - Always pass (disable depth test)

### Stencil Properties

```ini
stencil_enable = true                  ; Enable stencil testing
stencil_read_mask = 0xff               ; Stencil read mask (bitwise AND)
stencil_write_mask = 0xff              ; Stencil write mask (bitwise AND)
stencil_ref = 0                        ; Stencil reference value
```

### Stencil Operations

Control front and back face stencil behavior:

```ini
stencil_front = <CompFunc> <PassOp> <DepthFailOp> <StencilFailOp>
stencil_back = <CompFunc> <PassOp> <DepthFailOp> <StencilFailOp>
```

**Parameters:**
- `CompFunc` - Comparison function (NEVER, LESS, EQUAL, etc.)
- `PassOp` - Operation when both depth and stencil pass
- `DepthFailOp` - Operation when stencil passes but depth fails
- `StencilFailOp` - Operation when stencil test fails

**Stencil Operations:**
- `KEEP` - Keep existing stencil value
- `ZERO` - Set stencil to 0
- `REPLACE` - Replace with stencil reference value
- `INCR_SAT` - Increment and clamp to maximum
- `DECR_SAT` - Decrement and clamp to zero
- `INVERT` - Bitwise invert stencil value
- `INCR` - Increment with wrap around
- `DECR` - Decrement with wrap around

### Depth Stencil State Merging

```ini
depth_stencil_state_merge = true       ; Merge with current state
```

When enabled, only specified properties are modified.

### Depth Stencil Examples

**Disable Depth Testing:**
```ini
depth_enable = false
depth_write_mask = ZERO
```

**Read-Only Depth (No Writes):**
```ini
depth_enable = true
depth_write_mask = ZERO
depth_func = LESS
```

**Reverse Depth (Far to Near):**
```ini
depth_enable = true
depth_write_mask = ALL
depth_func = GREATER
```

**Stencil Masking (Write 1, Read Where 1):**
```ini
stencil_enable = true
stencil_ref = 1
stencil_write_mask = 0xff
stencil_read_mask = 0xff
stencil_front = EQUAL KEEP KEEP KEEP
stencil_back = EQUAL KEEP KEEP KEEP
```

**Stencil Shadow Volumes:**
```ini
stencil_enable = true
stencil_ref = 0
stencil_front = ALWAYS KEEP INCR KEEP    ; Increment on front faces
stencil_back = ALWAYS KEEP DECR KEEP     ; Decrement on back faces
```

**Source:** `IniHandler.cpp:3545-3624`, `CommandList.cpp:2042-2079`

---

## Rasterizer State

Control triangle rasterization, culling, and depth bias.

### Rasterizer Properties

```ini
fill = SOLID                           ; Fill mode
cull = BACK                            ; Cull mode
front = CounterClockwise               ; Front face winding
depth_bias = 0                         ; Integer depth bias
depth_bias_clamp = 0.0                 ; Maximum depth bias
slope_scaled_depth_bias = 0.0          ; Slope-scaled depth bias
depth_clip_enable = true               ; Enable depth clipping
scissor_enable = false                 ; Enable scissor testing
multisample_enable = false             ; Enable MSAA
antialiased_line_enable = false        ; Enable line AA
rasterizer_state_merge = true          ; Merge with current state
```

### Fill Modes

| Mode | Description |
|------|-------------|
| `WIREFRAME` | Draw as wireframe (edges only) |
| `SOLID` | Draw filled polygons (default) |

### Cull Modes

| Mode | Description |
|------|-------------|
| `NONE` | No culling (draw all faces) |
| `FRONT` | Cull front-facing triangles |
| `BACK` | Cull back-facing triangles (default) |

### Front Face Winding

| Direction | Description |
|-----------|-------------|
| `Clockwise` | Clockwise vertices are front-facing |
| `CounterClockwise` | Counter-clockwise vertices are front-facing (default) |

### Depth Bias

Depth bias offsets depth values to prevent z-fighting. The formula is:

```
bias = (slope * slope_scaled_depth_bias) + clamp(depth_bias * r, -depth_bias_clamp, depth_bias_clamp)
```

Where `r` is the minimum representable value in the depth buffer format.

**Common Uses:**
- **Shadow Mapping:** `depth_bias = 100, slope_scaled_depth_bias = 2.0`
- **Decals:** `depth_bias = -100` (pull toward camera)
- **Outlines:** `depth_bias = 1000` (push away from camera)

### Rasterizer Examples

**Wireframe Rendering:**
```ini
fill = WIREFRAME
cull = NONE
```

**Two-Sided Rendering:**
```ini
cull = NONE
```

**Shadow Mapping Bias:**
```ini
depth_bias = 1000
depth_bias_clamp = 0.01
slope_scaled_depth_bias = 2.0
```

**Scissor Rect Testing:**
```ini
scissor_enable = true
```

**Source:** `IniHandler.cpp:3648-3721`, `CommandList.cpp:2081-2113`

---

## Topology

Set the primitive topology for drawing.

```ini
topology = TRIANGLE_LIST
```

### Available Topologies

**Point Topologies:**
- `POINT_LIST` - List of points

**Line Topologies:**
- `LINE_LIST` - List of line segments (2 vertices per line)
- `LINE_STRIP` - Connected line strip
- `LINE_LIST_ADJ` - Line list with adjacency
- `LINE_STRIP_ADJ` - Line strip with adjacency

**Triangle Topologies:**
- `TRIANGLE_LIST` - List of triangles (3 vertices per triangle)
- `TRIANGLE_STRIP` - Connected triangle strip
- `TRIANGLE_LIST_ADJ` - Triangle list with adjacency
- `TRIANGLE_STRIP_ADJ` - Triangle strip with adjacency

**Patch Topologies (Tessellation):**
- `1_CONTROL_POINT_PATCH_LIST` through `32_CONTROL_POINT_PATCH_LIST`

**Note:** The `D3D11_PRIMITIVE_TOPOLOGY_` prefix is optional.

### Topology Examples

**Fullscreen Triangle:**
```ini
topology = TRIANGLE_LIST
draw = 3, 0
```

**Fullscreen Quad:**
```ini
topology = TRIANGLE_STRIP
draw = 4, 0
```

**Point Cloud:**
```ini
topology = POINT_LIST
draw = 1000, 0
```

**Tessellation:**
```ini
topology = 3_CONTROL_POINT_PATCH_LIST
hs = hull_shader.hlsl
ds = domain_shader.hlsl
draw = 300, 0
```

**Source:** `IniHandler.cpp:3773-3801`

---

## Execution Control

### max_executions_per_frame

Limit how many times a CustomShader can execute per frame:

```ini
max_executions_per_frame = 1           ; Execute once per frame (0 = unlimited)
```

**Use Cases:**
- **One-Time Initialization:** `max_executions_per_frame = 1` in first frame only
- **Performance Limiting:** Prevent expensive shaders from running too often
- **Rate Limiting:** Control frequency of compute operations

**Behavior:**
- Counter resets each frame
- When limit is exceeded, CustomShader is skipped
- Value of 0 means unlimited executions (default)

**Example:**
```ini
[CustomShaderInitialize]
max_executions_per_frame = 1
; This runs only once per frame, even if called multiple times
cs = initialize.hlsl
dispatch = 1, 1, 1
```

**Source:** `IniHandler.cpp:3870-3873`, `CommandList.cpp:2149-2161`

---

## Resource Binding

CustomShader sections support full resource binding using command list syntax.

### Shader Resource Views (Textures)

```ini
vs-t0 = ResourceTexture       ; Vertex shader texture slot 0
hs-t1 = ResourceNormalMap     ; Hull shader texture slot 1
ds-t2 = ResourceHeightMap     ; Domain shader texture slot 2
gs-t3 = ResourceCubeMap       ; Geometry shader texture slot 3
ps-t4 = ResourceDiffuse       ; Pixel shader texture slot 4
cs-t5 = ResourceInput         ; Compute shader texture slot 5
```

### Constant Buffers

```ini
vs-cb0 = ResourceVSConstants
ps-cb1 = ResourcePSConstants
cs-cb2 = ResourceComputeParams
```

### Unordered Access Views (UAVs)

```ini
cs-u0 = ResourceOutputBuffer
cs-u1 = ResourceRWTexture
ps-u0 = ResourcePixelUAV      ; Pixel shader UAV (if supported)
```

### Vertex and Index Buffers

```ini
vb0 = ResourceVertexBuffer
vb1 = ResourceInstanceBuffer
ib = ResourceIndexBuffer
```

### Render Targets

```ini
o0 = ResourceRenderTarget     ; Render target 0
o1 = ResourceSecondRT         ; Render target 1
oD = ResourceDepthStencil     ; Depth stencil target
```

### Samplers

```ini
vs-s0 = point_filter
ps-s0 = linear_filter
ps-s1 = anisotropic_filter
```

### Resource Modifiers

All [resource modifiers](/modifiers.md) work in CustomShader sections:

```ini
ps-t0 = copy ResourceBackup         ; Copy resource
ps-t1 = ref ResourceAlias           ; Reference resource
ps-t2 = unless_null copy ps-t0      ; Conditional copy
```

---

## Command Lists

CustomShader sections contain pre and post command lists.

### Pre-Command List (Default)

Commands without `pre`/`post` modifier execute before the draw/dispatch:

```ini
[CustomShaderExample]
; Pre-command list (setup)
ps-t0 = ResourceInput
ps-cb0 = ResourceParams
o0 = ResourceOutput

; Draw/dispatch
draw = 4, 0
```

### Post-Command List

Commands with `post` modifier execute after the draw/dispatch:

```ini
[CustomShaderCleanup]
; Draw first
draw = 4, 0

; Post-command list (cleanup)
post ps-t0 = null
post o0 = null
```

### Available Commands

All standard [CommandList](/command-list.md) commands are available:

- **Resource Operations:** Resource assignment, copy, reference, clear
- **Draw Commands:** draw, drawindexed, drawinstanced, etc.
- **Dispatch Commands:** dispatch, dispatchindirect
- **Control Flow:** if, else if, else, endif
- **Variables:** Assignment and expressions
- **Nested Execution:** run, checktextureoverride
- **Special Commands:** handling, preset, etc.

---

## Complete Examples

### Gaussian Blur Post-Process

```ini
[CustomShaderGaussianBlur]
; Shaders
vs = fullscreen_vs.hlsl
ps = gaussian_blur_ps.hlsl

; Compilation
flags = optimization_level3

; Disable depth testing
depth_enable = false
depth_write_mask = ZERO

; Alpha blending for overlay
blend = ADD SRC_ALPHA INV_SRC_ALPHA
alpha = ADD ONE ZERO

; Solid fill, no culling
fill = SOLID
cull = NONE

; Fullscreen triangle
topology = TRIANGLE_LIST

; Bind resources
ps-t0 = ResourceSceneColor
ps-cb0 = ResourceBlurParams
o0 = ResourceBlurOutput

; Draw fullscreen
draw = 3, 0

; Cleanup
post ps-t0 = null
post o0 = null
```

### Compute Shader Particle Simulation

```ini
[CustomShaderParticleUpdate]
; Compute shader
cs = particle_update.hlsl

; Compilation with debug info
flags = debug | optimization_level2

; Limit to once per frame
max_executions_per_frame = 1

; Bind UAVs and constants
cs-u0 = ResourceParticleBuffer
cs-u1 = ResourceVelocityBuffer
cs-cb0 = ResourceSimulationParams

; Dispatch 1024 particles (64 threads per group)
dispatch = $particle_count // 64, 1, 1

; Unbind UAVs
post cs-u0 = null
post cs-u1 = null
```

### Tessellation Example

```ini
[CustomShaderTessellation]
; Full tessellation pipeline
vs = terrain_vs.hlsl
hs = terrain_hs.hlsl
ds = terrain_ds.hlsl
ps = terrain_ps.hlsl

; Patch topology
topology = 3_CONTROL_POINT_PATCH_LIST

; Solid rendering with backface culling
fill = SOLID
cull = BACK
front = CounterClockwise

; Enable depth testing
depth_enable = true
depth_write_mask = ALL
depth_func = LESS

; Bind resources
vs-t0 = ResourceHeightMap
ds-t0 = ResourceHeightMap
ps-t0 = ResourceTerrainTexture
vs-cb0 = ResourceTessellationParams

; Draw patches
draw = 3000, 0

; Cleanup
post vs-t0 = null
post ps-t0 = null
```

### Shadow Mapping

```ini
[CustomShaderShadowMap]
; Shadow map generation
vs = shadow_vs.hlsl
ps = null                    ; No pixel shader needed

; Depth bias for shadows
depth_bias = 1000
depth_bias_clamp = 0.01
slope_scaled_depth_bias = 2.0

; Cull front faces (Peter Panning prevention)
cull = FRONT
fill = SOLID

; Depth testing
depth_enable = true
depth_write_mask = ALL
depth_func = LESS

; No color output, only depth
blend = disable

; Bind depth target
oD = ResourceShadowDepth

; Draw shadow casters
draw = from_caller

; Cleanup
post oD = null
```

### Multi-Pass Effect with State Merging

```ini
[CustomShaderMultiPass]
vs = fullscreen_vs.hlsl
ps = multipass_ps.hlsl

; Only modify blend state, keep depth/rasterizer unchanged
blend_state_merge = true
blend[0] = ADD SRC_ALPHA INV_SRC_ALPHA

; Pass 1: Horizontal blur
ps-cb0 = ResourceHorizontalParams
ps-t0 = ResourceInput
o0 = ResourceTemp
draw = 4, 0

; Pass 2: Vertical blur
ps-cb0 = ResourceVerticalParams
ps-t0 = ResourceTemp
o0 = ResourceOutput
draw = 4, 0

; Cleanup
post ps-t0 = null
post o0 = null
```

---

## Invocation

Run CustomShader sections using the `run` command:

### From Present

```ini
[Present]
run = CustomShaderPostProcess
```

### From ShaderOverride

```ini
[ShaderOverrideCharacter]
hash = abcd1234
run = CustomShaderOutline
draw = from_caller
```

### From TextureOverride

```ini
[TextureOverrideUI]
hash = def45678
run = CustomShaderUIBlur
```

### From Key Binding

```ini
[KeyToggleEffect]
key = VK_F1
run = CustomShaderToggleEffect
```

### Nested Invocation

```ini
[CustomShaderMain]
run = CustomShaderPass1
run = CustomShaderPass2
run = CustomShaderPass3
```

---

## State Management

### State Save and Restore

3dmigoto automatically saves and restores pipeline state around CustomShader execution:

**Saved State:**
- All shader bindings (VS, HS, DS, GS, PS, CS)
- Blend state
- Depth/stencil state
- Rasterizer state
- Topology
- Viewports
- Render targets and depth stencil
- Samplers

**Execution Flow:**
1. Save current pipeline state
2. Apply CustomShader shaders
3. Apply CustomShader render states (with optional merging)
4. Execute pre-command list
5. Execute post-command list
6. Restore original pipeline state

### State Merging

State merging allows selective modification without full replacement:

```ini
blend_state_merge = true               ; Only modify specified blend properties
depth_stencil_state_merge = true       ; Only modify specified depth/stencil properties
rasterizer_state_merge = true          ; Only modify specified rasterizer properties
```

**Without Merging (Default):**
- Entire state object is replaced
- Unspecified properties use default values
- More predictable but less flexible

**With Merging:**
- Only specified properties are modified
- Unspecified properties keep current values
- More flexible but requires understanding current state

**Merging Algorithm:**
```cpp
// Bitwise merge: dest = (dest & ~mask) | (src & mask)
// mask bit = 0: keep destination
// mask bit = 1: use source
```

**Source:** `CommandList.cpp:1985-2113`

---

## Performance Considerations

1. **Shader Compilation:** Shaders are compiled on first use and cached. Use `optimization_level3` for best runtime performance.

2. **State Changes:** Minimize state changes. Group draw calls with similar states in the same CustomShader.

3. **Resource Binding:** Unbind resources in post-command list to avoid stale bindings.

4. **Execution Limits:** Use `max_executions_per_frame` to prevent expensive operations from running too often.

5. **State Merging:** Use state merging to avoid unnecessary state object creation.

6. **Shader Complexity:** Simpler shaders compile faster. Profile shader performance.

---

## Important Notes

1. **Shader Model:** All shaders compile to Shader Model 5.0 (`_5_0` target)

2. **File Caching:** Compiled shaders are cached to `.bin` files for faster subsequent loads

3. **Namespaces:** CustomShader sections support 3dmigoto's namespace system for organization

4. **State Defaults:** When states aren't specified:
   - **Blend:** Blending disabled, SRC=ONE, DEST=ZERO
   - **Depth:** Enabled, LESS comparison, writes enabled
   - **Rasterizer:** SOLID fill, BACK cull, counter-clockwise front

5. **Substantiation:** State objects are created on first use (lazy initialization)

6. **Resource Lifetime:** Resources must exist before CustomShader executes

7. **Expression Support:** All numeric properties support [expressions](/expressions.md)

8. **Command List Integration:** CustomShader sections are fully integrated with 3dmigoto's command list system

---

## Source Code References

All features documented here are verified against the 3dmigoto source code:

- **CustomShader Parsing:** `IniHandler.cpp:3861-3988`
- **Blend State Parsing:** `IniHandler.cpp:3405-3470`
- **Depth/Stencil Parsing:** `IniHandler.cpp:3545-3624`
- **Rasterizer Parsing:** `IniHandler.cpp:3648-3721`
- **Topology Parsing:** `IniHandler.cpp:3773-3801`
- **Sampler Parsing:** `IniHandler.cpp:3803-3856`
- **Execution:** `CommandList.cpp:2135-2304`
- **State Merging:** `CommandList.cpp:1985-2113`
- **Run Command:** `CommandList.cpp:585-615`
