# DirectX 11 Flags Reference

This page provides a comprehensive reference for all DirectX 11 flags used in 3dmigoto INI configuration. These flags control resource properties, binding behavior, access patterns, and resource capabilities.

## Overview

DirectX 11 uses various flag types to specify resource properties and behavior:

- **Bind Flags** - Where the resource can be bound in the pipeline (render target, shader resource, etc.)
- **Usage Types** - How the resource is accessed (default, immutable, dynamic, staging)
- **CPU Access Flags** - What CPU operations are allowed (read, write)
- **Misc Flags** - Special resource properties (mipmaps, cubemaps, structured buffers, etc.)

These flags are used in:
- [TextureOverride](./texture-override.md) sections - Fuzzy matching and resource description
- [Resource](./resource.md) sections - Custom resource creation
- Frame analysis dumps - Resource property identification

## Bind Flags (D3D11_BIND_FLAG)

Bind flags specify where in the rendering pipeline a resource can be bound. Multiple flags can be combined.

Reference: `CommandList.h:423-449`

### Flag Values

| Flag Name | INI String | Hexadecimal | Description |
|-----------|-----------|-------------|-------------|
| VERTEX_BUFFER | `vertex_buffer` | 0x00000001 | Can be bound as vertex buffer input |
| INDEX_BUFFER | `index_buffer` | 0x00000002 | Can be bound as index buffer input |
| CONSTANT_BUFFER | `constant_buffer` | 0x00000004 | Can be bound as constant buffer (shader uniforms) |
| SHADER_RESOURCE | `shader_resource` | 0x00000008 | Can be bound as shader resource view (texture/buffer read) |
| STREAM_OUTPUT | `stream_output` | 0x00000010 | Can be bound as stream output target |
| RENDER_TARGET | `render_target` | 0x00000020 | Can be bound as render target output |
| DEPTH_STENCIL | `depth_stencil` | 0x00000040 | Can be bound as depth/stencil buffer |
| UNORDERED_ACCESS | `unordered_access` | 0x00000080 | Can be bound as unordered access view (read/write) |
| DECODER | `decoder` | 0x00000200 | Can be used by video decoder |
| VIDEO_ENCODER | `video_encoder` | 0x00000400 | Can be used by video encoder |

Reference: `CommandList.h:423-449`

### Usage in INI Files

#### Single Flag

```ini
[Resource]
type = Buffer
bind_flags = vertex_buffer
```

#### Multiple Flags (Combined)

```ini
[Resource]
type = Texture2D
bind_flags = render_target shader_resource
```

When multiple flags are specified, they are bitwise OR'd together. The resource can be bound in all specified ways.

#### Fuzzy Matching

```ini
[TextureOverride]
; Match textures that are render targets
match_bind_flags = render_target

; Match textures with specific combination
match_bind_flags = +render_target +shader_resource

; Match textures that are NOT depth/stencil
match_bind_flags = -depth_stencil

; Hex value with mask
match_bind_flags = 0x00000020 / 0x000000ff
```

The `+` prefix requires the flag to be present, `-` prefix requires it to be absent.

Reference: `IniHandler.cpp:3057-3061`, see [fuzzy-matching.md](./fuzzy-matching.md)

### Common Combinations

| Combination | Usage |
|-------------|-------|
| `render_target shader_resource` | Render-to-texture (output, then read as input) |
| `depth_stencil shader_resource` | Shadow map (write depth, then sample) |
| `unordered_access shader_resource` | Compute shader output (write, then read) |
| `constant_buffer` | Uniform buffer (shader parameters) |
| `vertex_buffer` | Geometry input |
| `index_buffer` | Index list for indexed drawing |

### Restrictions

Not all flag combinations are valid for all resource types:

- **Buffers** can have: vertex_buffer, index_buffer, constant_buffer, shader_resource, stream_output, unordered_access
- **Textures** can have: shader_resource, render_target, depth_stencil, unordered_access
- **Render targets** typically cannot be constant_buffer or vertex_buffer
- **Immutable resources** cannot be render_target, depth_stencil, or unordered_access

See [Microsoft documentation](https://docs.microsoft.com/en-us/windows/win32/api/d3d11/ne-d3d11-d3d11_bind_flag) for complete compatibility matrix.

## Usage Types (D3D11_USAGE)

Usage types control how the resource is accessed by CPU and GPU, affecting performance and capabilities.

Reference: `ResourceHash.h:250-255`

### Usage Values

| Usage Type | INI String | Enum Value | Description |
|------------|-----------|------------|-------------|
| DEFAULT | `default` | 0 | GPU read/write only. Most efficient for GPU-only data. |
| IMMUTABLE | `immutable` | 1 | GPU read-only. Cannot be modified after creation. Most efficient for static data. |
| DYNAMIC | `dynamic` | 2 | GPU read-only, CPU write-only. Optimized for frequent CPU updates. |
| STAGING | `staging` | 3 | CPU read/write. Used for copying data to/from GPU. Slowest access. |

Reference: `ResourceHash.h:250-255`, [Microsoft documentation](https://docs.microsoft.com/en-us/windows/win32/api/d3d11/ne-d3d11-d3d11_usage)

### Usage in INI Files

```ini
[Resource]
type = Buffer
usage = dynamic
bind_flags = constant_buffer
```

### Fuzzy Matching

```ini
[TextureOverride]
; Match only dynamic textures
match_usage = dynamic

; Match default OR dynamic
match_usage = default
[TextureOverride2]
match_usage = dynamic

; Exclude immutable resources
match_usage ! immutable
```

**Important:** If `match_usage` is not specified in fuzzy matching, it defaults to `default` (D3D11_USAGE_DEFAULT). This prevents accidentally overriding immutable resources, which can cause driver crashes.

Reference: `IniHandler.cpp:3041-3054`

### Usage Characteristics

| Feature | DEFAULT | IMMUTABLE | DYNAMIC | STAGING |
|---------|---------|-----------|---------|---------|
| **GPU Read** | Yes | Yes | Yes | No* |
| **GPU Write** | Yes | No | No | No* |
| **CPU Read** | No** | No | No | Yes |
| **CPU Write** | No** | No | Yes | Yes |
| **Map() Access** | No | No | WRITE_DISCARD | READ, WRITE |
| **UpdateSubresource()** | Yes | No | Limited | Limited |
| **Performance** | High | Highest | Medium | Low |

\* Staging resources cannot be bound to pipeline, used for transfers only  
** Can be accessed via CopyResource() to/from staging resource

### Usage Selection Guide

**Use DEFAULT when:**
- Resource is GPU-only (render targets, depth buffers, static textures)
- Content updated rarely or via compute shader
- Maximum GPU performance needed

**Use IMMUTABLE when:**
- Resource never changes after creation (static meshes, lookup tables)
- Absolute maximum performance needed
- Content known at creation time

**Use DYNAMIC when:**
- Resource updated by CPU every frame (constant buffers, dynamic text)
- Fast CPU→GPU transfer needed
- Write-only CPU access sufficient

**Use STAGING when:**
- Reading back GPU data to CPU (screenshots, GPU computation results)
- Copying data between resources
- Debugging resource contents

## CPU Access Flags (D3D11_CPU_ACCESS_FLAG)

CPU access flags specify what operations the CPU can perform on the resource via Map().

Reference: `ResourceHash.h:264-274`

### Flag Values

| Flag Name | INI String | Hexadecimal | Description |
|-----------|-----------|-------------|-------------|
| WRITE | `write` | 0x00010000 | CPU can write to resource via Map() |
| READ | `read` | 0x00020000 | CPU can read from resource via Map() |

Reference: `ResourceHash.h:264-274`

### Usage in INI Files

```ini
[Resource]
type = Buffer
usage = dynamic
cpu_access_flags = write
```

### Fuzzy Matching

```ini
[TextureOverride]
; Match resources CPU can write
match_cpu_access_flags = write

; Match resources CPU can read
match_cpu_access_flags = read

; Hex value
match_cpu_access_flags = 0x00010000
```

Reference: `IniHandler.cpp:3062-3066`

### Usage Restrictions

| Usage Type | Allowed CPU Access Flags |
|------------|--------------------------|
| DEFAULT | None (0x00000000) |
| IMMUTABLE | None (0x00000000) |
| DYNAMIC | WRITE only (0x00010000) |
| STAGING | READ and/or WRITE (0x00010000, 0x00020000, or 0x00030000) |

Attempting to specify incompatible CPU access flags will cause resource creation to fail.

### Map Types

When `cpu_access_flags` is specified, the resource can be mapped with ID3D11DeviceContext::Map():

| CPU Access Flag | Allowed Map Types |
|-----------------|-------------------|
| WRITE (DYNAMIC usage) | D3D11_MAP_WRITE_DISCARD, D3D11_MAP_WRITE_NO_OVERWRITE |
| READ (STAGING usage) | D3D11_MAP_READ |
| WRITE (STAGING usage) | D3D11_MAP_WRITE, D3D11_MAP_READ_WRITE |
| READ + WRITE (STAGING usage) | D3D11_MAP_READ_WRITE |

## Miscellaneous Flags (D3D11_RESOURCE_MISC_FLAG)

Miscellaneous flags control special resource properties and capabilities.

Reference: `ResourceHash.h:276-316`

### Flag Values

| Flag Name | INI String | Hexadecimal | Description |
|-----------|-----------|-------------|-------------|
| GENERATE_MIPS | `generate_mips` | 0x00000001 | Enable automatic mipmap generation |
| SHARED | `shared` | 0x00000002 | Resource can be shared between devices |
| TEXTURECUBE | `texturecube` | 0x00000004 | Texture is a cubemap (6 faces) |
| DRAWINDIRECT_ARGS | `drawindirect_args` | 0x00000010 | Buffer contains DrawIndirect arguments |
| BUFFER_ALLOW_RAW_VIEWS | `buffer_allow_raw_views` | 0x00000020 | Buffer supports raw (ByteAddress) views |
| BUFFER_STRUCTURED | `buffer_structured` | 0x00000040 | Buffer is structured (has stride) |
| RESOURCE_CLAMP | `resource_clamp` | 0x00000080 | Clamp texture coordinates |
| SHARED_KEYEDMUTEX | `shared_keyedmutex` | 0x00000100 | Shared resource with keyed mutex |
| GDI_COMPATIBLE | `gdi_compatible` | 0x00000200 | Can be used with GDI |
| SHARED_NTHANDLE | `shared_nthandle` | 0x00000800 | Shared using NT handle (DX11.1+) |
| RESTRICTED_CONTENT | `restricted_content` | 0x00001000 | Contains protected content |
| RESTRICT_SHARED_RESOURCE | `restrict_shared_resource` | 0x00002000 | Restrict shared resource access |
| RESTRICT_SHARED_RESOURCE_DRIVER | `restrict_shared_resource_driver` | 0x00004000 | Driver-level shared resource restriction |
| GUARDED | `guarded` | 0x00008000 | Guarded resource (protected memory) |
| TILE_POOL | `tile_pool` | 0x00020000 | Resource is a tile pool (tiled resources) |
| TILED | `tiled` | 0x00040000 | Resource is tiled |
| HW_PROTECTED | `hw_protected` | 0x00080000 | Hardware-protected resource |

Reference: `ResourceHash.h:276-316`

### Usage in INI Files

```ini
[Resource]
type = Texture2D
misc_flags = generate_mips
```

### Fuzzy Matching

```ini
[TextureOverride]
; Match cubemap textures
match_misc_flags = texturecube

; Match structured buffers
match_misc_flags = buffer_structured

; Multiple flags required
match_misc_flags = +generate_mips +shared

; Exclude specific flag
match_misc_flags = -texturecube

; Hex value with mask
match_misc_flags = 0x00000001 / 0x000000ff
```

Reference: `IniHandler.cpp:3067-3070`

### Important Flags

#### GENERATE_MIPS (0x00000001)

Enables automatic mipmap generation via ID3D11DeviceContext::GenerateMips().

**Requirements:**
- Must have SHADER_RESOURCE and RENDER_TARGET bind flags
- Format must support auto-mipmap generation (most common formats do)
- Usage must be DEFAULT

**Example:**
```ini
[Resource]
type = Texture2D
bind_flags = shader_resource render_target
misc_flags = generate_mips
format = R8G8B8A8_UNORM
mips = 11
```

After updating the top-level mip (level 0), call GenerateMips() to populate remaining levels.

#### TEXTURECUBE (0x00000004)

Marks texture as a cubemap with 6 faces (+X, -X, +Y, -Y, +Z, -Z).

**Requirements:**
- Type must be Texture2D
- Array size must be 6 (or multiple of 6 for cubemap arrays)
- Width must equal height (square)

**Example:**
```ini
[Resource]
type = Texture2D
width = 1024
height = 1024
array = 6
misc_flags = texturecube
bind_flags = shader_resource
```

#### BUFFER_STRUCTURED (0x00000040)

Marks buffer as structured buffer with element stride.

**Requirements:**
- Type must be Buffer
- Must specify stride (StructureByteStride)
- Typically used with shader_resource or unordered_access bind flags

**Example:**
```ini
[Resource]
type = Buffer
stride = 16
array = 1000
misc_flags = buffer_structured
bind_flags = shader_resource unordered_access
```

Creates a buffer with 1000 elements, each 16 bytes.

#### BUFFER_ALLOW_RAW_VIEWS (0x00000020)

Enables raw (ByteAddressBuffer) views of the buffer.

**Requirements:**
- Type must be Buffer
- Typically used with unordered_access bind flag
- Cannot be combined with BUFFER_STRUCTURED

**Example:**
```ini
[Resource]
type = Buffer
byte_width = 4096
misc_flags = buffer_allow_raw_views
bind_flags = shader_resource unordered_access
```

Access in shader via ByteAddressBuffer or RWByteAddressBuffer.

#### DRAWINDIRECT_ARGS (0x00000010)

Marks buffer as containing arguments for DrawInstancedIndirect or DispatchIndirect.

**Requirements:**
- Type must be Buffer
- Buffer must contain properly formatted argument structures

**Example:**
```ini
[Resource]
type = Buffer
byte_width = 16
misc_flags = drawindirect_args
usage = default
```

### Flag Combinations

Some flags require or exclude other flags:

| Flag | Requires | Excludes |
|------|----------|----------|
| GENERATE_MIPS | SHADER_RESOURCE + RENDER_TARGET | IMMUTABLE usage |
| BUFFER_STRUCTURED | Buffer type, stride > 0 | BUFFER_ALLOW_RAW_VIEWS |
| BUFFER_ALLOW_RAW_VIEWS | Buffer type | BUFFER_STRUCTURED |
| TEXTURECUBE | Texture2D, array=6, width=height | - |
| DRAWINDIRECT_ARGS | Buffer type | - |

## Format Support Flags (DXGI_FORMAT_SUPPORT)

Format support flags indicate what operations a DXGI format supports on a specific device. These are queried via ID3D11Device::CheckFormatSupport(), not specified in INI files.

### Common Support Flags

| Flag | Description |
|------|-------------|
| BUFFER | Format can be used for buffers |
| IA_VERTEX_BUFFER | Format can be used for vertex buffers |
| IA_INDEX_BUFFER | Format can be used for index buffers |
| TEXTURE1D | Format can be used for 1D textures |
| TEXTURE2D | Format can be used for 2D textures |
| TEXTURE3D | Format can be used for 3D textures |
| TEXTURECUBE | Format can be used for cubemaps |
| SHADER_SAMPLE | Format can be sampled in shaders |
| SHADER_LOAD | Format can be loaded (non-filtered) in shaders |
| RENDER_TARGET | Format can be used as render target |
| DEPTH_STENCIL | Format can be used as depth/stencil buffer |
| BLENDABLE | Format supports blending |
| MIP_AUTOGEN | Format supports automatic mipmap generation |
| MULTISAMPLE_RESOLVE | Format supports multisample resolve |
| MULTISAMPLE_LOAD | Format supports multisample load |

These flags determine whether specific operations are valid for a format. For example:
- A format must support RENDER_TARGET to be used with RENDER_TARGET bind flag
- A format must support MIP_AUTOGEN to use with GENERATE_MIPS misc flag
- A format must support DEPTH_STENCIL to be used with DEPTH_STENCIL bind flag

See [Microsoft documentation](https://docs.microsoft.com/en-us/windows/win32/api/d3d11/ne-d3d11-d3d11_format_support) and [resource.md](./resource.md) for format details.

## Practical Examples

### Example 1: High-Resolution Render Target

```ini
[Resource]
type = Texture2D
width = 3840
height = 2160
format = R8G8B8A8_UNORM
bind_flags = render_target shader_resource
usage = default
mips = 1
```

Creates 4K render target that can be both rendered to and sampled from shaders.

### Example 2: Dynamic Constant Buffer

```ini
[Resource]
type = Buffer
byte_width = 256
bind_flags = constant_buffer
usage = dynamic
cpu_access_flags = write
```

Creates constant buffer that CPU can update every frame via Map(WRITE_DISCARD).

### Example 3: Structured Buffer for Compute

```ini
[Resource]
type = Buffer
stride = 32
array = 10000
misc_flags = buffer_structured
bind_flags = shader_resource unordered_access
usage = default
```

Creates structured buffer with 10,000 elements (32 bytes each) for compute shader read/write.

### Example 4: Cubemap with Mipmaps

```ini
[Resource]
type = Texture2D
width = 512
height = 512
array = 6
mips = 10
format = R8G8B8A8_UNORM
misc_flags = texturecube generate_mips
bind_flags = shader_resource render_target
usage = default
```

Creates 512x512 cubemap with automatic mipmap generation.

### Example 5: Readback Texture (GPU→CPU)

```ini
[Resource]
type = Texture2D
width = 1920
height = 1080
format = R8G8B8A8_UNORM
usage = staging
cpu_access_flags = read
```

Creates staging texture for reading GPU data back to CPU (screenshots, etc.).

### Example 6: Fuzzy Match Shadow Maps

```ini
[TextureOverride]
match_format = R32_TYPELESS
match_bind_flags = depth_stencil
match_width >= 1024
match_height >= 1024
; Increase shadow map resolution
width = width * 2
height = height * 2
```

Matches depth/stencil buffers (shadow maps) at least 1024x1024 and doubles resolution.

### Example 7: Match Cubemaps Only

```ini
[TextureOverride]
match_misc_flags = texturecube
match_array = 6
; Override cubemap properties
format = R16G16B16A16_FLOAT
```

Matches all cubemap textures and upgrades to HDR format.

### Example 8: Match Dynamic Textures

```ini
[TextureOverride]
match_usage = dynamic
match_cpu_access_flags = write
; These are frequently updated textures
; Apply specific handling
```

Matches textures that are dynamically updated by CPU.

## Flag Parsing Syntax

### Named Flags

Most flag properties accept named constants (case-insensitive):

```ini
bind_flags = render_target shader_resource
usage = dynamic
misc_flags = generate_mips texturecube
```

Multiple flags separated by spaces are combined (bitwise OR).

### Hexadecimal Values

Flags can also be specified as hexadecimal:

```ini
bind_flags = 0x00000028  ; RENDER_TARGET | SHADER_RESOURCE
```

### Fuzzy Matching Prefix Operators

In fuzzy matching (`match_*` properties), flags support prefix operators:

```ini
; Must have render_target
match_bind_flags = +render_target

; Must NOT have depth_stencil
match_bind_flags = -depth_stencil

; Must have render_target AND shader_resource
match_bind_flags = +render_target +shader_resource

; Combination: must be render target, must not be depth stencil
match_bind_flags = +render_target -depth_stencil
```

**Operator meanings:**
- **No prefix or `=`:** Exact match (all flags must match exactly)
- **`+` prefix:** Flag must be present (bitwise AND check)
- **`-` prefix:** Flag must NOT be present (bitwise exclusion)

### Hexadecimal with Mask

For advanced matching, specify value and mask:

```ini
match_bind_flags = 0x00000020 / 0x000000ff
```

**Evaluation:** `(actual_flags & mask) == value`

This allows matching specific bits while ignoring others.

Reference: `IniHandler.cpp:2954-3024`, `ResourceHash.cpp:1442-1443`

## Performance Considerations

### Flag Selection Impact

Flag choices significantly affect performance:

1. **Usage Type:**
   - IMMUTABLE: Fastest (driver optimizes for read-only)
   - DEFAULT: Fast (GPU-optimal layout)
   - DYNAMIC: Medium (optimized for CPU updates)
   - STAGING: Slow (system memory, not cached)

2. **Bind Flags:**
   - More bind flags = more memory overhead
   - RENDER_TARGET + SHADER_RESOURCE = additional memory for transition
   - UNORDERED_ACCESS = additional memory tracking

3. **Misc Flags:**
   - GENERATE_MIPS = additional memory for mip chain
   - BUFFER_STRUCTURED = additional metadata per element
   - SHARED = synchronization overhead

### Best Practices

1. **Minimize bind flags:** Only specify what you actually use
2. **Choose appropriate usage:** IMMUTABLE for static, DYNAMIC for per-frame updates
3. **Avoid unnecessary misc flags:** Each flag has cost
4. **Use DEFAULT usage when possible:** Most GPU-efficient
5. **Avoid STAGING unless necessary:** Use for CPU readback only

## Common Errors

### Error: E_INVALIDARG on Resource Creation

**Cause:** Incompatible flag combination

**Common Issues:**
- IMMUTABLE usage with RENDER_TARGET bind flag
- DYNAMIC usage with bind flags other than SHADER_RESOURCE or CONSTANT_BUFFER
- CPU_ACCESS_WRITE with DEFAULT usage
- GENERATE_MIPS without RENDER_TARGET + SHADER_RESOURCE

**Solution:** Check flag compatibility table above or consult [Microsoft documentation](https://docs.microsoft.com/en-us/windows/win32/api/d3d11/nf-d3d11-id3d11device-createtexture2d).

### Error: Format Does Not Support Operation

**Cause:** Format doesn't support required operation

**Common Issues:**
- Using compressed format (BC1-BC7) with RENDER_TARGET
- Using depth format (D24_UNORM_S8_UINT) without DEPTH_STENCIL bind flag
- Using integer format with GENERATE_MIPS

**Solution:** Use ID3D11Device::CheckFormatSupport() to verify format capabilities, or see [resource.md](./resource.md).

### Error: Cannot Map Resource

**Cause:** Resource not created with appropriate CPU access flags

**Common Issues:**
- Attempting Map() on DEFAULT usage resource
- Using MAP_READ on DYNAMIC resource (only WRITE allowed)
- Using MAP_WRITE_DISCARD on STAGING resource (must use MAP_WRITE)

**Solution:** Match Map() type to usage and cpu_access_flags:
- DYNAMIC: Map with WRITE_DISCARD
- STAGING (READ): Map with READ
- STAGING (WRITE): Map with WRITE
- STAGING (READ+WRITE): Map with READ_WRITE
