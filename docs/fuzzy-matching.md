# Fuzzy Matching

Fuzzy matching allows [TextureOverride] sections to target resources by their properties (dimensions, format, flags) rather than by hash. This is particularly useful when texture hashes change between game updates but the resource characteristics remain consistent.

## Overview

Instead of specifying an exact hash, you can use `match_*` properties to pattern-match resources based on their DirectX 11 resource description. Multiple match criteria can be combined, and expressions can be used for flexible matching (ranges, comparisons, dynamic values).

**Key Differences from Hash-Based Matching:**
- Hash matching is exact (one texture)
- Fuzzy matching is pattern-based (potentially multiple textures)
- They are mutually exclusive within the same section
- Hash matches take precedence globally (if hash found, fuzzy matches are skipped)

Reference: `ResourceHash.cpp:1644-1766`, `IniHandler.cpp:3026-3114`

## Basic Syntax

```ini
[TextureOverride]
; No hash= specified - using fuzzy matching instead
match_width = 1920
match_height = 1080
match_format = R8G8B8A8_UNORM
; Override properties
width = 2560
height = 1440
```

**Important:** You cannot use `hash=` and `match_*` properties together in the same section. The INI parser will issue a warning and ignore the fuzzy match properties.

Reference: `IniHandler.cpp:3212-3223`

## Available Match Properties

### Common Properties (All Resource Types)

These properties work for buffers, 1D textures, 2D textures, and 3D textures:

```ini
match_usage = default              ; D3D11_USAGE
match_bind_flags = render_target   ; Bind flags (see Flags section)
match_cpu_access_flags = write     ; CPU access flags
match_misc_flags = generate_mips   ; Miscellaneous flags
```

**Default Behavior:** If `match_usage` is not specified, it defaults to `default` (D3D11_USAGE_DEFAULT). This prevents attempting to override immutable resources, which can cause driver crashes.

Reference: `IniHandler.cpp:3041-3054`

### Texture Properties

These properties apply to 1D, 2D, and 3D textures:

```ini
match_type = TEXTURE2D    ; Resource dimension
match_format = R8G8B8A8_UNORM  ; DXGI format
match_width = 1920        ; Width in texels
match_height = 1080       ; Height (2D/3D only)
match_depth = 6           ; Depth (3D only)
match_mips = 11           ; Number of mip levels
match_array = 1           ; Array size (1D/2D only)
```

**Resource Types:**
- `BUFFER` - Buffer resource
- `TEXTURE1D` - 1D texture
- `TEXTURE2D` - 2D texture (most common)
- `TEXTURE3D` - 3D volume texture

Reference: `IniHandler.cpp:3026-3100`, `ResourceHash.cpp:1501-1567`

### 2D Texture MSAA Properties

For 2D textures with multisampling:

```ini
match_msaa = 4            ; Sample count
match_msaa_quality = 0    ; Sample quality level
```

Reference: `ResourceHash.cpp:1535-1543`

### Buffer Properties

For buffer resources:

```ini
match_byte_width = 65536       ; Buffer size in bytes
match_stride = 16              ; StructureByteStride for structured buffers
```

Reference: `ResourceHash.cpp:1501-1515`

### Draw Context Properties

These can be used with both hash-based and fuzzy matching to filter based on draw call parameters:

```ini
match_first_vertex = 0
match_first_index = 0
match_first_instance = 0
match_vertex_count = 36
match_index_count = 6
match_instance_count = 1
```

Reference: `ResourceHash.cpp:1621-1642`

### Priority System

When multiple overrides match the same resource, priority determines application order:

```ini
match_priority = 10       ; Higher number = higher priority
```

**Priority Behavior:**
- Default priority is 0 if not specified
- Lower priority overrides are processed first
- Higher priority overrides are processed last (and can override earlier settings)
- Equal priority: sorted alphabetically by section name
- Negative priorities are allowed (processed before default)

Reference: `ResourceHash.cpp:1750-1765`, `HackerDevice.cpp:1950-1991`

## Expression Syntax

Match properties support expressions for flexible matching:

```ini
[ operator ] ( value | field_name [ * multiplier | * field_name ] [ / divider ] )
```

### Comparison Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `=` or none | Equal to (default) | `match_width = 1920` |
| `<` | Less than | `match_width < 1024` |
| `<=` | Less than or equal | `match_width <= 1920` |
| `>` | Greater than | `match_width > 1024` |
| `>=` | Greater than or equal | `match_width >= 1920` |
| `!` | Not equal | `match_format ! R8G8B8A8_UNORM` |

Reference: `IniHandler.cpp:2729-2750`, `ResourceHash.cpp:1431-1457`

### Dynamic Field Names

You can reference resource properties dynamically:

| Field | Description | Usage |
|-------|-------------|-------|
| `width` | Resource width | `match_height = width` (square texture) |
| `height` | Resource height | `match_width = height * 16 / 9` (aspect ratio) |
| `depth` | Resource depth | `match_array = depth` |
| `array` | Array size | `match_array > 1` (texture array) |
| `res_width` | Current resolution width | `match_width = res_width` (fullscreen) |
| `res_height` | Current resolution height | `match_height = res_height / 2` (half-res) |

Reference: `IniHandler.cpp:2676-2710`, `ResourceHash.cpp:1377-1400`

### Expression Examples

```ini
; Simple value comparisons
match_width = 1920
match_height > 1080
match_mips >= 5
match_array ! 1

; Square textures
match_height = width

; 16:9 aspect ratio textures
match_width = height * 16 / 9

; Fullscreen render targets
match_width = res_width
match_height = res_height

; Half-resolution buffers
match_width = res_width / 2
match_height = res_height / 2

; Buffer size matching (Resident Evil 7 example from source)
match_byte_width = res_width * res_height

; Double-width downsampling
match_width = width * 2
```

**Evaluation:** Expressions are evaluated when a resource is created. Field names refer to the resource being matched, and `res_width`/`res_height` refer to the current display resolution.

Reference: `IniHandler.cpp:2712-2803`, `ResourceHash.cpp:1402-1417`

## Flag Matching

Flags can be matched using named constants or hexadecimal values with masks. All flag-matching properties support the same syntax.

### match_bind_flags

Match resources by their bind flags (how they can be bound to the rendering pipeline).

**Syntax:**
- Use `+` prefix to require a flag (must be present)
- Use `-` prefix to exclude a flag (must be absent)
- Use flag names or hexadecimal values
- Multiple flags can be combined

```ini
; Match render targets
match_bind_flags = render_target

; Require render_target AND shader_resource
match_bind_flags = +render_target +shader_resource

; Exclude depth/stencil buffers
match_bind_flags = -depth_stencil

; Combination: render target with shader resource, but not depth
match_bind_flags = +render_target +shader_resource -depth_stencil

; Hexadecimal (0x20 = render_target)
match_bind_flags = 0x00000020

; Hexadecimal with mask
match_bind_flags = 0x00000020 / 0x000000ff
```

When using masks, the comparison is: `(resource_flags & mask) == value`

See [Flags - Bind Flags](./flags.md#bind-flags-d3d11_bind_flag) for available flags and their hexadecimal values.

Reference: `IniHandler.cpp:2954-3024`, `ResourceHash.cpp:1442-1443`

### match_misc_flags

Match resources by their miscellaneous flags (special properties like mipmaps, cubemaps, structured buffers).

Uses same syntax as `match_bind_flags`. See [Flags - Misc Flags](./flags.md#misc-flags-d3d11_resource_misc_flag) for available flags.

### match_cpu_access_flags

Match resources by their CPU access flags (read/write capabilities).

**Available flags:**
- `write` (0x00010000) - CPU can write to resource
- `read` (0x00020000) - CPU can read from resource

See [Flags - CPU Access Flags](./flags.md#cpu-access-flags-d3d11_cpu_access_flag) for details.

### match_usage

Match resources by their usage type (access pattern and mutability).

**Available values:**
- `default` (0) - GPU read/write, no CPU access
- `immutable` (1) - GPU read-only, no CPU access after creation
- `dynamic` (2) - GPU read-only, CPU write-only (frequent updates)
- `staging` (3) - GPU to/from CPU transfer

See [Flags - Usage Types](./flags.md#usage-types-d3d11_usage) for detailed descriptions.

Reference: `CommandList.h:437-448`, `ResourceHash.h:270-315`

## Priority and Multiple Matches

When multiple TextureOverride sections match the same resource, all matching sections are applied in priority order.

### Priority Resolution Process

1. **Find all matches** - Both hash-based and fuzzy matches are collected
2. **Sort by priority** - Lower priority first, higher priority last
3. **Apply sequentially** - Each override is applied in order
4. **Last wins** - Properties set by higher priority overrides replace earlier values

Reference: `HackerDevice.cpp:1954-1987`

### Priority Example

```ini
; Base override for all 1920x1080 textures
[TextureOverrideBase]
match_width = 1920
match_height = 1080
match_priority = 0
width = 2560
height = 1440

; Special case for UNORM format (higher priority wins)
[TextureOverrideSpecial]
match_width = 1920
match_height = 1080
match_format = R8G8B8A8_UNORM
match_priority = 10
width = 3840
height = 2160
; This override wins for UNORM textures
```

If a texture is 1920x1080 with R8G8B8A8_UNORM format:
1. Both sections match
2. Base is applied first (priority 0): sets width=2560, height=1440
3. Special is applied second (priority 10): overrides to width=3840, height=2160
4. Final result: 3840x2160

### Equal Priority

When multiple overrides have the same priority, they are sorted alphabetically by section name:

```ini
[TextureOverrideA]
match_width = 1920
match_priority = 5
; Applied first (alphabetically first)

[TextureOverrideB]
match_width = 1920
match_priority = 5
; Applied second (alphabetically second)
```

Reference: `ResourceHash.cpp:1750-1765`

## Hash vs Fuzzy Matching Interaction

Hash-based and fuzzy matching are mutually exclusive at two levels:

### Within Section (Parsing)

You cannot use both in the same section:

```ini
; INVALID - Error: Cannot use hash= and match options together!
[TextureOverrideInvalid]
hash = 0xabcd1234
match_width = 1920
```

The parser will issue a warning and ignore the fuzzy match properties.

Reference: `IniHandler.cpp:3212-3223`

### Global Matching (Runtime)

Hash matches take precedence over fuzzy matches:

```cpp
// Pseudocode from ResourceHash.cpp:1690-1700
find_texture_overrides(hash, desc, matches) {
    find_texture_override_for_hash(hash, matches);
    if (!matches.empty()) {
        // Hash match found - skip fuzzy matching entirely
        return;
    }
    // No hash match - now try fuzzy matching
    find_texture_overrides_for_desc(desc, matches);
}
```

**Implication:** If a resource has a hash-based override, fuzzy overrides will never be evaluated for that resource, even if the fuzzy patterns would match.

Reference: `ResourceHash.cpp:1690-1700`

### Comparison Table

| Feature | Hash-Based | Fuzzy Matching |
|---------|-----------|----------------|
| **Precision** | Exact match (one texture) | Pattern-based (multiple textures) |
| **Section syntax** | `hash = 0x12345678` | `match_width = 1920`, etc. |
| **Can coexist in section** | No | No |
| **Global interaction** | Blocks fuzzy if found | Only runs if hash not found |
| **Priority support** | Yes | Yes |
| **Draw context** | Yes | Yes |
| **Performance** | O(1) hash lookup | O(n) iterate all fuzzy overrides |
| **Stability** | Breaks when game updates | Survives game updates (if dimensions stay same) |

## Resource Type Auto-Detection

The system automatically narrows down possible resource types based on the properties you specify:

```cpp
// From ResourceHash.cpp:1587-1619
if (ByteWidth or StructureByteStride specified)
    → Must be a buffer (not texture)

if (Height specified)
    → Must be 2D or 3D texture (not buffer or 1D)

if (Depth specified)
    → Must be 3D texture (not buffer, 1D, or 2D)

if (Array specified)
    → Must be 1D or 2D texture (not buffer or 3D)

if (MSAA specified)
    → Must be 2D texture
```

You can explicitly specify `match_type` to restrict matching, but it's often not necessary.

Reference: `ResourceHash.cpp:1587-1619`

## Practical Examples

### Example 1: Fullscreen Render Targets

Match all fullscreen UNORM render targets and increase resolution:

```ini
[TextureOverrideFullscreenRT]
match_width = res_width
match_height = res_height
match_format = R8G8B8A8_UNORM
match_bind_flags = render_target
width = res_width * 2
height = res_height * 2
```

### Example 2: Shadow Map Resolution

Match shadow maps by size and increase resolution:

```ini
[TextureOverrideShadowMap]
match_width = 1024
match_height = 1024
match_format = R32_TYPELESS
match_bind_flags = depth_stencil
width = 4096
height = 4096
```

### Example 3: HDR Render Targets

Match HDR format render targets:

```ini
[TextureOverrideHDR]
match_format = R16G16B16A16_FLOAT
match_bind_flags = render_target
match_width >= 1920
; Apply HDR-specific overrides
```

### Example 4: Mipmap Generation

Match textures that support mipmap generation:

```ini
[TextureOverrideMipmaps]
match_misc_flags = +generate_mips
match_mips > 1
; Override mipmap handling
```

### Example 5: Priority-Based Resolution Scaling

Different scaling factors based on texture size:

```ini
; Small textures: 4x scaling
[TextureOverrideSmall]
match_width < 512
match_height < 512
match_bind_flags = render_target
match_priority = 0
width = width * 4
height = height * 4

; Medium textures: 2x scaling (higher priority)
[TextureOverrideMedium]
match_width >= 512
match_width < 2048
match_height >= 512
match_height < 2048
match_bind_flags = render_target
match_priority = 10
width = width * 2
height = height * 2

; Large textures: no scaling (highest priority)
[TextureOverrideLarge]
match_width >= 2048
match_height >= 2048
match_bind_flags = render_target
match_priority = 20
; No width/height override - keep original
```

### Example 6: Aspect Ratio Specific Matching

Match only 16:9 textures:

```ini
[TextureOverride16x9]
match_width = height * 16 / 9
match_bind_flags = render_target
; 16:9 specific overrides
```

### Example 7: Draw Context Filtering

Match specific texture only on certain draw calls:

```ini
[TextureOverrideSpecificDraw]
match_width = 1920
match_height = 1080
match_vertex_count = 36
match_instance_count = 1
; Only applies when drawing 36 vertices, 1 instance
```

### Example 8: Texture Arrays

Match texture arrays with specific layer count:

```ini
[TextureOverrideArrays]
match_array > 1
match_format = R8G8B8A8_UNORM
; Override for texture arrays
```

## Advanced Techniques

### Dynamic Resolution Scaling

Automatically adjust texture sizes based on display resolution:

```ini
[TextureOverrideScaledRT]
match_width = 1920
match_height = 1080
; Scale to current resolution
width = res_width
height = res_height
```

### Conditional Format Conversion

Change texture format based on other properties:

```ini
[TextureOverrideFormatChange]
match_format = R8G8B8A8_UNORM
match_width >= 1920
match_bind_flags = render_target
format = R16G16B16A16_FLOAT
; Upgrade to HDR for large render targets
```

### Multi-Stage Pipeline Matching

Use priority to handle multi-pass rendering:

```ini
; First pass: match original resolution
[TextureOverridePass1]
match_width = 1920
match_height = 1080
match_priority = 0
; Pass 1 overrides

; Second pass: match upscaled resolution
[TextureOverridePass2]
match_width = 3840
match_height = 2160
match_priority = 10
; Pass 2 overrides (after upscaling from Pass1)
```

### Cubemap Matching

Match cubemap textures specifically:

```ini
[TextureOverrideCubemap]
match_misc_flags = +texturecube
match_array = 6
; Cubemap-specific overrides
```

## Performance Considerations

### Fuzzy Matching Overhead

- **Hash matching:** O(1) hash table lookup (very fast)
- **Fuzzy matching:** O(n) iteration through all fuzzy overrides (slower)

For each resource creation:
1. Hash table lookup is attempted first
2. If no hash match, iterate through all fuzzy overrides
3. Each fuzzy override checks all its match conditions
4. All matches are collected and sorted by priority

**Recommendation:** Use hash-based matching when possible for best performance. Use fuzzy matching when:
- Hashes change between game updates
- Pattern-based matching is more maintainable
- Targeting multiple similar textures with one rule

Reference: `ResourceHash.cpp:1644-1766`

### Optimization Tips

1. **Specific criteria first:** Put most restrictive match conditions first in section to fail fast
2. **Avoid complex expressions:** Simple value comparisons are faster than field multiplication/division
3. **Use match_type:** Explicitly specify resource type to skip irrelevant checks
4. **Minimize fuzzy sections:** Fewer fuzzy override sections = faster matching
5. **Use priority sparingly:** Only when multiple matches are intentional

## Iteration Filtering

Fuzzy matching works with iteration filtering:

```ini
[TextureOverrideFuzzy]
match_width = 1920
match_height = 1080
iteration = 0,1,2
; Only applies on iterations 0, 1, 2
```

See [present.md](./present.md) for iteration details.

Reference: `globals.h:284`

## Filter Index

Fuzzy overrides can specify a `filter_index` for use with the `texture_filter` command:

```ini
[TextureOverrideFuzzy]
match_width = 1920
match_height = 1080
filter_index = 123.0
```

When multiple overrides match, the highest priority override's `filter_index` is returned by `texture_filter`.

Reference: `CommandList.cpp:2410-2449`

## Duplicate Hash Warnings

When multiple sections have the same hash, the parser normally issues a warning. However, warnings are suppressed when using:

1. Fuzzy matching (no hash)
2. Draw context matching (`match_first_vertex`, etc.)
3. Priority system (`match_priority`)

```ini
; WARNING: Duplicate hash
[TextureOverride1]
hash = 0x12345678
width = 1920

[TextureOverride2]
hash = 0x12345678  ; WARNING!
width = 2560

; No warning - priority disambiguates
[TextureOverride3]
hash = 0x12345678
match_priority = 0
width = 1920

[TextureOverride4]
hash = 0x12345678
match_priority = 10  ; No warning
width = 2560
```

Reference: `IniHandler.cpp:3116-3145`

## Troubleshooting

### Override Not Matching

**Problem:** Fuzzy override isn't being applied to expected texture.

**Diagnosis:**
1. Enable frame analysis: Press `F8` in-game
2. Check `log.txt` for fuzzy matching evaluation
3. Verify texture properties in frame analysis dump
4. Check if hash-based override exists (blocks fuzzy matching)

**Common Causes:**
- `match_usage` defaults to `default` - specify if targeting dynamic/staging resources
- Resource type mismatch (e.g., matching buffer properties on texture)
- Expression evaluation differs from expectation (check field values)
- Hash-based override for same texture takes precedence

### Multiple Overrides Conflicting

**Problem:** Multiple fuzzy overrides match, unclear which wins.

**Solution:**
- Add `match_priority` to control application order
- Higher priority = applied later = wins
- Check `log.txt` for override application order
- Use more specific match criteria to reduce matches

### Performance Issues

**Problem:** Game stuttering when many resources created.

**Diagnosis:**
- Check number of fuzzy override sections in INI files
- Profile with frame analysis timing data

**Solutions:**
- Convert frequently-matched fuzzy overrides to hash-based (faster)
- Reduce number of fuzzy override sections
- Make match criteria more specific (fail fast)
- Use `match_type` to narrow down resource types

### Expression Not Evaluating Correctly

**Problem:** Expression like `match_width = height * 16 / 9` not matching expected textures.

**Common Issues:**
- Integer division truncation: `1080 * 16 / 9 = 1920` (correct)
- Field name typos: case-sensitive, use exact names
- Order of operations: multiplication before division
- Field values: verify actual resource dimensions match expectations

**Debugging:**
- Enable frame analysis and check actual resource dimensions
- Use simple value first: `match_width = 1920` to confirm resource exists
- Then add expression: `match_width = height * 16 / 9`
- Check `log.txt` for expression evaluation warnings

### Flags Not Matching

**Problem:** `match_bind_flags` or similar not matching expected resources.

**Solutions:**
- Use hex values with masks: `match_bind_flags = 0x00000020 / 0x000000ff`
- Check multiple flags: `match_bind_flags = +render_target +shader_resource`
- Verify flag names (case-sensitive): see flag list above
- Check actual resource flags in frame analysis dump

### Immutable Resource Crash

**Problem:** Game crashes when applying overrides.

**Likely Cause:** Attempting to override D3D11_USAGE_IMMUTABLE resource with stereo/mono forcing.

**Solution:**
```ini
; Don't match immutable resources
match_usage = default  ; Only match default usage (default behavior)

; Or explicitly avoid immutable
match_usage ! immutable
```

Reference: `IniHandler.cpp:3041-3054` (default usage restriction)
