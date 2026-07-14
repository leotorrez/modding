# Debugging

This page covers debugging techniques and tools available in 3dmigoto, including hunting mode, frame analysis, overlay system, and shader debugging.

## Hunting Mode

Hunting mode allows you to identify and isolate shaders, textures, and other resources in real-time by cycling through them while the game is running.

### Enabling Hunting

Add to d3dx.ini:
```ini
[Hunting]
hunting = 2

; Optional: Start hunting paused
hunting = 1  ; Will be enabled on first key press
```

**Hunting States:**
- `hunting = 0` - Disabled (default)
- `hunting = 1` - Enabled but starts soft-disabled (paused)
- `hunting = 2` - Fully enabled at game start

Reference: globals.h:30-34

### Hunting Workflow

1. **Enable hunting** - Start game with `hunting = 2`
2. **Cycle through resources** - Use configured keys to cycle shaders/buffers
3. **Mark resources** - Press marking key to identify important resources
4. **Export marked** - Marked resources are exported to ShaderFixes directory
5. **Edit and reload** - Modify exported shaders and reload in-game

### Marking Actions

When you mark a shader or resource, multiple actions can occur simultaneously:

```ini
[Hunting]
marking_actions = clipboard hlsl asm mono_ss
```

**Available Actions:**

| Action | Description |
|--------|-------------|
| `clipboard` | Copy hash to system clipboard |
| `hlsl` | Export HLSL decompilation (if possible) |
| `asm` | Export shader assembly (.txt file) |
| `regex` | Apply ShaderRegex patterns during export |
| `mono_ss` | Take mono screenshot to ShaderFixes directory |
| `ss_if_pink` | Take screenshot only if shader rendered pink |

Reference: globals.h:52-75

### Marking Modes

Control how marked shaders are displayed:

```ini
[Hunting]
marking_mode = pink
```

**Available Modes:**

| Mode | Description |
|------|-------------|
| `skip` | Don't render marked shader (makes it invisible) |
| `original` | Use original unmodified shader |
| `pink` | Render in bright pink for easy visibility (default) |
| `mono` | Force mono rendering (disable stereo effects) |

Reference: globals.h:36-50

### Hunting Keys

Example key configuration:
```ini
[Key1]
Key = VK_F3
type = cycle
back = VK_SHIFT
target = PixelShader

[Key2]
Key = VK_F4
type = cycle
back = VK_SHIFT
target = VertexShader

[Key3]
Key = VK_F5
type = mark_clipboard
```

**Supported Targets:**
- `PixelShader` / `VertexShader` / `ComputeShader`
- `GeometryShader` / `DomainShader` / `HullShader`
- `IndexBuffer` / `VertexBuffer`
- `RenderTarget` / `DepthTarget`

See [Key](./key.md) for complete key configuration reference.

### Verbose Overlay

Show detailed hunting information on screen:

```ini
[Hunting]
verbose_overlay = true
```

**Shows:**
- Currently selected shader hash
- Position in visited shader list
- All visited shaders (not just selected)
- Index/vertex buffer statistics
- Render target information

Reference: globals.h:446, Overlay.cpp:634-650

---

## Frame Analysis

Frame analysis captures a complete snapshot of a single frame, including all draw calls, shaders, textures, buffers, and pipeline state.

### Enabling Frame Analysis

```ini
[Hunting]
hunting = 2

[KeyFrameAnalysis]
Key = VK_F8
type = hold
analyse_options = dump_rt dump_tex dump_cb dump_vb dump_ib
```

**Workflow:**
1. Enable hunting mode
2. Press and hold frame analysis key
3. Analysis runs continuously while key held
4. Release key to stop
5. Check FrameAnalysis-YYYY-MM-DD-HHMMSS directory

### Frame Analysis Options

Options control what data is captured:

```ini
[KeyFrameAnalysis]
analyse_options = dump_rt dump_depth dump_tex dump_cb dump_vb dump_ib
```

**Resource Selection:**

| Option | Description |
|--------|-------------|
| `dump_rt` | Dump render targets |
| `dump_depth` | Dump depth/stencil buffers |
| `dump_tex` (or `dump_srv`) | Dump shader resource views (textures) |
| `dump_cb` | Dump constant buffers |
| `dump_vb` | Dump vertex buffers |
| `dump_ib` | Dump index buffers |

Reference: globals.h:135-239

**Format Selection:**

| Option | Description |
|--------|-------------|
| `dump_rt_dds` | Render targets as DDS |
| `dump_rt_jps` | Render targets as JPS (stereo JPEG) |
| `dump_tex_dds` | Textures as DDS |
| `dump_tex_jps` | Textures as JPS |
| `dump_cb_txt` | Constant buffers as formatted text |
| `dump_vb_txt` | Vertex buffers as formatted text |
| `dump_ib_txt` | Index buffers as formatted text |
| `buf_bin` | Buffers as raw binary |

**Misc Options:**

| Option | Description |
|--------|-------------|
| `filename_reg` | Include register number in filename |
| `filename_handle` | Include resource handle in filename |
| `clear_rt` | Clear render targets before dump |
| `mono` | Force mono (non-stereo) mode |
| `persist` | Keep analysis active across frames |
| `hold` | Hold analysis active while key pressed |

### Frame Analysis Output

**Directory Structure:**
```
FrameAnalysis-YYYY-MM-DD-HHMMSS/
├── log.txt                    # Main analysis log
├── log-0x[address].txt        # Deferred context logs (if any)
├── 000000-ib=000001-dxbc...bin # Index buffer
├── 000001-vb0=000002-...txt    # Vertex buffer (text format)
├── 000002-ps-cb0-...txt        # Pixel shader constant buffer
├── 000003-ps-t0=...dds         # Pixel shader texture
├── 000004-o0=...dds            # Render target output
└── ...
```

**Filename Format:**
```
[draw_call]-[type][register]=[handle]-[hash].[ext]
```

- `draw_call` - Sequential draw call number (6 digits)
- `type` - Resource type (vb, ib, cb, ps-t, vs-cb, o, oD, etc.)
- `register` - Bind point (vb0, t0, cb2, etc.)
- `handle` - Resource handle (optional, with `filename_handle`)
- `hash` - Resource hash
- `ext` - File extension (dds, txt, buf, bin)

### Frame Analysis Log Format

**log.txt structure:**
```
000001 Draw(...)
000001 VS: hash=0123456789abcdef
000001 PS: hash=fedcba9876543210
000001 VB[0]: stride=32 offset=0 buf=000002
000001 IB: format=DXGI_FORMAT_R16_UINT buf=000001
000001 PS-CB0: buf=000003
000001 PS-T0: view=000004 res=000005 hash=12345678
000001 OM-RT0: view=000006 res=000007 hash=87654321
```

Reference: FrameAnalysis.h:101, FrameAnalysis.cpp:77-99

### Deferred Context Analysis

Games using deferred contexts create separate log files:
- **Immediate Context:** `log.txt`
- **Deferred Contexts:** `log-0x[address].txt`

Enable deferred context dumping:
```ini
[Hunting]
analyse_options = dump_rt dump_on_unmap dump_on_update
dump_on_unmap = true
dump_on_update = true
```

Reference: globals.h:451-456

### Frame Analysis Hold Mode

Continuously analyze frames while key is held:

```ini
[KeyFrameAnalysis]
analyse_options = hold dump_rt dump_tex
```

**Behavior:**
- Analysis starts when key pressed
- Continues every frame while key held
- Stops when key released
- Each frame gets unique directory

Reference: globals.h:451-456

---

## Overlay System

3dmigoto displays messages on-screen for errors, warnings, and informational messages.

### Log Levels

Messages are color-coded by severity:

| Level | Color | Duration | Description |
|-------|-------|----------|-------------|
| `LOG_DIRE` | Red | 20 seconds | Critical errors |
| `LOG_WARNING` | OrangeRed | 10 seconds | Warnings |
| `LOG_NOTICE` | Orange | 5 seconds | Notices |
| `LOG_INFO` | LimeGreen | 2 seconds | Info messages |

Reference: Overlay.h:20-28

### Overlay Control

```ini
[Logging]
; Show warnings on screen (errors always shown)
show_warnings = 1

[Hunting]
; Hide overlay completely
suppress_overlay = 1

; Show verbose hunting info
verbose_overlay = 1
```

Reference: globals.h:446-447

---

## Shader Debugging

### Shader Export

Export shaders during hunting:

```ini
[Hunting]
; Export shaders automatically when encountered
export_shaders = 1

; HLSL decompilation level
export_hlsl = 3
; 0 = off
; 1 = HLSL only
; 2 = HLSL + original assembly
; 3 = HLSL + original + recompiled assembly

; Export binary .bin files
export_binary = 1
```

Reference: globals.h:460-461, IniHandler.cpp:4306-4310

### Shader Dump Locations

**ShaderFixes Directory:**
```
ShaderFixes/
├── [hash]-ps.txt          # Pixel shader assembly
├── [hash]-ps.hlsl         # Pixel shader HLSL (if export_hlsl > 0)
├── [hash]-ps.bin          # Pixel shader binary (if export_binary=1)
├── [hash]-vs.txt          # Vertex shader assembly
└── ...
```

**Shader Type Suffixes:**
- `-ps` - Pixel Shader
- `-vs` - Vertex Shader
- `-cs` - Compute Shader
- `-gs` - Geometry Shader
- `-ds` - Domain Shader
- `-hs` - Hull Shader

Reference: Hunting.cpp:974-1090

### Shader Reload

Modify exported shaders and reload in-game:

```ini
[KeyReload]
Key = VK_F10
type = reload
```

**Workflow:**
1. Mark shader (exports to ShaderFixes)
2. Edit .txt file in text editor
3. Save changes
4. Press reload key
5. Shader recompiles and reloads instantly

**Common Edits:**
- Comment out instructions with `//`
- Change constant values
- Modify texture sampling
- Add debug output

See [Custom Shaders](./custom-shader.md) for shader syntax.

### ShaderUsage.txt

Track resource usage and shader relationships:

```ini
[Hunting]
dump_usage = 1
```

Creates `ShaderFixes/ShaderUsage.txt` containing:
- Resource hash contamination tracking
- Shader peer relationships (VS+PS+GS combinations)
- Render target and depth target associations
- Resource binding information

Reference: globals.h:469, Hunting.cpp:22-255

---

## Logging Configuration

Control what 3dmigoto logs to d3d11_log.txt:

```ini
[Logging]
; Enable logging to d3d11_log.txt
calls = 1

; Enable debug-level logging (verbose)
debug = 1

; Log input events (keyboard/mouse)
input = 1

; Unbuffered logging (slower but real-time)
unbuffered = 1

; Show warnings on screen
show_warnings = 1
```

### Logging Options

| Option | Description |
|--------|-------------|
| `calls` | Enable/disable logging to d3d11_log.txt |
| `debug` | Enable verbose debug logging |
| `input` | Log keyboard and mouse input events |
| `unbuffered` | Write to log immediately (slower but safer) |
| `show_warnings` | Display warnings on screen |
| `force_cpu_affinity` | Set CPU affinity for debugging |
| `crash` | Install crash handler |
| `debug_locks` | Enable deadlock detection |

Reference: IniHandler.cpp:4120-4183

### Log File Location

**Default:** `d3d11_log.txt` in 3dmigoto directory (same location as d3dx.ini)

Reference: IniHandler.cpp:4114

### Debug Mode

Debug mode enables more verbose logging:

```ini
[Logging]
debug = 1
```

**Additional output:**
- Detailed DirectX API calls
- Resource creation/destruction
- Shader compilation details
- Command list execution traces
- Internal state changes

Reference: D3D11Wrapper.cpp:38, log.h:11

---

## Advanced Debugging

### Wait for Debugger

Pause 3dmigoto startup to attach debugger:

```ini
[Logging]
waitfordebugger = 1
; 0 = don't wait
; 1 = wait for debugger attachment
; 2 = wait and break immediately
```

Reference: IniHandler.cpp:4163-4172

### CPU Affinity

Force specific CPU core for consistent timing:

```ini
[Logging]
force_cpu_affinity = 1
```

Reference: IniHandler.cpp:4154-4160

### Lock Debugging

Detect potential deadlocks in multi-threaded scenarios:

```ini
[Logging]
debug_locks = 1
```

**Warnings shown:**
```
Potential deadlock scenario detected: Lock A taken after Lock B
```

Reference: IniHandler.cpp:4180-4181, lock.cpp:282

### Crash Handler

Install crash handler for better crash reporting:

```ini
[Logging]
crash = 1
```

Reference: IniHandler.cpp:4174-4176

---

## Profiling

### Profiling Mode

Enable performance profiling:

```ini
[Profiling]
mode = summary
; Modes: none, summary, top_command_lists, top_commands
```

**Profiling Modes:**

| Mode | Description |
|------|-------------|
| `none` | No profiling (default) |
| `summary` | Overall performance summary |
| `top_command_lists` | Top command list performance |
| `top_commands` | Individual command performance |

Reference: profiling.h:7-15

---

## NVIDIA Driver Profiles

### Dump Profiles

Export NVIDIA driver profile settings:

```ini
[Logging]
dump_all_profiles = 1
```

**Output:** All NVIDIA driver profiles written to log

Reference: globals.h:404, nvprofile.cpp:766-1017

---

## Best Practices

### Effective Hunting

1. **Start broad** - Use pink marking to identify shader quickly
2. **Narrow down** - Cycle through shaders to find exact one
3. **Mark early** - Mark shaders as soon as identified
4. **Test edits** - Make small changes and reload frequently
5. **Document hashes** - Keep notes of important shader hashes

### Frame Analysis Tips

1. **Capture selectively** - Only dump needed resources to save time/space
2. **Use hold mode** - Analyze multiple frames to see changes
3. **Check log first** - Review log.txt before diving into dumps
4. **Enable filename_reg** - Makes dumps easier to correlate with log
5. **Use deduplication** - Enable for repeated resources

### Debugging Crashes

1. **Enable crash handler** - `crash = 1` in [Logging]
2. **Enable unbuffered logging** - `unbuffered = 1` to catch crashes
3. **Check event viewer** - Windows Event Viewer for driver crashes
4. **Test with minimal config** - Disable mods one by one
5. **Review d3d11_log.txt** - Look for errors before crash

### Performance Debugging

1. **Enable profiling** - Use profiling mode to identify bottlenecks
2. **Test without hunting** - Hunting has performance overhead
3. **Limit frame analysis** - Only dump needed resources
4. **Disable debug logging** - `debug = 0` for normal play
5. **Check command list recursion** - Circular references cause slowdown

---
