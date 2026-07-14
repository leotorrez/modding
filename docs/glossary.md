# Glossary

This glossary defines common terms, concepts, and terminology used throughout 3dmigoto documentation.

---

## A

### Auto
Special value for draw commands that automatically calculates vertex or index counts from currently bound buffers. See [Draw Commands](/draw-calls.md#auto).

---

## B

### Base Vertex
An integer offset added to each index before reading from the vertex buffer. Can be negative. Used in indexed draw calls.

### Bind Slot
A numbered location in the graphics pipeline where resources are bound. Examples: `ps-t0` (pixel shader texture slot 0), `vs-cb1` (vertex shader constant buffer slot 1).

### Blend State
DirectX render state controlling how pixel shader output combines with existing render target values. See [CustomShader Blend State](/custom-shader.md#blend-state).

### Buffer
A DirectX resource containing unstructured or structured data. Can be vertex buffers (VB), index buffers (IB), constant buffers (CB), or structured buffers.

---

## C

### Constant Buffer (CB)
A buffer resource containing shader constants. Bound to shader stages using `vs-cb#`, `ps-cb#`, etc.

### CommandList
A section containing a sequence of commands to execute. Invoked using `run = CommandListName`. See [CommandList](/command-list.md).

### Compute Shader (CS)
A shader that runs on compute units, not tied to the rendering pipeline. Used for GPU computation tasks.

### Convergence
In stereo 3D rendering, the point where left and right eye images converge, creating the perception of depth.

### Copy
Resource modifier that performs a full resource copy using DirectX `CopyResource()`. See [Modifiers](/modifiers.md#copy).

### Cull Mode
Rasterizer state determining which triangle faces are not drawn (NONE, FRONT, BACK).

### CustomShader
A section defining a custom shader pipeline with full control over shaders and render states. See [CustomShader](/custom-shader.md).

---

## D

### Depth Buffer
A texture storing per-pixel depth values, used for depth testing and occlusion.

### Depth Stencil State
DirectX render state controlling depth testing, depth writing, and stencil operations. See [CustomShader Depth/Stencil](/custom-shader.md#depth-stencil-state).

### Dispatch
Command to execute a compute shader with specified thread group counts. See [Dispatch Commands](/draw-calls.md#compute-shader-commands).

### Domain Shader (DS)
Tessellation shader stage that processes vertices after the tessellator. Runs once per tessellated vertex.

### Draw Call
A command that renders geometry. Can be indexed or non-indexed, instanced or non-instanced.

### DXGI Format
DirectX Graphics Infrastructure format specifying pixel/vertex data layout. Examples: `R8G8B8A8_UNORM`, `R32_FLOAT`.

---

## E

### Expression
A mathematical or logical calculation used in INI files. Supports arithmetic, comparison, and logical operators. See [Expressions](/expressions.md).

---

## F

### Fill Mode
Rasterizer state determining how triangles are rendered (SOLID or WIREFRAME).

### Frame Analysis
3dmigoto feature that dumps all draw calls, textures, and buffers from a frame for analysis.

### from_caller
Special draw command value that replays the exact draw call that triggered the current command list. See [Draw Commands](/draw-calls.md#from_caller).

---

## G

### Geometry Shader (GS)
Optional shader stage that processes entire primitives (points, lines, triangles) and can generate new geometry.

---

## H

### Hash
A unique identifier for a shader or texture, typically a CRC32 checksum. Used to identify and override specific shaders or textures.

### Handling
Property controlling what happens to the original draw call: `skip` (don't execute), `abort` (stop command list).

### Hull Shader (HS)
Tessellation shader stage that defines tessellation factors and control point processing.

### Hunting
The process of identifying shaders or textures by toggling their visibility in real-time using keyboard shortcuts.

---

## I

### Index Buffer (IB)
A buffer containing indices that reference vertices in the vertex buffer. Used for indexed rendering.

### Indirect Draw
A draw call where parameters are read from a GPU buffer instead of being specified directly.

### IniParams
Array of parameters accessible as `x0-x99`, `y0-y99`, `z0-z99`, `w0-w99`. Used for passing data to shaders and command lists.

### Instance
A copy of geometry rendered multiple times with different per-instance data. Used in instanced rendering.

---

## K

### Key Binding
Configuration that executes commands when a specific key is pressed. Defined in `[Key*]` sections. See [Key Bindings](/key.md).

---

## M

### Modifier
A keyword that changes command behavior: `pre`, `post`, `copy`, `ref`, `unless_null`, `from_caller`, `auto`. See [Modifiers](/modifiers.md).

### MSAA (Multi-Sample Anti-Aliasing)
A technique that renders at higher resolution and downsamples to reduce aliasing artifacts.

---

## N

### Namespace
A scope for organizing resources and command lists between mods, allowing variable and CommandList access across namespaces. See [Namespace](/namespace.md).

---

## O

### Override
A section that intercepts and modifies shader or texture behavior. Types: ShaderOverride, TextureOverride. See [Override](/override.md).

---

## P

### Pixel Shader (PS)
Shader that runs once per pixel, computing the final color output.

### Post
Modifier indicating a command executes after the Present() API call, at the start of Frame N+1. See [Modifiers](/modifiers.md#post).

### Pre
Modifier indicating a command executes before the Present() API call, at the end of Frame N. See [Modifiers](/modifiers.md#pre).

### Present
DirectX API call that swaps backbuffer to screen. The `[Present]` section executes every frame. See [Present](/present.md).

### Preset
A set of convergence/separation/parameter values that can be activated together.

### Primitive Topology
The arrangement of vertices into primitives: points, lines, triangles, or patches. See [Topology](/custom-shader.md#topology).

---

## R

### Rasterizer State
DirectX render state controlling triangle rasterization: fill mode, cull mode, depth bias, scissor testing. See [CustomShader Rasterizer State](/custom-shader.md#rasterizer-state).

### Reference (ref)
Resource modifier that creates a pointer to a resource instead of copying it. See [Modifiers](/modifiers.md#ref--reference).

### Render Target
A texture that receives pixel shader output. Bound using `o0`, `o1`, etc.

### Resource
A DirectX object containing data: textures, buffers, render targets. Defined in `[Resource*]` sections. See [Resource](/resource.md).

---

## S

### Sampler
An object controlling how textures are filtered and addressed when sampled in shaders.

### Separation
In stereo 3D rendering, the distance between the left and right eye cameras, creating depth perception.

### Shader
A program that runs on the GPU. Types: Vertex (VS), Hull (HS), Domain (DS), Geometry (GS), Pixel (PS), Compute (CS).

### ShaderOverride
A section that intercepts shaders by hash and modifies behavior. See [Override](/override.md).

### Shader Resource View (SRV)
A view of a resource for reading in shaders. Bound to texture slots: `vs-t#`, `ps-t#`, etc.

### Stencil Buffer
An 8-bit integer buffer used for stencil testing, often for masking or shadow volumes.

### Structured Buffer
A buffer containing structured data with a defined stride. Accessible in shaders.

---

## T

### Tessellation
Process of subdividing primitives into smaller primitives on the GPU using Hull, Tessellator, and Domain shader stages.

### Texture
A multi-dimensional resource containing image data. Can be 1D, 2D, 3D, cube maps, or arrays.

### TextureOverride
A section that intercepts textures by hash and modifies behavior. See [Override](/override.md).

### Thread Group
In compute shaders, a group of threads that execute together and can share memory.

### Topology
See [Primitive Topology](#primitive-topology).

---

## U

### UAV (Unordered Access View)
A view of a resource for read-write access in shaders. Bound to UAV slots: `cs-u#`, `ps-u#`.

### unless_null
Resource modifier that only performs an operation if the source resource is not NULL. See [Modifiers](/modifiers.md#unless_null).

---

## V

### Variable
User-defined value starting with `$` that can be used in expressions and conditions. Example: `$my_var = 10`.

### Vertex Buffer (VB)
A buffer containing vertex data (position, normal, UV coordinates, etc.). Bound using `vb0`, `vb1`, etc.

### Vertex Shader (VS)
Shader that runs once per vertex, transforming vertex positions and passing data to subsequent stages.

### Viewport
A rectangular region of the render target where rendering occurs.

---

## W

### Write Mask
A bitmask controlling which color channels (RGBA) are written to a render target.

---

## Acronyms

| Acronym | Full Name | Description |
|---------|-----------|-------------|
| CB | Constant Buffer | Shader constant data buffer |
| CS | Compute Shader | GPU compute program |
| DS | Domain Shader | Tessellation output shader |
| DXGI | DirectX Graphics Infrastructure | DirectX graphics API |
| GS | Geometry Shader | Primitive processing shader |
| HS | Hull Shader | Tessellation control shader |
| IB | Index Buffer | Buffer of vertex indices |
| MSAA | Multi-Sample Anti-Aliasing | Anti-aliasing technique |
| PS | Pixel Shader | Per-pixel color shader |
| SRV | Shader Resource View | Read-only shader resource |
| UAV | Unordered Access View | Read-write shader resource |
| VB | Vertex Buffer | Buffer of vertex data |
| VS | Vertex Shader | Per-vertex transformation shader |

---

## DirectX Terms

### Back Buffer
The off-screen render target that becomes visible after Present() is called.

### Binding
The act of associating a resource with a pipeline slot so shaders can access it.

### Pipeline
The sequence of stages that process rendering: Input Assembly → Vertex Shader → Hull Shader → Tessellator → Domain Shader → Geometry Shader → Rasterizer → Pixel Shader → Output Merger.

### Staging Resource
A CPU-accessible resource used for transferring data between CPU and GPU.

### Swap Chain
A collection of buffers used for displaying rendered images to the screen.

---

## 3dmigoto Specific Terms

### d3dx.ini
The main configuration file for 3dmigoto, located in the game's directory.

### ShaderFixes
Directory containing replacement shaders (`.txt` files compiled at runtime).

### ShaderCache
Directory where 3dmigoto caches compiled shaders (`.bin` files) for faster loading.

### Hunting Keys
Keyboard shortcuts used during hunting to identify shaders and textures.

### Frame Analysis Dump
Output from frame analysis containing all draw calls, shaders, textures, and buffers from a single frame.

---
