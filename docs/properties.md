# Properties and Parameters

This page documents all properties and parameters available in 3dmigoto INI files, including built-in variables, configuration options, and section-specific properties.

## Overview

3dmigoto uses properties in two main contexts:

1. **Parameters** - Configuration values (no `$` prefix)
2. **Variables** - User-defined values (start with `$`)

```ini
; Parameter (built-in)
time = 0             ; ERROR: Can't assign to read-only parameter

; Variable (user-defined)
$last_time = time    ; OK: Assigning time value to variable

; IniParams (special parameter array)
x0 = 1.0             ; Sets IniParams[0].x (accessible in shaders)
```

---

## Built-in Read-Only Parameters

These parameters provide runtime information and cannot be assigned to.

### Time and Frame

| Parameter | Type | Description | Reference |
|-----------|------|-------------|-----------|
| `time` | float | Seconds since game start | CommandList.cpp:2802 |
| `frame_no` | float | Current frame number | CommandList.cpp:2802 |

**Example:**
```ini
; Track time since last event
$last_press = time
if time - $last_press > 10.0
    ; 10 seconds have passed
endif
```

### Screen Resolution

| Parameter | Type | Description | Reference |
|-----------|------|-------------|-----------|
| `rt_width` | float | Current render target width | CommandList.cpp:2793 |
| `rt_height` | float | Current render target height | CommandList.cpp:2794 |
| `res_width` | float | Current resolution width | CommandList.cpp:2793 |
| `res_height` | float | Current resolution height | CommandList.cpp:2794 |
| `window_width` | float | Window client width | CommandList.cpp:2795 |
| `window_height` | float | Window client height | CommandList.cpp:2796 |

**Example:**
```ini
; Scale based on resolution
$scale = rt_width / 1920.0
separation = 2.0 * $scale
```

### Cursor Position

| Parameter | Type | Description | Reference |
|-----------|------|-------------|-----------|
| `cursor_x` | float | Mouse X position (pixels from left) | CommandList.cpp:2797 |
| `cursor_y` | float | Mouse Y position (pixels from top) | CommandList.cpp:2798 |
| `cursor_hotspot_x` | float | Cursor hotspot X offset | CommandList.cpp:2799 |
| `cursor_hotspot_y` | float | Cursor hotspot Y offset | CommandList.cpp:2800 |
| `cursor_showing` | float | 1.0 if cursor visible, 0.0 if hidden | CommandList.cpp:2801 |
| `cursor_screen_x` | float | Cursor screen X (accounting for hotspot) | |
| `cursor_screen_y` | float | Cursor screen Y (accounting for hotspot) | |

**Example:**
```ini
; Check if cursor is in top-left quadrant
if cursor_x < window_width / 2.0 && cursor_y < window_height / 2.0
    ; Cursor in top-left
endif
```

### Draw Call Context

| Parameter | Type | Description | Reference |
|-----------|------|-------------|-----------|
| `vertex_count` | float | Number of vertices in draw call | CommandList.cpp:2806 |
| `index_count` | float | Number of indices in draw call | CommandList.cpp:2807 |
| `instance_count` | float | Number of instances in draw call | CommandList.cpp:2808 |
| `draw_from_caller` | float | 1.0 if draw parameters from caller | |
| `first_vertex` | float | First vertex index | |
| `first_index` | float | First index | |
| `base_vertex` | float | Base vertex offset | |
| `first_instance` | float | First instance ID | |

**Example:**
```ini
; Only execute for large draw calls
if vertex_count > 1000
    run = CustomShaderBigMesh
endif
```

### Shader Context

| Parameter | Type | Description | Reference |
|-----------|------|-------------|-----------|
| `vs` | hash | Current vertex shader hash (as float) | |
| `hs` | hash | Current hull shader hash | |
| `ds` | hash | Current domain shader hash | |
| `gs` | hash | Current geometry shader hash | |
| `ps` | hash | Current pixel shader hash | |
| `cs` | hash | Current compute shader hash | |

::: warning
Shader hashes are 64-bit values stored as float32, which loses precision. Use only for existence checks, not exact comparisons.
:::

### Resource Slots

Resource slot parameters return resource handle or `-0.0` if unbound.

**Syntax:** `[stage]-[type][slot]`

**Stages:** `vs`, `hs`, `ds`, `gs`, `ps`, `cs`

**Types:**
- `t` - Shader Resource View (texture)
- `cb` - Constant Buffer
- `u` - Unordered Access View
- `s` - Sampler

**Example:**
```ini
; Check if texture slot 0 is bound
if ps-t0 !== -0.0
    ; Texture is bound
endif

; Save constant buffer reference
$saved_cb = vs-cb0
```

### Other Context

| Parameter | Type | Description | Reference |
|-----------|------|-------------|-----------|
| `active` | float | 1.0 if section is active, 0.0 if not | |
| `scissors_x` | float | Scissor rectangle left | |
| `scissors_y` | float | Scissor rectangle top | |
| `scissors_w` | float | Scissor rectangle width | |
| `scissors_h` | float | Scissor rectangle height | |

---

## IniParams

IniParams is a special parameter array accessible both in INI files and shaders.

### INI File Access

IniParams are indexed by number and component:

**Syntax:** `[xyzw][index]`

```ini
; Set IniParams[0].x = 1.0
x0 = 1.0

; Set IniParams[123].xyzw
x123 = 0.8
y123 = 1.0
z123 = 1.2
w123 = 2.0

; Use in expressions
$separation = x10 * 2.0
if y5 > 0.5
    z5 = 1.0
endif
```

**Valid Components:**
- `x[n]` - First component (.x) of IniParams[n]
- `y[n]` - Second component (.y) of IniParams[n]
- `z[n]` - Third component (.z) of IniParams[n]
- `w[n]` - Fourth component (.w) of IniParams[n]

**Range:**
- Index: 0 to 2147483647 (dynamically allocated)
- Component: x, y, z, w
- Value: float32

Reference: CommandList.cpp:2819-2886

### Shader Access

In HLSL shaders, IniParams is exposed as a Texture1D:

```hlsl
// Declare IniParams (usually at register t120)
Texture1D<float4> IniParams : register(t120);

// Define convenient names
#define OFFSET IniParams[123].x
#define SCALE IniParams[123].y
#define CONVERGENCE IniParams[123].z
#define SEPARATION IniParams[123].w

// Use in shader
float4 main(float4 pos : SV_Position) : SV_Target
{
    float adjusted = pos.x * SCALE + OFFSET;
    return float4(adjusted, 0, 0, 1);
}
```

**Binding:**
- Default register: `t120`
- Can be changed in [Rendering] section
- Automatically bound by 3dmigoto

Reference: IniHandler.cpp:1520-1640

---

## StereoParams

StereoParams provides stereo rendering information from the graphics driver.

### Shader Access

```hlsl
// Declare StereoParams (usually at register t125)
Texture2D<float4> StereoParams : register(t125);

// Components (from driver):
// StereoParams[0].x - Separation
// StereoParams[0].y - Convergence
// StereoParams[0].z - Eye (-1 for left, +1 for right)
```

**Binding:**
- Default register: `t125`
- Automatically bound by 3dmigoto
- Read-only (provided by driver)

Reference: HackerDevice.cpp (stereo handling)

---

## Variable Declaration

Variables must be declared before use with scope keywords.

### Global Variables

Declared in `[Constants]` section, accessible everywhere:

```ini
[Constants]
global $global_var = 0
global $screen_width = 1920
```

Reference: CommandList.cpp:363-379, IniHandler.cpp:2113-2132

### Persistent Variables

Saved to `d3dx_user.ini` across game sessions:

```ini
[Constants]
persist $user_setting = 1
persist $last_preset = 0
```

**Behavior:**
- Value saved when changed
- Restored on next game launch
- Stored in `d3dx_user.ini`

Reference: CommandList.cpp:363-379

### Local Variables

Scoped to command list or section:

```ini
[CommandListExample]
local $temp = 0
$temp = x0 + 5
y0 = $temp
```

**Scope:**
- Only visible within declaring command list
- Cannot be accessed from other sections
- Must be declared before use

Reference: CommandList.cpp:380-405

---

## Section Properties

### [Resource*] Properties

Define custom resources (textures, buffers).

#### File Loading

| Property | Type | Description | Reference |
|----------|------|-------------|-----------|
| `filename` | string | Path to file (relative to d3dx.ini) | CommandList.cpp:4271-4350 |

```ini
[ResourceMyTexture]
filename = Textures/MyTexture.dds
```

#### Resource Type

| Property | Values | Description | Reference |
|----------|--------|-------------|-----------|
| `type` | `Buffer`, `StructuredBuffer`, `Texture1D`, `Texture2D`, `Texture3D`, `TextureCube`, `Texture1DArray`, `Texture2DArray`, `Texture2DMS`, `Texture2DMSArray`, `TextureCubeArray` | Resource dimension | IniHandler.cpp:1703-1750 |

```ini
[ResourceMyBuffer]
type = Buffer
byte_width = 1024

[ResourceMyTexture]
type = Texture2D
width = 512
height = 512
```

#### Texture Dimensions

| Property | Type | Description | Reference |
|----------|------|-------------|-----------|
| `width` | integer | Texture width in pixels | IniHandler.cpp:1752-1760 |
| `height` | integer | Texture height in pixels | IniHandler.cpp:1762-1770 |
| `depth` | integer | Texture depth (for Texture3D) | IniHandler.cpp:1772-1780 |
| `width_multiply` | float | Width = render_target_width * multiplier | IniHandler.cpp:1752 |
| `height_multiply` | float | Height = render_target_height * multiplier | IniHandler.cpp:1762 |
| `mips` | integer | Mipmap count (0 = full chain) | IniHandler.cpp:1782-1790 |
| `array` | integer | Array size (for array textures) | IniHandler.cpp:1792-1800 |
| `msaa` | integer | MSAA sample count | IniHandler.cpp:1802-1810 |
| `msaa_quality` | integer | MSAA quality level | IniHandler.cpp:1812-1820 |

```ini
[ResourceRenderTarget]
type = Texture2D
width_multiply = 1.0
height_multiply = 1.0
format = R8G8B8A8_UNORM
bind_flags = render_target shader_resource
```

#### Buffer Properties

| Property | Type | Description | Reference |
|----------|------|-------------|-----------|
| `byte_width` | integer | Buffer size in bytes | IniHandler.cpp:1822-1830 |
| `stride` | integer | Structure size (for StructuredBuffer) | IniHandler.cpp:1832-1840 |

```ini
[ResourceMyBuffer]
type = StructuredBuffer
stride = 16
byte_width = 4096
```

#### Format

| Property | Type | Description | Reference |
|----------|------|-------------|-----------|
| `format` | DXGI_FORMAT | Pixel/element format | IniHandler.cpp:1842-1855 |

See [Resource - Formats](./resource.md#formats) for complete format list.

```ini
[ResourceDepth]
format = D24_UNORM_S8_UINT
```

#### Bind Flags

| Property | Values | Description | Reference |
|----------|--------|-------------|-----------|
| `bind_flags` | Space-separated list | How resource can be bound | IniHandler.cpp:1857-1865 |

**Values:** `vertex_buffer`, `index_buffer`, `constant_buffer`, `shader_resource`, `stream_output`, `render_target`, `depth_stencil`, `unordered_access`

```ini
[ResourceRT]
bind_flags = render_target shader_resource
```

See [Resource - Bind Flags](./resource.md#bind-flags) for details.

#### Misc Flags

| Property | Values | Description | Reference |
|----------|--------|-------------|-----------|
| `misc_flags` | Space-separated list | Resource creation flags | IniHandler.cpp:1867-1875 |

**Values:** `generate_mips`, `shared`, `texturecube`, `drawindirect_args`, `buffer_allow_raw_views`, `buffer_structured`, `resource_clamp`, `shared_keyedmutex`, `gdi_compatible`, `shared_nthandle`, `restricted_content`, `restrict_shared_resource`, `restrict_shared_resource_driver`, `guarded`, `tile_pool`, `tiled`, `hw_protected`

#### Initial Data

| Property | Type | Description | Reference |
|----------|------|-------------|-----------|
| `data` | hex string | Inline initial data | IniHandler.cpp:1510-1640 |

```ini
[ResourceData]
type = Buffer
byte_width = 16
format = R32_FLOAT
data = 3f800000 40000000 40400000 40800000
; Hex representation of floats: 1.0, 2.0, 3.0, 4.0
```

#### Performance

| Property | Type | Description | Reference |
|----------|------|-------------|-----------|
| `max_copies_per_frame` | integer | Limit copy operations per frame | CommandList.cpp:4133 |

---

### [TextureOverride*] Properties

Override texture resources based on hash or properties.

#### Matching

| Property | Type | Description | Reference |
|----------|------|-------------|-----------|
| `hash` | 8-digit hex | Texture hash to match | IniHandler.cpp:3218 |
| `match_type` | type name | Match resource dimension | IniHandler.cpp:2631-2907 |
| `match_width` | integer or expression | Match width | IniHandler.cpp:2631-2907 |
| `match_height` | integer or expression | Match height | IniHandler.cpp:2631-2907 |
| `match_depth` | integer or expression | Match depth | IniHandler.cpp:2631-2907 |
| `match_mips` | integer or expression | Match mipmap count | IniHandler.cpp:2631-2907 |
| `match_array` | integer or expression | Match array size | IniHandler.cpp:2631-2907 |
| `match_msaa` | integer or expression | Match MSAA sample count | IniHandler.cpp:2631-2907 |
| `match_msaa_quality` | integer or expression | Match MSAA quality | IniHandler.cpp:2631-2907 |
| `match_format` | format name | Match DXGI format | IniHandler.cpp:2631-2907 |
| `match_priority` | integer | Override priority (higher wins) | IniHandler.cpp:2918-2926 |

**Fuzzy Matching:**
```ini
[TextureOverrideRenderTarget]
match_type = Texture2D
match_width = 1920
match_height = 1080
match_format = R8G8B8A8_UNORM
ps-t0 = ResourceCustomRT
```

See [TextureOverride](./override.md#texture-override) for details.

#### Draw Call Context Matching

| Property | Type | Description | Reference |
|----------|------|-------------|-----------|
| `match_first_vertex` | integer or expression | Match first vertex index | ResourceHash.cpp:633-1257 |
| `match_first_index` | integer or expression | Match first index | ResourceHash.cpp:633-1257 |
| `match_base_vertex` | integer or expression | Match base vertex offset | ResourceHash.cpp:633-1257 |
| `match_first_instance` | integer or expression | Match first instance | ResourceHash.cpp:633-1257 |
| `match_vertex_count` | integer or expression | Match vertex count | ResourceHash.cpp:633-1257 |
| `match_index_count` | integer or expression | Match index count | ResourceHash.cpp:633-1257 |
| `match_instance_count` | integer or expression | Match instance count | ResourceHash.cpp:633-1257 |

#### Behavior Flags

| Property | Type | Description | Reference |
|----------|------|-------------|-----------|
| `filter_index` | integer | Value passed to shader for conditional logic | IniHandler.cpp:2267 |
| `iteration` | integer | Number of times to run draw call | IniHandler.cpp:2268 |
| `expand_region_copy` | boolean | Expand partial region copies to full | |
| `deny_cpu_read` | boolean | Prevent CPU from reading resource | |

---

### [ShaderOverride*] Properties

Override shaders based on hash.

| Property | Type | Description | Reference |
|----------|------|-------------|-----------|
| `hash` | 16-digit hex | Shader hash to match | IniHandler.cpp:2269 |
| `allow_duplicate_hash` | boolean | Allow multiple overrides for same hash | IniHandler.cpp:2191-2206 |
| `depth_filter` | value | Depth buffer filtering (deprecated) | IniHandler.cpp:2207 |
| `model` | shader_model | Override shader model | |
| `filter_index` | integer | Filter value for shader | IniHandler.cpp:2267 |

```ini
[ShaderOverride0123456789abcdef]
hash = 0123456789abcdef
handling = skip
run = CommandListMyShader
```

See [ShaderOverride](./override.md#shader-override) for details.

---

### [CustomShader*] Properties

Define custom shaders with pipeline state.

#### Shader Files

| Property | Type | Description | Reference |
|----------|------|-------------|-----------|
| `vs` | filename | Vertex shader file | CommandList.cpp:1768-1886 |
| `hs` | filename | Hull shader file | CommandList.cpp:1768-1886 |
| `ds` | filename | Domain shader file | CommandList.cpp:1768-1886 |
| `gs` | filename | Geometry shader file | CommandList.cpp:1768-1886 |
| `ps` | filename | Pixel shader file | CommandList.cpp:1768-1886 |
| `cs` | filename | Compute shader file | CommandList.cpp:1768-1886 |

#### Compilation

| Property | Type | Description | Reference |
|----------|------|-------------|-----------|
| `flags` | space-separated | D3DCompile flags | CommandList.cpp:1848-1864 |
| `entrypoint` | string | Shader entry point function name | |
| `target` | shader_model | Shader model (e.g., ps_5_0) | |

**Flags:** `debug`, `skip_validation`, `skip_optimization`, `pack_matrix_row_major`, `pack_matrix_column_major`, `partial_precision`, `force_vs_software_no_opt`, `force_ps_software_no_opt`, `no_preshader`, `avoid_flow_control`, `prefer_flow_control`, `enable_strictness`, `enable_backwards_compatibility`, `ieee_strictness`, `optimization_level0`, `optimization_level1`, `optimization_level2`, `optimization_level3`, `warnings_are_errors`, `resources_may_alias`, `enable_unbounded_descriptor_tables`, `all_resources_bound`

See [Custom Shader](./custom-shader.md) for complete reference.

#### Performance

| Property | Type | Description | Reference |
|----------|------|-------------|-----------|
| `max_executions_per_frame` | integer | Limit executions per frame | CommandList.cpp:1925 |

---

### [Hunting] Properties

Control hunting mode behavior.

| Property | Type | Description | Reference |
|----------|------|-------------|-----------|
| `hunting` | 0/1/2 | Hunting mode (0=off, 1=soft, 2=on) | IniHandler.cpp:4394 |
| `marking_mode` | mode | How marked shaders display | IniHandler.cpp:4396 |
| `marking_actions` | space-separated | Actions when marking | IniHandler.cpp:4395 |
| `verbose_overlay` | boolean | Show detailed overlay | IniHandler.cpp:4447 |
| `export_shaders` | boolean | Auto-export encountered shaders | IniHandler.cpp:4306 |
| `export_hlsl` | 0/1/2/3 | HLSL export level | IniHandler.cpp:4307 |
| `export_binary` | boolean | Export .bin files | IniHandler.cpp:4308 |
| `dump_usage` | boolean | Generate ShaderUsage.txt | IniHandler.cpp:4310 |

See [Debugging - Hunting](./debugging.md#hunting-mode) for details.

---

### [Logging] Properties

Control logging behavior.

| Property | Type | Description | Reference |
|----------|------|-------------|-----------|
| `calls` | boolean | Enable logging to d3d11_log.txt | IniHandler.cpp:4122 |
| `debug` | boolean | Enable debug-level logging | IniHandler.cpp:4144 |
| `input` | boolean | Log input events | IniHandler.cpp:4143 |
| `unbuffered` | boolean | Unbuffered logging | IniHandler.cpp:4148 |
| `show_warnings` | boolean | Show warnings on screen | IniHandler.cpp:4183 |
| `force_cpu_affinity` | boolean | Set CPU affinity | IniHandler.cpp:4154 |
| `crash` | boolean | Install crash handler | IniHandler.cpp:4174 |
| `debug_locks` | boolean | Enable deadlock detection | IniHandler.cpp:4180 |
| `waitfordebugger` | 0/1/2 | Wait for debugger | IniHandler.cpp:4163 |

See [Debugging - Logging](./debugging.md#logging-configuration) for details.

---

## Command List Commands

Commands used within command list sections (TextureOverride, ShaderOverride, CommandList, Present, etc.).

### Resource Operations

**Syntax:** `[target] = [source] [modifiers]`

```ini
; Copy resource
ps-t0 = ResourceMyTexture

; Reference resource (no copy)
ps-t1 = ref ResourceOther

; Conditional copy
ps-t2 = unless_null ResourceMaybe

; Copy from caller's bound resource
ps-t3 = from_caller ps-t3
```

**Targets:**
- Shader resource slots: `vs-t#`, `ps-t#`, `cs-t#`, etc.
- Constant buffer slots: `vs-cb#`, `ps-cb#`, etc.
- Unordered access slots: `cs-u#`, `ps-u#`
- Vertex buffers: `vb#`
- Index buffer: `ib`
- Render targets: `o#`, `o0-o7`
- Depth/stencil: `oD`

**Sources:**
- Resource name: `ResourceMyTexture`
- Caller resource: `ps-t0`, `vs-cb1`, etc.
- `null` - Unbind slot
- Special values: `stereo2mono`, `mono2stereo`

**Modifiers:** `copy`, `ref`, `unless_null`, `copy_desc`, `mono`, `set_viewport`, `no_view_cache`, `raw`

See [Command List](./command-list.md) and [Modifiers](./modifiers.md) for complete reference.

### Variable Assignment

```ini
; Assign value
$variable = expression

; IniParams assignment
x0 = 1.0
y10 = x10 + 5.0

; Expressions
$result = (x0 + y0) * 2.0
```

### Control Flow

```ini
if condition
    ; commands
else if condition2
    ; commands
else
    ; commands
endif
```

See [Control Flow](./control-flow.md) for details.

### Execution Commands

| Command | Description | Reference |
|---------|-------------|-----------|
| `run = CustomShader/CommandList [modifiers]` | Execute shader or command list | CommandList.cpp:4929-4960 |
| `checktextureoverride = target` | Check texture override | CommandList.cpp:7469-7578 |
| `handling = skip/abort` | Control draw call handling | |
| `preset = PresetName` | Activate preset | |
| `draw/drawindexed/...` | Drawing commands | |
| `clear = target values` | Clear resource | |

See [Command List](./command-list.md) for complete command reference.

---

## See Also

- [Expressions](./expressions.md) - Expression syntax and operators
- [Operators](./operators.md) - Operator reference
- [Constants](./constants.md) - Constant definitions
- [Namespace](./namespace.md) - Variable scopes
- [Command List](./command-list.md) - Command reference
- [Resource](./resource.md) - Resource properties and formats
- [Custom Shader](./custom-shader.md) - Custom shader properties
- [Debugging](./debugging.md) - Hunting and logging options
