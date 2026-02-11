# DirectX Pipeline

This page provides essential DirectX 11 background knowledge for understanding how 3dmigoto interacts with games. While 3dmigoto users don't need to be DirectX experts, understanding the pipeline helps with effective modding.

## Overview

DirectX 11 is a graphics API that allows applications (games) to communicate with the GPU. The graphics pipeline is the sequence of stages that transform 3D models into pixels on screen.

---

## Graphics Pipeline Stages

The DirectX 11 pipeline consists of both programmable (shader) stages and fixed-function stages:

```
Input Assembler (IA)
        ↓
Vertex Shader (VS) ← Programmable
        ↓
Hull Shader (HS) ← Programmable (tessellation)
        ↓
Tessellator ← Fixed-function
        ↓
Domain Shader (DS) ← Programmable (tessellation)
        ↓
Geometry Shader (GS) ← Programmable
        ↓
Rasterizer (RS) ← Fixed-function
        ↓
Pixel Shader (PS) ← Programmable
        ↓
Output Merger (OM) ← Fixed-function
        ↓
Render Target / Screen
```

Additionally, **Compute Shader (CS)** runs independently outside the graphics pipeline.

---

## Input Assembler (IA)

**Purpose:** Reads vertex and index data from buffers and assembles them into primitives (triangles, lines, points).

**Input:**
- Vertex buffers (VB) - vertex positions, normals, UVs, etc.
- Index buffers (IB) - indices into vertex buffer
- Primitive topology - how vertices connect (triangle list, strip, etc.)

**Output:** Assembled primitives sent to vertex shader

### 3dmigoto Interaction

```ini
[TextureOverride]
; Match by vertex buffer properties
match_vb0 = stride==32

[ShaderOverride...]
; Replace vertex buffer
vb0 = ResourceCustomVB

; Replace index buffer
ib = ResourceCustomIB
```

**Hunting:**
- Cycle through index buffers to find specific meshes
- Identify objects by vertex count or stride

---

## Vertex Shader (VS)

**Purpose:** Transform vertices from model space to screen space. Runs once per vertex.

**Input:**
- Vertex data (position, normal, UV, etc.)
- Constant buffers (matrices, material data)
- Textures (vertex textures, rare)

**Output:**
- Transformed position (SV_Position)
- Interpolated data for pixel shader (normals, UVs, colors)

**Typical Operations:**
- Model-View-Projection (MVP) transformation
- Skinning (bone animations)
- Normal transformation
- UV coordinate transformation

### 3dmigoto Interaction

```ini
[ShaderOverrideVS]
hash = 0123456789abcdef
; Replace vertex shader
vs = ReplacementVS.txt

; Modify constant buffers
vs-cb0[4] = 1.0

; Access from INI
if vs == 0x0123456789abcdef
    ; This vertex shader is active
endif
```

**Hunting:**
- Cycle through vertex shaders to find character models
- Identify shaders by vertex manipulation patterns

**Example Vertex Shader:**
```hlsl
float4x4 matWorldViewProj : register(c0);

struct VS_INPUT {
    float3 pos : POSITION;
    float3 normal : NORMAL;
    float2 uv : TEXCOORD0;
};

struct VS_OUTPUT {
    float4 pos : SV_Position;
    float3 normal : NORMAL;
    float2 uv : TEXCOORD0;
};

VS_OUTPUT main(VS_INPUT input) {
    VS_OUTPUT output;
    output.pos = mul(float4(input.pos, 1.0), matWorldViewProj);
    output.normal = input.normal;
    output.uv = input.uv;
    return output;
}
```

---

## Hull Shader (HS) & Domain Shader (DS)

**Purpose:** Tessellation - subdivide primitives into smaller triangles for more detail.

**Hull Shader:**
- Determines tessellation factors
- Outputs control points

**Domain Shader:**
- Evaluates subdivided positions
- Similar to vertex shader for tessellated vertices

**Usage:** High-detail terrain, displacement mapping, smooth surfaces

### 3dmigoto Interaction

```ini
[ShaderOverrideHS]
hash = hs_hash_here

[ShaderOverrideDS]
hash = ds_hash_here
```

**Note:** Tessellation shaders are less common in games than VS/PS.

---

## Geometry Shader (GS)

**Purpose:** Generate or discard geometry. Runs once per primitive, can output multiple primitives.

**Input:**
- Complete primitive (triangle, line, point)
- All vertices of primitive

**Output:**
- 0 or more primitives
- Can change topology

**Typical Uses:**
- Particle systems
- Point sprite expansion
- Shadow volume generation
- Single-pass cubemap rendering

### 3dmigoto Interaction

```ini
[ShaderOverrideGS]
hash = gs_hash_here
```

**Note:** Geometry shaders have performance implications and are used selectively.

---

## Rasterizer

**Purpose:** Convert primitives into pixels (fragments). Fixed-function stage.

**Operations:**
- Triangle setup
- Scan conversion
- Viewport transformation
- Scissor testing
- Culling (back-face, front-face)
- Depth clipping

**Configuration:**
- Cull mode (none, front, back)
- Fill mode (solid, wireframe)
- Depth bias
- Scissor rectangles

### 3dmigoto Interaction

```ini
[CustomShader...]
; Rasterizer state
cull = back
fill = solid
front = ccw
depth_clip_enable = true
scissor_enable = false
```

See [Custom Shader - Rasterizer State](./custom-shader.md#rasterizer-state) for details.

---

## Pixel Shader (PS)

**Purpose:** Calculate final color for each pixel. Runs once per pixel (fragment).

**Input:**
- Interpolated data from vertex shader
- Textures (most common)
- Constant buffers (material properties, light data)
- Pixel position (screen coordinates)

**Output:**
- Color values (one or more render targets)
- Depth value (optional)

**Typical Operations:**
- Texture sampling
- Lighting calculations (Phong, PBR)
- Normal mapping
- Shadows
- Fog
- Alpha transparency

### 3dmigoto Interaction

```ini
[ShaderOverridePS]
hash = fedcba9876543210
; Replace pixel shader
ps = ReplacementPS.txt

; Replace textures
ps-t0 = ResourceNewTexture

; Modify constants
ps-cb0[0] = 1.0, 0.0, 0.0, 1.0  ; Red color
```

**Hunting:**
- Most visible modding target
- Controls colors, textures, lighting
- Skip to hide objects

**Example Pixel Shader:**
```hlsl
Texture2D diffuseMap : register(t0);
SamplerState linearSampler : register(s0);

struct PS_INPUT {
    float4 pos : SV_Position;
    float2 uv : TEXCOORD0;
};

float4 main(PS_INPUT input) : SV_Target {
    float4 color = diffuseMap.Sample(linearSampler, input.uv);
    return color;
}
```

---

## Output Merger (OM)

**Purpose:** Combine pixel shader outputs with render targets using blending, depth testing, stencil testing.

**Operations:**
- Depth testing (Z-buffer)
- Stencil testing
- Blending (transparency)
- Write to render targets

**Configuration:**
- Depth/stencil state
- Blend state
- Render target write masks

### 3dmigoto Interaction

```ini
[CustomShader...]
; Depth/stencil state
depth_enable = true
depth_write_mask = all
depth_func = less_equal

; Blend state
blend = add src_alpha inv_src_alpha
alpha_to_coverage = false
```

See [Custom Shader - Depth/Stencil State](./custom-shader.md#depth-stencil-state) for details.

**Render Targets:**
```ini
[ShaderOverride...]
; Replace render target
o0 = ResourceCustomRT

; Multiple render targets (MRT)
o0 = ResourceColor
o1 = ResourceNormal
o2 = ResourceDepth
```

---

## Compute Shader (CS)

**Purpose:** General-purpose GPU computation. Runs independently of graphics pipeline.

**Characteristics:**
- Not part of graphics pipeline
- Can read and write buffers/textures
- Organized in thread groups
- Used for physics, post-processing, AI, etc.

**Input:**
- Buffers (SRV, UAV)
- Textures (SRV, UAV)
- Constant buffers

**Output:**
- Unordered Access Views (UAVs)

### 3dmigoto Interaction

```ini
[ShaderOverrideCS]
hash = cs_hash_here

; Replace compute shader
cs = CustomCompute.hlsl

; Bind UAVs
cs-u0 = ResourceOutputBuffer

[Present]
; Dispatch compute shader
dispatch = 16, 16, 1
```

**Example Compute Shader:**
```hlsl
RWTexture2D<float4> output : register(u0);

[numthreads(8, 8, 1)]
void main(uint3 threadID : SV_DispatchThreadID) {
    output[threadID.xy] = float4(1, 0, 0, 1);
}
```

---

## Resource Types

### Buffers

**Vertex Buffer:**
- Contains vertex data (positions, normals, UVs)
- Bound to Input Assembler
- Structure defined by vertex layout

**Index Buffer:**
- Contains indices into vertex buffer
- 16-bit or 32-bit integers
- Reduces memory by reusing vertices

**Constant Buffer:**
- Small, frequently updated data
- Shader parameters (matrices, material properties)
- Fast access from shaders

**Structured Buffer:**
- Arbitrary structure data
- Can be read/written by compute shaders
- Flexible storage

### Textures

**Texture1D/2D/3D:**
- Image data
- Mipmaps for level-of-detail
- Various formats (RGBA, BC compressed, depth)

**Texture Arrays:**
- Multiple textures in one resource
- Same size and format
- Efficient for texture atlases

**Cube Maps:**
- 6 textures forming cube faces
- Environment maps, reflections

### Views

Views define how resources are accessed:

**Shader Resource View (SRV):**
- Read-only from shaders
- Textures, buffers
- Register: t0, t1, t2...

**Render Target View (RTV):**
- Write target for pixel shader
- Color outputs
- Register: o0, o1, o2...

**Depth Stencil View (DSV):**
- Depth/stencil buffer
- Z-buffer for depth testing
- Register: oD

**Unordered Access View (UAV):**
- Read-write from shaders
- Compute shader outputs
- Register: u0, u1, u2...

### 3dmigoto Interaction

```ini
[Resource...]
; Define custom texture
type = Texture2D
width = 1024
height = 1024
format = R8G8B8A8_UNORM
bind_flags = shader_resource render_target

[ShaderOverride...]
; Bind as SRV
ps-t0 = ResourceCustom

; Bind as RTV
o0 = ResourceCustom

; Bind constant buffer
ps-cb0 = ResourceConstantData
```

---

## DXGI Formats

Formats define how data is stored in textures/buffers:

**Common Color Formats:**
- `R8G8B8A8_UNORM` - 8-bit per channel RGBA
- `R16G16B16A16_FLOAT` - HDR color
- `R32G32B32A32_FLOAT` - Full precision color
- `BC1_UNORM` - DXT1 compression
- `BC3_UNORM` - DXT5 compression (with alpha)
- `BC7_UNORM` - High quality compression

**Depth Formats:**
- `D24_UNORM_S8_UINT` - 24-bit depth, 8-bit stencil
- `D32_FLOAT` - 32-bit floating-point depth
- `R32_TYPELESS` - Typeless (can be reinterpreted)

See [Resource - Formats](./resource.md#formats) for complete list.

---

## Pipeline State Objects

### Blend State

Controls how pixel shader output blends with render target:

```ini
[CustomShader...]
blend = add src_alpha inv_src_alpha
```

**Common Blend Modes:**
- Opaque: `blend = off`
- Alpha blend: `blend = add src_alpha inv_src_alpha`
- Additive: `blend = add one one`
- Multiply: `blend = add dest_color zero`

### Depth/Stencil State

Controls depth testing and stencil operations:

```ini
[CustomShader...]
depth_enable = true
depth_write_mask = all
depth_func = less
```

### Rasterizer State

Controls triangle rasterization:

```ini
[CustomShader...]
cull = back
fill = solid
front = ccw
```

---

## Draw Calls

Commands that trigger rendering:

**Draw:**
- Non-indexed rendering
- Vertices read sequentially from buffer

**DrawIndexed:**
- Indexed rendering (most common)
- Uses index buffer to reference vertices

**DrawInstanced:**
- Render same geometry multiple times
- Instancing for performance

**DrawIndexedInstanced:**
- Indexed + instanced
- Very common for repeated objects

See [Draw Calls](./draw-calls.md) for complete reference.

### 3dmigoto Interaction

```ini
[ShaderOverride...]
; Override draw call parameters
draw = 100, 0
drawindexed = auto

; Use from_caller to preserve original
draw = from_caller
```

---

## Common Rendering Techniques

### Deferred Rendering

**G-Buffer Pass:**
1. Render geometry to multiple render targets (MRT)
   - RT0: Albedo/diffuse color
   - RT1: Normals
   - RT2: Position/depth
   - RT3: Material properties

2. Lighting Pass:
   - Read G-buffer textures
   - Calculate lighting per pixel
   - Combine results

**Advantages:**
- Many lights possible
- Decouples geometry from lighting

**3dmigoto Implications:**
- Multiple render targets to track
- G-buffer textures can be replaced
- Lighting shaders separate from geometry

### Forward Rendering

**Single Pass:**
- Geometry rendered with lighting calculated in pixel shader
- Each object rendered once per light (multi-pass)

**Advantages:**
- Simpler pipeline
- Better for transparency

**3dmigoto Implications:**
- Lighting in pixel shaders
- Easier to identify object shaders

### Post-Processing

**Screen-Space Effects:**
- Rendered after main scene
- Full-screen quad
- Reads previous render target as texture

**Common Effects:**
- Bloom, blur, depth of field
- Tone mapping, color grading
- Ambient occlusion
- Screen-space reflections

**3dmigoto Interaction:**
```ini
[ShaderOverridePostProcess]
hash = post_process_shader_hash
; Add custom post-processing
run = CustomShaderPost
```

---

## Shader Resource Binding

Registers specify where resources bind:

**Vertex Shader:**
- `vs-t0` - Texture register 0
- `vs-cb0` - Constant buffer 0
- `vs-s0` - Sampler register 0

**Pixel Shader:**
- `ps-t0` - Texture register 0 (most common)
- `ps-cb0` - Constant buffer 0
- `ps-s0` - Sampler register 0

**Compute Shader:**
- `cs-t0` - SRV register 0
- `cs-u0` - UAV register 0
- `cs-cb0` - Constant buffer 0

**Maximum Registers:**
- Textures (SRV): 128 (t0-t127)
- UAVs: 8 or 64 (u0-u7/u63)
- Constant buffers: 14 (cb0-cb13)
- Samplers: 16 (s0-s15)

---

## Performance Considerations

### Draw Call Overhead

**Problem:** Each draw call has CPU overhead

**Solutions:**
- Instancing (DrawInstanced)
- Batching (combine meshes)
- Indirect drawing

### State Changes

**Problem:** Changing pipeline state is expensive

**Solutions:**
- Group objects by state
- Minimize shader switches
- Reuse pipeline state objects

### Texture Sampling

**Problem:** Texture reads have latency

**Solutions:**
- Use mipmaps
- Compress textures
- Minimize texture switches

---

## Debugging Techniques

### Render Target Inspection

```ini
; Capture intermediate render targets
[TextureOverrideRT]
hash = rt_hash
; Dump to file during frame analysis
```

### Shader Isolation

```ini
[ShaderOverride...]
; Skip shader to see effect
handling = skip

; Replace with simple color
ps = DebugColorPS.hlsl
```

### Resource Tracking

Frame analysis shows complete resource flow:
```
000042 PS-T0: hash=12345678  ← Track texture usage
000042 OM-RT0: hash=87654321 ← Track render target
```

---

## See Also

- [Resource](./resource.md) - Resource types and formats
- [Custom Shader](./custom-shader.md) - Pipeline state configuration
- [Draw Calls](./draw-calls.md) - Draw command reference
- [ShaderOverride](./override.md#shader-override) - Shader interception
- [TextureOverride](./override.md#texture-override) - Texture replacement
- [Frame Analysis](./debugging.md#frame-analysis) - Pipeline inspection
- [Glossary](./glossary.md) - DirectX terminology
