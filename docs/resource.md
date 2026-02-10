# Resource

Resource sections define custom resources that can be used throughout your INI files. Resources can be textures, buffers, or other DirectX resources that are created dynamically or loaded from files. They are referenced by name in [CommandLists](/docs/command-list.md), [ShaderOverrides](/docs/shader-override.md), and other sections.

## Overview

Resources are defined with sections named `[Resource*]` where `*` can be any identifier:

```ini
[ResourceCustomTexture]
type = Texture2D
width = 1920
height = 1080
format = R8G8B8A8_UNORM

[ResourceDepthBackup]
type = Texture2D
width = res_width
height = res_height
format = R32_FLOAT

[ResourceVertexBuffer]
type = Buffer
stride = 32
filename = CustomModel.buf
```

Resources are created on-demand when first referenced (resource substantiation). Empty Resource sections are valid and act as resource declarations.

## Resource Types

The `type` property specifies what kind of resource to create.

### Texture Types

| Type              | Description                           | Example Use Case           |
|-------------------|---------------------------------------|----------------------------|
| `Texture1D`       | 1D texture                            | Lookup tables, gradients   |
| `Texture2D`       | 2D texture (most common)              | Images, render targets     |
| `Texture3D`       | 3D volume texture                     | Volumetric data            |
| `Texture2DMS`     | 2D multisampled texture               | MSAA render targets        |
| `Cube`            | Cube map texture                      | Environment maps           |
| `Texture1DArray`  | Array of 1D textures                  | Multiple lookup tables     |
| `Texture2DArray`  | Array of 2D textures                  | Texture atlases            |
| `Texture2DMSArray`| Array of 2D multisampled textures     | MSAA texture arrays        |
| `CubeArray`       | Array of cube maps                    | Multiple environment maps  |

```ini
[ResourceEnvironmentMap]
type = Cube
width = 512
height = 512
format = R16G16B16A16_FLOAT

[ResourceTextureArray]
type = Texture2DArray
width = 1024
height = 1024
array = 16
format = R8G8B8A8_UNORM
```

### Buffer Types

| Type               | Description                        | Example Use Case              |
|--------------------|------------------------------------|-------------------------------|
| `Buffer`           | Generic buffer                     | Vertex/index buffers          |
| `StructuredBuffer` | Structured buffer with stride      | Per-instance data             |
| `RawBuffer`        | Raw byte buffer                    | Generic data storage          |

```ini
[ResourceVertexData]
type = Buffer
stride = 32
byte_width = 10240

[ResourceInstanceData]
type = StructuredBuffer
stride = 64
byte_width = 4096
```

## Dimension Properties

Specify the size and structure of the resource.

### width

Width of the texture or number of elements in 1D texture:

```ini
[ResourceTexture]
type = Texture2D
width = 1920

; Can use expressions
width = res_width
width = rt_width * 2
```

### height

Height of the texture (Texture2D, Texture3D, Cube, etc.):

```ini
[ResourceTexture]
type = Texture2D
height = 1080

; Dynamic sizing
height = res_height
```

### depth

Depth of 3D texture (Texture3D only):

```ini
[ResourceVolume]
type = Texture3D
width = 256
height = 256
depth = 256
```

### array

Number of array slices (for array texture types):

```ini
[ResourceTextureArray]
type = Texture2DArray
width = 1024
height = 1024
array = 10
```

### mips

Number of mipmap levels (default: 1):

```ini
[ResourceMipmapped]
type = Texture2D
width = 1024
height = 1024
mips = 11  ; Full mip chain for 1024x1024
```

### msaa

MSAA sample count (for multisampled textures):

```ini
[ResourceMSAA]
type = Texture2DMS
width = 1920
height = 1080
msaa = 4
msaa_quality = 0
```

### msaa_quality

MSAA quality level (used with `msaa`):

```ini
[ResourceMSAA]
msaa = 8
msaa_quality = 0
```

### Dimension Multipliers

Scale dimensions relative to resolution:

```ini
[ResourceHalfRes]
type = Texture2D
width = res_width
height = res_height
width_multiply = 0.5
height_multiply = 0.5
; Result: half resolution texture

[ResourceDoubleRes]
type = Texture2D
width = res_width
height = res_height
width_multiply = 2.0
height_multiply = 2.0
; Result: double resolution texture
```

## Format

Specifies the pixel/data format using DXGI format names. See the [Microsoft DXGI_FORMAT documentation](https://learn.microsoft.com/en-us/windows/win32/api/dxgiformat/ne-dxgiformat-dxgi_format) for the complete list.

### Common Texture Formats

| Format                  | Description                              | Use Case                    |
|-------------------------|------------------------------------------|-----------------------------|
| `R8G8B8A8_UNORM`        | 8-bit RGBA, normalized (0-1)             | Standard color textures     |
| `R8G8B8A8_UNORM_SRGB`   | 8-bit RGBA, sRGB color space             | sRGB textures               |
| `R16G16B16A16_FLOAT`    | 16-bit float RGBA (HDR)                  | HDR textures, render targets|
| `R32G32B32A32_FLOAT`    | 32-bit float RGBA (full precision)       | High precision data         |
| `R32_FLOAT`             | 32-bit float single channel              | Depth, heightmaps           |
| `R16_FLOAT`             | 16-bit float single channel              | Half precision data         |
| `R8_UNORM`              | 8-bit single channel, normalized         | Masks, alpha channels       |
| `BC1_UNORM`             | DXT1 compressed                          | Compressed color            |
| `BC3_UNORM`             | DXT5 compressed                          | Compressed color with alpha |
| `BC7_UNORM`             | High quality compressed                  | High quality compression    |

### Common Buffer Formats

| Format             | Description                    | Use Case                 |
|--------------------|--------------------------------|--------------------------|
| `R32_UINT`         | 32-bit unsigned integer        | Index buffers            |
| `R16_UINT`         | 16-bit unsigned integer        | 16-bit index buffers     |
| `R32G32B32_FLOAT`  | 3-component 32-bit float       | Position data            |
| `R32G32_FLOAT`     | 2-component 32-bit float       | UV coordinates           |

```ini
[ResourceColorRT]
type = Texture2D
format = R8G8B8A8_UNORM
width = 1920
height = 1080

[ResourceDepth]
type = Texture2D
format = R32_FLOAT
width = 1920
height = 1080

[ResourceIndexBuffer]
type = Buffer
format = R32_UINT
byte_width = 4096
```

## Buffer Properties

Properties specific to buffer resources.

### stride

Size in bytes of a single element in a structured buffer or vertex buffer:

```ini
[ResourceVertexBuffer]
type = Buffer
stride = 32  ; 32 bytes per vertex
byte_width = 10240

[ResourceInstanceData]
type = StructuredBuffer
stride = 64  ; 64 bytes per instance
byte_width = 4096
```

### byte_width

Total size of the buffer in bytes:

```ini
[ResourceBuffer]
type = Buffer
byte_width = 8192  ; 8 KB buffer

; Can use expressions
byte_width = vertex_count * 32
```

## Bind Flags

Specify how the resource can be used in the pipeline. Multiple flags can be combined.

### Available Bind Flags

| Flag                   | Description                                    |
|------------------------|------------------------------------------------|
| `vertex_buffer`        | Can be bound as vertex buffer                  |
| `index_buffer`         | Can be bound as index buffer                   |
| `constant_buffer`      | Can be bound as constant buffer                |
| `shader_resource`      | Can be bound as shader resource (texture/SRV)  |
| `stream_output`        | Can be used for stream output                  |
| `render_target`        | Can be used as render target                   |
| `depth_stencil`        | Can be used as depth/stencil buffer            |
| `unordered_access`     | Can be bound as UAV (read/write access)        |

```ini
[ResourceRenderTarget]
type = Texture2D
width = 1920
height = 1080
format = R8G8B8A8_UNORM
bind_flags = render_target shader_resource

[ResourceRWTexture]
type = Texture2D
width = 1024
height = 1024
format = R32_FLOAT
bind_flags = unordered_access shader_resource

[ResourceVertexBuffer]
type = Buffer
stride = 32
byte_width = 10240
bind_flags = vertex_buffer
```

## Misc Flags

Additional resource creation flags. Multiple flags can be combined.

### Available Misc Flags

| Flag                      | Description                                   |
|---------------------------|-----------------------------------------------|
| `generate_mips`           | Enable automatic mipmap generation            |
| `shared`                  | Resource can be shared between devices        |
| `texturecube`             | Texture is a cube map                         |
| `drawindirect_args`       | Buffer contains draw indirect arguments       |
| `buffer_allow_raw_views`  | Allow raw buffer views                        |
| `buffer_structured`       | Buffer is a structured buffer                 |
| `resource_clamp`          | Clamp texture coordinates                     |

```ini
[ResourceCubeMap]
type = Cube
width = 512
height = 512
format = R16G16B16A16_FLOAT
misc_flags = texturecube generate_mips

[ResourceDrawArgs]
type = Buffer
byte_width = 16
misc_flags = drawindirect_args
```

## File Loading

### filename

Load resource data from a file. Supports relative paths from the mod directory.

**Supported formats:**
- `.dds` - DirectDraw Surface (textures)
- `.buf` - Raw buffer data
- `.ib` - Index buffer
- `.vb` - Vertex buffer
- `.txt` - Text data

```ini
[ResourceTexture]
filename = Textures\CustomDiffuse.dds

[ResourceModel]
type = Buffer
filename = Models\Character.buf

; Relative paths are supported
[ResourceIcon]
filename = .\UI\Icons\Icon01.dds

; Subdirectories
[ResourceShared]
filename = ..\..\SharedAssets\Common.dds
```

## Initial Data

### data

Initialize the resource with inline data. Primarily used for string data or small constant values.

```ini
[ResourceString]
type = Buffer
data = "Hello, World!"

; Numeric data (format dependent)
[ResourceValues]
type = Buffer
format = R32_FLOAT
data = 1.0 2.0 3.0 4.0
```

**Note:** The `data` property is primarily for text strings. For complex initialization, use `filename` or populate the resource through CommandList operations.

## Performance Optimization

### max_copies_per_frame

Limit the number of times a resource can be copied per frame. Useful for preventing excessive resource copying that can impact performance.

```ini
[ResourceExpensive]
type = Texture2D
width = 3840
height = 2160
format = R16G16B16A16_FLOAT
max_copies_per_frame = 1

; Reset the counter each frame in Present
[Present]
post reset_per_frame_limits = resourceResourceExpensive
```

**Value:**
- `0` (default) - No limit
- `> 0` - Maximum copies per frame

When the limit is reached, copy operations are skipped until the counter is reset using `reset_per_frame_limits`.

## Dynamic Resource Sizing

Resources can use expressions for dynamic sizing based on resolution or other runtime values:

```ini
[ResourceMatchResolution]
type = Texture2D
width = res_width
height = res_height
format = R8G8B8A8_UNORM

[ResourceMatchRenderTarget]
type = Texture2D
width = rt_width
height = rt_height
format = R16G16B16A16_FLOAT

[ResourceHalfSize]
type = Texture2D
width = res_width / 2
height = res_height / 2
format = R8G8B8A8_UNORM

[ResourceAspectCorrect]
type = Texture2D
width = 1024
height = 1024 * res_height / res_width  ; Maintain aspect ratio
format = R8G8B8A8_UNORM
```

## Practical Examples

### Example 1: Backup Render Target

```ini
[ResourceBackupRT]
type = Texture2D
width = res_width
height = res_height
format = R8G8B8A8_UNORM
bind_flags = render_target shader_resource

[ShaderOverrideBackup]
hash = abcd1234
; Backup render target before shader executes
pre ResourceBackupRT = copy o0
```

### Example 2: Custom Depth Buffer

```ini
[ResourceCustomDepth]
type = Texture2D
width = 1920
height = 1080
format = R32_FLOAT
bind_flags = shader_resource

[CommandListCopyDepth]
; Copy game's depth buffer to custom resource
ResourceCustomDepth = copy oD

; Make available to vertex shader
vs-t110 = ResourceCustomDepth
```

### Example 3: Compute Shader Output

```ini
[ResourceComputeOutput]
type = Texture2D
width = 1024
height = 1024
format = R32G32B32A32_FLOAT
bind_flags = unordered_access shader_resource

[CustomShaderCompute]
cs = ShaderFixes\compute.hlsl
cs-u0 = ResourceComputeOutput
dispatch = 16, 16, 1

[ShaderOverrideUseResult]
hash = efgh5678
ps-t100 = ResourceComputeOutput
```

### Example 4: Multi-Resolution Cascade

```ini
[ResourceBlurTemp1]
type = Texture2D
width = res_width
height = res_height
format = R16G16B16A16_FLOAT
bind_flags = render_target shader_resource

[ResourceBlurTemp2]
type = Texture2D
width = res_width / 2
height = res_height / 2
format = R16G16B16A16_FLOAT
bind_flags = render_target shader_resource

[ResourceBlurTemp3]
type = Texture2D
width = res_width / 4
height = res_height / 4
format = R16G16B16A16_FLOAT
bind_flags = render_target shader_resource

[CommandListBlurCascade]
; Full resolution blur
ResourceBlurTemp1 = copy o0
run = CustomShaderBlur1

; Half resolution
ResourceBlurTemp2 = copy ResourceBlurTemp1
run = CustomShaderBlur2

; Quarter resolution
ResourceBlurTemp3 = copy ResourceBlurTemp2
run = CustomShaderBlur3
```

### Example 5: Loading Model Data

```ini
[ResourceCharacterIB]
type = Buffer
format = R32_UINT
filename = Models\Character_IB.buf

[ResourceCharacterPosition]
type = Buffer
stride = 12  ; 3 floats (x,y,z)
filename = Models\Character_Position.buf

[ResourceCharacterTexcoord]
type = Buffer
stride = 8   ; 2 floats (u,v)
filename = Models\Character_Texcoord.buf

[TextureOverrideCharacter]
hash = 12345678
; Replace with custom model
ib = ResourceCharacterIB
vb0 = ResourceCharacterPosition
vb1 = ResourceCharacterTexcoord
drawindexed = auto
```

### Example 6: Ping-Pong Buffers

```ini
[ResourcePingPong0]
type = Texture2D
width = 1920
height = 1080
format = R16G16B16A16_FLOAT
bind_flags = unordered_access shader_resource

[ResourcePingPong1]
type = Texture2D
width = 1920
height = 1080
format = R16G16B16A16_FLOAT
bind_flags = unordered_access shader_resource

[CustomShaderPass1]
cs = ShaderFixes\process.hlsl
cs-t0 = ResourcePingPong0
cs-u0 = ResourcePingPong1
dispatch = 120, 68, 1

[CustomShaderPass2]
cs = ShaderFixes\process.hlsl
cs-t0 = ResourcePingPong1
cs-u0 = ResourcePingPong0
dispatch = 120, 68, 1

; Alternate between buffers for multi-pass effects
```

### Example 7: Performance-Limited Copy

```ini
[ResourceExpensiveCopy]
type = Texture2D
width = 3840
height = 2160
format = R32G32B32A32_FLOAT
bind_flags = render_target shader_resource
max_copies_per_frame = 1

[Present]
; Reset copy counter at start of each frame
post reset_per_frame_limits = resourceResourceExpensiveCopy

[ShaderOverrideCopyOnce]
hash = abcd1234
; This copy will only happen once per frame
ResourceExpensiveCopy = copy o0
```

## Resource Substantiation

Resources are created on-demand when first referenced. This is called "resource substantiation." Empty Resource sections act as declarations:

```ini
; Declaration only - created when first used
[ResourceLazy]
type = Texture2D
width = 1920
height = 1080
format = R8G8B8A8_UNORM

; First reference causes creation
[CommandListExample]
ResourceLazy = copy o0  ; Resource created here
```

## Common Pitfalls

### Missing Bind Flags

Ensure the resource has appropriate bind flags for its intended use:

```ini
; WRONG: Missing shader_resource flag
[ResourceTexture]
type = Texture2D
width = 1024
height = 1024
format = R8G8B8A8_UNORM
; Can't be bound to ps-t0 without shader_resource flag

; CORRECT: Include necessary bind flags
[ResourceTexture]
type = Texture2D
width = 1024
height = 1024
format = R8G8B8A8_UNORM
bind_flags = shader_resource
```

### Format Mismatches

Use appropriate formats for the resource type:

```ini
; WRONG: Depth format for color render target
[ResourceRT]
format = D24_UNORM_S8_UINT
bind_flags = render_target

; CORRECT: Color format for color render target
[ResourceRT]
format = R8G8B8A8_UNORM
bind_flags = render_target
```

### Stride Requirements

Structured buffers require stride to be set:

```ini
; WRONG: Missing stride
[ResourceStructured]
type = StructuredBuffer
byte_width = 4096

; CORRECT: Stride specified
[ResourceStructured]
type = StructuredBuffer
stride = 64
byte_width = 4096
```

### File Path Issues

Use relative paths from the mod directory:

```ini
; WRONG: Absolute path (not portable)
[ResourceTexture]
filename = C:\Users\User\Mods\texture.dds

; CORRECT: Relative path
[ResourceTexture]
filename = Textures\texture.dds

; CORRECT: Relative with subdirectories
[ResourceTexture]
filename = .\Assets\Textures\texture.dds
```
