# TextureOverride

TextureOverride sections allow you to match and modify textures and buffers in DirectX 11 games. You can match by hash (exact) or by resource properties (fuzzy matching), and perform various modifications including resource replacement, format changes, dimension overrides, and command list execution.

## Overview

TextureOverride sections are processed when a texture or buffer is bound to the rendering pipeline. They can:

- **Replace textures/buffers** with custom resources
- **Override texture dimensions** (width, height, format)
- **Increase vertex buffer sizes** (vertex limit raise)
- **Control texture behavior** (deny CPU reads, expand region copies)
- **Execute commands** when the texture is used
- **Match by exact hash** or **fuzzy match by properties**

```ini
; Hash-based matching (exact)
[TextureOverrideCharacterDiffuse]
hash = abc12345
ps-t0 = ResourceCustomTexture

; Fuzzy matching (by properties)
[TextureOverrideAllDepthBuffers]
match_type = Texture2D
match_bind_flags = depth_stencil
ps-t125 = ResourceDepthCopy
```

## Syntax

### Section Header

```ini
[TextureOverride<UniqueIdentifier>]
```

The section name must start with `TextureOverride` followed by any unique identifier. The identifier is for your reference only and doesn't affect functionality.

**Examples:**
```ini
[TextureOverrideCharacterSkin]
[TextureOverride_UI_MainMenu]
[TextureOverride1]
```

## Matching Methods

TextureOverride sections support two matching methods: **hash-based** (exact) and **fuzzy matching** (property-based). You cannot mix both in the same section.

### Hash-Based Matching

Match textures by their computed hash value. This is the most precise method.

```ini
[TextureOverrideExample]
hash = c3e55ebd
; Commands here execute when this specific texture is bound
```

**How to find hashes:**
- Enable hunting mode (F10)
- Use frame analysis (F8) to see texture hashes
- Check log files for texture hash information

See [Debugging](/docs/debugging.md) for hunting and frame analysis details.

### Fuzzy Matching

Match textures based on their DirectX 11 resource description properties. Useful for matching classes of textures (e.g., all depth buffers, all render targets of a certain size).

```ini
[TextureOverrideShadowMaps]
match_type = Texture2D
match_bind_flags = depth_stencil
match_width = 2048
match_height = 2048
```

::: warning
You cannot use both `hash =` and fuzzy match properties in the same section. Choose one matching method per section.
:::

See [Fuzzy Matching](/docs/fuzzy-matching.md) for complete fuzzy matching documentation.

---

## Properties Reference

### Hash Matching

#### hash

**Type:** Hexadecimal (32-bit)  
**Usage:** Exact texture matching

Specifies the texture hash to match. This is the primary identifier for hash-based TextureOverride sections.

```ini
[TextureOverridePlayerSkin]
hash = abc12345
ps-t0 = ResourceNewSkin
```

**Finding Hashes:**
- Use hunting mode (F10) + frame analysis (F8)
- Check `d3dx.ini` logs with `analyse_options = dump_rt_jps dump_tex_jps`
- Use ShaderUsage.txt from frame analysis dumps

Reference: IniHandler.cpp:3210

---

### Dimension Overrides

#### Format

**Type:** Integer (DXGI_FORMAT enum value)  
**Default:** -1 (no override)

Overrides the texture format. Use DXGI_FORMAT enum values or their integer equivalents.

```ini
[TextureOverrideForceR8G8B8A8]
hash = abc12345
Format = 28  ; DXGI_FORMAT_R8G8B8A8_UNORM
```

**Common Format Values:**
- `28` = R8G8B8A8_UNORM
- `87` = B8G8R8A8_UNORM  
- `10` = R16G16B16A16_FLOAT
- `2` = R32G32B32A32_FLOAT
- `45` = D24_UNORM_S8_UINT (depth/stencil)

See [Resource - Format Section](/docs/resource.md#format) for complete format list.

Reference: IniHandler.cpp:2853

---

#### Width

**Type:** Integer  
**Default:** -1 (no override)

Overrides the texture width in pixels.

```ini
[TextureOverrideDoubleWidth]
hash = abc12345
Width = 4096  ; Force to 4096 pixels wide
```

Reference: IniHandler.cpp:2854

---

#### Height

**Type:** Integer  
**Default:** -1 (no override)

Overrides the texture height in pixels.

```ini
[TextureOverrideDoubleHeight]
hash = abc12345
Height = 2048  ; Force to 2048 pixels tall
```

Reference: IniHandler.cpp:2855

---

#### width_multiply

**Type:** Float  
**Default:** 1.0

Multiplies the texture width by the specified factor.

```ini
[TextureOverrideDoubleResolution]
hash = abc12345
width_multiply = 2.0   ; 2x width
height_multiply = 2.0  ; 2x height
```

**Use Case:** Scale textures relative to their original size without hardcoding dimensions.

Reference: IniHandler.cpp:2856

---

#### height_multiply

**Type:** Float  
**Default:** 1.0

Multiplies the texture height by the specified factor.

```ini
[TextureOverrideHalfHeight]
hash = abc12345
height_multiply = 0.5  ; Halve the height
```

Reference: IniHandler.cpp:2857

---

### Vertex Buffer Overrides (Vertex Limit Raise)

#### override_vertex_count

**Type:** Integer  
**Usage:** Increases vertex buffer capacity

Specifies the new vertex count for the buffer, effectively increasing its size. **Requires `override_byte_stride` to be set.**

```ini
[TextureOverrideCharacterMesh]
hash = abc12345
override_vertex_count = 100000
override_byte_stride = 40
```

**Calculation:** New buffer size = `override_vertex_count` × `override_byte_stride` bytes

**Use Case:** Increase vertex buffer capacity for higher-poly custom models.

Reference: IniHandler.cpp:2860-2867

---

#### override_byte_stride

**Type:** Integer (bytes)  
**Required for:** `override_vertex_count`

Specifies the byte stride (size per vertex) of the vertex buffer.

```ini
[TextureOverrideIncreaseBuffer]
hash = abc12345
override_vertex_count = 50000
override_byte_stride = 32  ; 32 bytes per vertex
```

**How to find stride:**
- Use frame analysis (F8) - check vb0/vb1 dump filenames
- Format: `vb0=<index>-<stride>-<offset>-<hash>.buf`
- Example: `vb0=0-32-0-abc12345.buf` → stride is 32

Reference: IniHandler.cpp:2865

---

#### uav_byte_stride

**Type:** Integer (bytes)  
**Optional:** Used with UAV buffer resize

Specifies the structure byte stride for Unordered Access View (UAV) buffers when resizing.

```ini
[TextureOverrideUAVBuffer]
hash = abc12345
override_vertex_count = 10000
override_byte_stride = 64
uav_byte_stride = 16  ; UAV structure stride
```

**Calculation:** If set, num_elements = `override_vertex_count` × `override_byte_stride` / `uav_byte_stride`  
**If not set:** num_elements = `override_vertex_count`

Reference: IniHandler.cpp:2870-2876

---

#### Legacy: VertexLimitRaise Keyword

**Deprecated:** Using `VertexLimitRaise` in the section name

For backwards compatibility, if the section name contains `VertexLimitRaise`, 3dmigoto automatically sets the buffer size to ~8.8MB (8,800,000 bytes).

```ini
; Legacy syntax (not recommended)
[TextureOverrideCharacterVertexLimitRaise]
hash = abc12345
```

**Recommendation:** Use explicit `override_vertex_count` and `override_byte_stride` instead for precise control.

Reference: IniHandler.cpp:2877-2880

---

### Iteration Control

#### Iteration

**Type:** Comma-separated list of integers  
**Default:** 0 (all instances)

Restricts the TextureOverride to specific instances/iterations of the texture. Supports up to 10 iterations.

```ini
[TextureOverrideFirstInstance]
hash = abc12345
Iteration = 1
ps-t0 = ResourceFirstInstance

[TextureOverrideMultipleInstances]
hash = abc12345
Iteration = 2, 4, 6
ps-t0 = ResourceEvenInstances
```

**Iteration Values:**
- `0` = Match all instances (default)
- `1+` = Match specific instance number(s)

**Use Case:** When the same texture hash appears multiple times per frame, apply different overrides to each instance.

Reference: IniHandler.cpp:2885-2898

---

### Advanced Control

#### filter_index

**Type:** Float  
**Default:** FLT_MAX (no filtering)

Filter index value for advanced texture filtering control. Implementation-specific.

```ini
[TextureOverrideFiltered]
hash = abc12345
filter_index = 1.5
```

Reference: IniHandler.cpp:2900

---

#### expand_region_copy

**Type:** Boolean (`true` / `false`)  
**Default:** false

Expands the region copied to this texture with `CopySubresourceRegion` calls. Used to solve issues with transparent refraction effects (like glass) in CryEngine games.

```ini
[TextureOverrideGlassRefraction]
hash = abc12345
expand_region_copy = true
```

**Technical:** Prevents scissor rectangle from limiting the copy region, ensuring the full texture is copied.

Reference: IniHandler.cpp:2901

---

#### deny_cpu_read

**Type:** Boolean (`true` / `false`)  
**Default:** false

Prevents the game from reading from this texture on the CPU. The game receives a blank buffer instead.

```ini
[TextureOverridePreventCPURead]
hash = abc12345
deny_cpu_read = true
```

**Use Case:** Prevent CryEngine games from falsely culling objects based on CPU texture reads.

**Diagnostic:** Look for `MapType:1` in frame analysis logs to identify candidate textures.

Reference: IniHandler.cpp:2902

---

### Priority and Matching Control

#### match_priority

**Type:** Integer  
**Default:** 0

Defines processing priority when multiple TextureOverride sections match the same texture. Higher priority sections are processed first.

```ini
; High priority override
[TextureOverrideHighPriority]
match_type = Texture2D
match_bind_flags = depth_stencil
match_priority = 10
ps-t125 = ResourceDepthHighPriority

; Low priority fallback
[TextureOverrideLowPriority]
match_type = Texture2D
match_bind_flags = depth_stencil
match_priority = -5
ps-t125 = ResourceDepthFallback
```

**Sorting Order:**
1. Sections with higher `match_priority` values process first
2. Sections with equal priority are sorted by INI section name (alphabetically)

**Use Cases:**
- Resolve ambiguous fuzzy matches
- Define fallback behavior
- Indicate intentional duplicate hashes with draw context matching

Reference: IniHandler.cpp:2848-2851

---

## Draw Context Matching

TextureOverride sections can match the draw call context in which a texture is used, in addition to matching by hash or fuzzy properties. This allows different behavior for the same texture used in different draw calls.

### Draw Context Properties

#### match_first_vertex

**Type:** Fuzzy numeric expression  
**Usage:** Match the FirstVertexLocation parameter of Draw/DrawIndexed calls

```ini
[TextureOverrideSpecificDraw]
hash = abc12345
match_first_vertex = 0
; Only match when texture is used with FirstVertexLocation = 0
```

Reference: IniHandler.cpp:2906

---

#### match_first_index

**Type:** Fuzzy numeric expression  
**Usage:** Match the StartIndexLocation parameter of DrawIndexed calls

```ini
[TextureOverrideIndexedDraw]
hash = abc12345
match_first_index = 100
```

Reference: IniHandler.cpp:2910

---

#### match_first_instance

**Type:** Fuzzy numeric expression  
**Usage:** Match the StartInstanceLocation parameter

```ini
[TextureOverrideFirstInstance]
hash = abc12345
match_first_instance = 0
```

Reference: IniHandler.cpp:2914

---

#### match_vertex_count

**Type:** Fuzzy numeric expression  
**Usage:** Match the VertexCount parameter

```ini
[TextureOverrideLargeModel]
hash = abc12345
match_vertex_count = >10000
; Only match draws with more than 10,000 vertices
```

Reference: IniHandler.cpp:2918

---

#### match_index_count

**Type:** Fuzzy numeric expression  
**Usage:** Match the IndexCount parameter

```ini
[TextureOverrideHighPolyMesh]
hash = abc12345
match_index_count = >=50000
```

Reference: IniHandler.cpp:2922

---

#### match_instance_count

**Type:** Fuzzy numeric expression  
**Usage:** Match the InstanceCount parameter

```ini
[TextureOverrideInstanced]
hash = abc12345
match_instance_count = >1
; Only match instanced rendering
```

Reference: IniHandler.cpp:2926

---

### Fuzzy Numeric Expression Syntax

Draw context match properties support comparison operators and expressions:

**Operators:**
- `=` - Equal (default if no operator specified)
- `!` - Not equal
- `<` - Less than
- `>` - Greater than
- `<=` - Less than or equal
- `>=` - Greater than or equal

**Examples:**
```ini
match_vertex_count = 5000          ; Exactly 5000
match_vertex_count = >10000        ; Greater than 10000
match_index_count = <=20000        ; Up to 20000
match_first_vertex = !0            ; Not zero
```

Reference: IniHandler.cpp:2720-2746

---

## Command Lists

TextureOverride sections act as command lists. Commands execute when the matching texture is bound to the pipeline.

### Command Execution

```ini
[TextureOverrideExample]
hash = abc12345
; Replace the texture
ps-t0 = ResourceCustomTexture
; Set IniParams
x0 = 1.0
; Run another command list
run = CommandListCustomLogic
```

### Pre and Post Command Lists

Use the `post` modifier to execute commands at a different time:

```ini
[TextureOverrideWithTiming]
hash = abc12345
; Regular commands execute when texture is bound (pre)
ps-t0 = ResourceReplacement
; Post commands execute after the draw call
post ps-t0 = null
```

See [Command List](/docs/command-list.md) for complete command reference.

Reference: IniHandler.cpp:2930

---

## Fuzzy Matching Properties

When using fuzzy matching (without `hash =`), you can match textures by their DirectX 11 resource description properties.

### Resource Description Matching

#### match_type

**Values:** `Buffer`, `Texture1D`, `Texture2D`, `Texture3D`

Match textures by their resource dimension type.

```ini
[TextureOverride2DTextures]
match_type = Texture2D
```

---

#### match_usage

**Values:** `default`, `immutable`, `dynamic`, `staging`

Match textures by their CPU/GPU access usage pattern.

```ini
[TextureOverrideDynamicTextures]
match_type = Texture2D
match_usage = dynamic
```

---

#### match_bind_flags

**Values:** Flag names with `+`/`-` prefixes or hexadecimal with optional mask

Match textures by their pipeline binding capabilities.

```ini
; Named flags with +/- syntax
[TextureOverrideRenderTargets]
match_bind_flags = +render_target -depth_stencil

; Hexadecimal with mask
[TextureOverrideDepthBuffers]
match_bind_flags = 0x40 / 0x40  ; D3D11_BIND_DEPTH_STENCIL
```

**Available Flags:**
- `vertex_buffer` (0x01)
- `index_buffer` (0x02)
- `constant_buffer` (0x04)
- `shader_resource` (0x08)
- `stream_output` (0x10)
- `render_target` (0x20)
- `depth_stencil` (0x40)
- `unordered_access` (0x80)

---

#### match_cpu_access_flags

**Values:** Flag names with `+`/`-` or hexadecimal

Match textures by CPU access permissions.

```ini
[TextureOverrideCPUWrite]
match_cpu_access_flags = +write
```

**Available Flags:**
- `write` (0x10000)
- `read` (0x20000)

---

#### match_misc_flags

**Values:** Flag names with `+`/`-` or hexadecimal

Match textures by miscellaneous resource flags.

```ini
[TextureOverrideCubemaps]
match_misc_flags = +texturecube
```

See [Flags - Miscellaneous Flags](/docs/flags.md#miscellaneous-flags) for complete list.

---

### Dimension Matching

#### match_width

**Type:** Fuzzy numeric expression

Match textures by width in pixels.

```ini
[TextureOverride1080pWidth]
match_width = 1920

[TextureOverrideWideTextures]
match_width = >2560
```

**Special:** Supports expressions like `height * 16 / 9` for aspect ratio matching.

---

#### match_height

**Type:** Fuzzy numeric expression

Match textures by height in pixels.

```ini
[TextureOverrideFullHeightTextures]
match_height = res_height

[TextureOverrideTallTextures]
match_height = >1080
```

---

#### match_depth

**Type:** Fuzzy numeric expression

Match 3D textures by depth (Z dimension).

```ini
[TextureOverride3DVolume]
match_type = Texture3D
match_depth = 64
```

---

#### match_array

**Type:** Fuzzy numeric expression

Match texture arrays by array size.

```ini
[TextureOverrideSmallArrays]
match_array = <10
```

---

### Buffer Matching

#### match_byte_width

**Type:** Fuzzy numeric expression

Match buffers by total size in bytes.

```ini
[TextureOverrideLargeBuffer]
match_type = Buffer
match_byte_width = >1000000  ; Larger than 1MB
```

---

#### match_stride

**Type:** Fuzzy numeric expression

Match structured buffers by structure byte stride.

```ini
[TextureOverride32ByteStride]
match_type = Buffer
match_stride = 32
```

---

### Format and Quality Matching

#### match_format

**Type:** Fuzzy numeric expression (DXGI_FORMAT value)

Match textures by pixel format.

```ini
[TextureOverrideRGBA8Textures]
match_format = 28  ; DXGI_FORMAT_R8G8B8A8_UNORM
```

---

#### match_mips

**Type:** Fuzzy numeric expression

Match textures by mipmap level count.

```ini
[TextureOverrideFullMipChain]
match_mips = >1

[TextureOverrideNoMipmaps]
match_mips = 1
```

---

#### match_msaa

**Type:** Fuzzy numeric expression

Match textures by MSAA sample count.

```ini
[TextureOverride4xMSAA]
match_msaa = 4

[TextureOverrideNoMSAA]
match_msaa = 1
```

---

#### match_msaa_quality

**Type:** Fuzzy numeric expression

Match textures by MSAA quality level.

```ini
[TextureOverrideHighQualityMSAA]
match_msaa = 8
match_msaa_quality = >0
```

---

For complete fuzzy matching documentation including expression syntax and advanced patterns, see [Fuzzy Matching](/docs/fuzzy-matching.md).

Reference: IniHandler.cpp:2615-2632, ResourceHash.cpp

---

## Common Use Cases

### Texture Replacement

Replace a game texture with a custom texture resource:

```ini
[TextureOverrideCharacterSkin]
hash = abc12345
ps-t0 = ResourceCustomSkin

[ResourceCustomSkin]
filename = Mods\Character\CustomSkin.dds
```

### Vertex Limit Raise

Increase vertex buffer capacity for higher-poly models:

```ini
[TextureOverrideCharacterMesh]
hash = abc12345
override_vertex_count = 100000
override_byte_stride = 40
; Buffer will be 4,000,000 bytes (100,000 vertices × 40 bytes)
```

### Match All Depth Buffers

Apply an override to every depth buffer in the game:

```ini
[TextureOverrideAllDepthBuffers]
match_type = Texture2D
match_bind_flags = +depth_stencil
; Commands here execute for every depth buffer
ps-t125 = ResourceDepthCopy
```

### Resolution-Dependent Matching

Match textures that scale with game resolution:

```ini
[TextureOverrideFullscreenRT]
match_type = Texture2D
match_width = res_width
match_height = res_height
match_bind_flags = +render_target
```

### Draw Context Filtering

Apply overrides only to specific draw calls using the same texture:

```ini
[TextureOverrideCharacterHead]
hash = abc12345
match_vertex_count = <5000
ps-t0 = ResourceHeadTexture

[TextureOverrideCharacterBody]
hash = abc12345
match_vertex_count = >=5000
ps-t0 = ResourceBodyTexture
```

### Conditional Logic with Textures

Execute complex logic when a texture is detected:

```ini
[TextureOverrideDetectMainCharacter]
hash = abc12345
x0 = 1  ; Flag that main character is visible
run = CommandListCharacterLogic

[CommandListCharacterLogic]
if x0 == 1
    ; Enable custom shaders, lighting, etc.
endif
```

---

## Best Practices

### Hash vs Fuzzy Matching

**Use hash matching when:**
- You want to target a specific texture
- You have the exact hash from hunting/frame analysis
- You need precise, reliable matching

**Use fuzzy matching when:**
- You want to match multiple similar textures
- Hashes change between game updates/resolutions
- You want to match by properties (size, format, flags)

### Vertex Limit Raise

**Finding stride:**
1. Enable frame analysis (`F8`)
2. Find your vertex buffer in the dump
3. Check filename: `vb0=<index>-<stride>-<offset>-<hash>.buf`
4. Use the stride value

**Calculating vertex count:**
```
New vertex count = (desired vertices)
New buffer size = new vertex count × stride
```

**Example:** For a 40-byte stride mesh with 50,000 vertices:
```ini
override_vertex_count = 50000
override_byte_stride = 40
; Results in 2,000,000 byte buffer
```

### Priority Management

When multiple TextureOverride sections match:
1. **Use match_priority** to control order
2. **Higher values process first**
3. **Tie-breaker is alphabetical** by section name

```ini
[TextureOverrideA_HighPriority]
match_priority = 10
; Processes first

[TextureOverrideB_LowPriority]
match_priority = 5
; Processes second
```

### Performance Considerations

- **Hash matching is fastest** - use when possible
- **Fuzzy matching is slower** - matches every texture creation
- **Minimize fuzzy match sections** - combine criteria when possible
- **Use match_priority = -1** for expensive fallback matches

---

## Troubleshooting

### TextureOverride Not Working

**Check:**
1. ✅ Section name starts with `TextureOverride`
2. ✅ Hash is correct (verify with frame analysis)
3. ✅ No mixing of hash and fuzzy match properties
4. ✅ Resource is defined (if using resource replacement)
5. ✅ Check d3dx.ini logs for warnings

### Vertex Limit Raise Not Working

**Common Issues:**
- Missing `override_byte_stride` - required!
- Incorrect stride value - verify with frame analysis
- Wrong hash - ensure you're matching the vertex buffer
- Buffer too small - increase `override_vertex_count`

### Multiple Sections Matching

If multiple TextureOverride sections match the same texture:
- Use `match_priority` to define order
- Add draw context matching to differentiate
- Check logs for "Processing TextureOverride" messages

### Fuzzy Match Too Broad

If fuzzy matching catches unwanted textures:
- Add more specific criteria (`match_width`, `match_height`, etc.)
- Use `match_priority = -1` to make it a low-priority fallback
- Add draw context matching to narrow scope
- Consider switching to hash matching for precision

---

## Related Documentation

- [Fuzzy Matching](/docs/fuzzy-matching.md) - Complete fuzzy match documentation
- [ShaderOverride](/docs/shader-override.md) - Shader-based overrides
- [Command List](/docs/command-list.md) - Commands available in TextureOverride
- [Resource](/docs/resource.md) - Creating custom resources
- [Flags](/docs/flags.md) - DirectX 11 flag reference
- [Debugging](/docs/debugging.md) - Hunting and frame analysis
- [Properties](/docs/properties.md) - Built-in variables and IniParams
- [Draw Calls](/docs/draw-calls.md) - Draw call parameters for context matching

---

**Source References:**
- TextureOverride struct: globals.h:275-312
- Parsing: IniHandler.cpp:2841-2930, 3186-3253
- Fuzzy matching: ResourceHash.cpp, IniHandler.cpp:2664-3025
