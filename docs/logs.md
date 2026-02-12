# Logs

This page documents the log file formats, output patterns, and how to interpret 3dmigoto log files.

## Log Files

3dmigoto creates several log files depending on configuration:

| File | Purpose | Location |
|------|---------|----------|
| `d3d11_log.txt` | Main log file | 3dmigoto directory |
| `log.txt` | Frame analysis log (immediate context) | FrameAnalysis-* directory |
| `log-0x[address].txt` | Frame analysis log (deferred context) | FrameAnalysis-* directory |
| `ShaderUsage.txt` | Resource usage tracking | ShaderFixes directory |

---

## d3d11_log.txt

Main log file containing initialization, errors, warnings, and debug information.

### Enabling Logging

```ini
[Logging]
calls = 1      ; Enable logging
debug = 1      ; Enable debug-level messages
unbuffered = 1 ; Write immediately (safer for crashes)
```

Reference: IniHandler.cpp:4120-4151

### Log Format

**General Pattern:**
```
[Timestamp] Level: Message
```

**Example Log Entries:**
```
[2024-02-10 15:23:45] INFO: 3DMigoto v1.3.16 starting
[2024-02-10 15:23:45] INFO: Loaded d3dx.ini
[2024-02-10 15:23:45] DEBUG: CreateDevice called
[2024-02-10 15:23:46] WARNING: Duplicate ShaderOverride hash=0123456789abcdef
[2024-02-10 15:23:47] ERROR: Error compiling custom shader CustomPS.hlsl
```

### Log Levels

| Level | Description | When Logged |
|-------|-------------|-------------|
| `INFO` | Informational messages | Always (if calls=1) |
| `DEBUG` | Debug details | Only if debug=1 |
| `WARNING` | Warnings | Always (if calls=1) |
| `ERROR` | Errors | Always (if calls=1) |
| `DIRE` | Critical errors | Always (if calls=1) |

Reference: log.h:19-43

### Startup Section

**Initialization messages:**
```
3DMigoto v1.3.16 starting
Windows version: Windows 10
DirectX version: 11.0
Loaded d3dx.ini
Processing [Logging] section
Processing [System] section
Processing [Device] section
...
```

**Configuration loading:**
```
[Logging] calls = 1
[Logging] debug = 1
[Hunting] hunting = 2
[Present] present = post
...
```

### Shader Compilation

**Successful compilation:**
```
Compiling custom shader: CustomPS.hlsl
Shader compiled successfully: CustomPS.hlsl
Shader hash: 0123456789abcdef
```

**Compilation errors:**
```
Error compiling custom shader CustomPS.hlsl
~~~~~~~~~~~~~~~~~~~~~~~~~~~~ HLSL errors ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CustomPS.hlsl(12,5): error X3004: undeclared identifier 'invalidVar'
CustomPS.hlsl(15,10): error X3013: 'main': no function signature found
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

Reference: HackerDevice.cpp:1025, CommandList.cpp:1904

### Resource Loading

**Texture loading:**
```
Loading custom texture: MyTexture.dds
Loaded texture: MyTexture.dds (2048x2048, BC7)
Created Texture2D: MyTexture.dds
Created ShaderResourceView for MyTexture
```

**Resource errors:**
```
Failed to load custom texture resource MyTexture.dds: 0x80070002
Out of memory loading LargeTexture.dds
Resource copy failed CopyResource: 0x80070057
```

Reference: CommandList.cpp:4136, 4271, 4350

### INI Parsing Warnings

**Duplicate sections:**
```
Duplicate section found
 - [ShaderOverride0123456789abcdef]
```

**Parse errors:**
```
Floating point parse error: x=invalid_number
 - [Constants] @ [C:\Game\d3dx.ini]

Hash parse error: hash=INVALID
 - [ShaderOverride] @ [C:\Game\d3dx.ini]
```

Reference: IniHandler.cpp:415, 1005, 1094

### Mod Conflicts

**Duplicate overrides:**
```
Possible Mod Conflict: Duplicate ShaderOverride hash=0123456789abcdef
 - First defined: C:\Game\ModA.ini
 - Overridden by: C:\Game\ModB.ini
```

**Configuration conflicts:**
```
Detected a conflicting d3dx.ini in the game directory that is not being used.
 - Using: C:\Game\3dmigoto\d3dx.ini
 - Conflicting: C:\Game\d3dx.ini
```

Reference: IniHandler.cpp:2194, 3139, 4096

### Debug Mode Output

When `debug = 1`, additional details are logged:

**DirectX API calls:**
```
DEBUG: CreateTexture2D called
DEBUG:   Width: 1024, Height: 1024
DEBUG:   Format: DXGI_FORMAT_R8G8B8A8_UNORM
DEBUG:   MipLevels: 1, ArraySize: 1
DEBUG:   BindFlags: SHADER_RESOURCE
DEBUG: CreateTexture2D succeeded: handle=0x12345678
```

**Command list execution:**
```
DEBUG: Executing command list [CommandListPresent]
DEBUG:   Command: if $var == 1
DEBUG:   Condition evaluated: true
DEBUG:   Command: Resource\MyTexture = ref ps-t0
DEBUG:   Command: ps-t5 = Resource\MyTexture
DEBUG: Command list execution complete
```

**Shader override application:**
```
DEBUG: ShaderOverride matched: hash=0123456789abcdef
DEBUG:   Running command list: [ShaderOverride0123456789abcdef]
DEBUG:   Handling: SKIP
DEBUG:   Shader skipped
```

Reference: log.h:11, D3D11Wrapper.cpp:38

---

## Frame Analysis Logs

Frame analysis creates detailed logs of draw calls and pipeline state.

### log.txt Format

**Structure:**
```
[draw_call] [operation] [parameters]
[draw_call] [pipeline_state]
```

**Example:**
```
000000 Draw(36, 0)
000000 VS: hash=0123456789abcdef
000000 PS: hash=fedcba9876543210
000000 VB[0]: stride=32 offset=0 buf=000001
000000 IB: format=DXGI_FORMAT_R16_UINT buf=000002
000000 PS-CB0: buf=000003
000000 PS-T0: view=000004 res=000005 hash=12345678
000000 OM-RT0: view=000006 res=000007 hash=87654321

000001 DrawIndexed(1024, 0, 0)
000001 VS: hash=abcdef0123456789
000001 PS: hash=0987654321fedcba
...
```

Reference: FrameAnalysis.h:101, FrameAnalysis.cpp:77-99

### Draw Call Numbers

Six-digit sequential numbers:
```
000000 - First draw call
000001 - Second draw call
000042 - 43rd draw call
012345 - 12,346th draw call
```

### Operation Types

**Draw Operations:**
```
000000 Draw(vertexCount, startVertex)
000001 DrawIndexed(indexCount, startIndex, baseVertex)
000002 DrawInstanced(vertexCountPerInstance, instanceCount, startVertex, startInstance)
000003 DrawIndexedInstanced(indexCountPerInstance, instanceCount, startIndex, baseVertex, startInstance)
000004 DrawInstancedIndirect(bufferOffset)
000005 DrawIndexedInstancedIndirect(bufferOffset)
```

**Compute Operations:**
```
000006 Dispatch(threadGroupCountX, threadGroupCountY, threadGroupCountZ)
000007 DispatchIndirect(bufferOffset)
```

See [Draw Calls](./draw-calls.md) for complete reference.

### Pipeline State

**Shader Stages:**
```
000000 VS: hash=0123456789abcdef    # Vertex Shader
000000 HS: hash=...                  # Hull Shader
000000 DS: hash=...                  # Domain Shader
000000 GS: hash=...                  # Geometry Shader
000000 PS: hash=fedcba9876543210    # Pixel Shader
000000 CS: hash=...                  # Compute Shader
```

**Vertex Buffers:**
```
000000 VB[0]: stride=32 offset=0 buf=000001
000000 VB[1]: stride=16 offset=0 buf=000002
```
- `VB[n]` - Vertex buffer slot
- `stride` - Bytes per vertex
- `offset` - Offset into buffer
- `buf` - Buffer handle/ID

**Index Buffer:**
```
000000 IB: format=DXGI_FORMAT_R16_UINT buf=000002
000000 IB: format=DXGI_FORMAT_R32_UINT buf=000003
```
- `DXGI_FORMAT_R16_UINT` - 16-bit indices
- `DXGI_FORMAT_R32_UINT` - 32-bit indices

**Constant Buffers:**
```
000000 VS-CB0: buf=000004
000000 VS-CB1: buf=000005
000000 PS-CB0: buf=000003
000000 PS-CB2: buf=000006
```
- Format: `[stage]-CB[slot]`
- Stages: VS, HS, DS, GS, PS, CS

**Shader Resources (Textures):**
```
000000 PS-T0: view=000007 res=000008 hash=12345678
000000 PS-T1: view=000009 res=000010 hash=87654321
```
- `view` - Shader resource view handle
- `res` - Underlying resource handle
- `hash` - Texture hash (8-digit hex)

**Unordered Access Views:**
```
000000 CS-U0: view=000011 res=000012
000000 PS-U1: view=000013 res=000014
```

**Render Targets:**
```
000000 OM-RT0: view=000015 res=000016 hash=11111111
000000 OM-RT1: view=000017 res=000018 hash=22222222
```
- `OM-RT[n]` - Output Merger Render Target slot

**Depth/Stencil:**
```
000000 OM-DS: view=000019 res=000020 hash=33333333
```
- `OM-DS` - Output Merger Depth/Stencil

### Deferred Context Logs

Games using deferred contexts create separate logs:
```
log.txt              # Immediate context
log-0x12345678.txt   # Deferred context 1
log-0xabcdef00.txt   # Deferred context 2
```

**Identifying Context:**
- Filename includes context address
- Each context has independent draw call numbering
- Deferred contexts execute command lists in parallel

Reference: FrameAnalysis.h:101

---

## ShaderUsage.txt

Tracks resource usage and shader relationships when `dump_usage = 1`.

### Enabling ShaderUsage

```ini
[Hunting]
dump_usage = 1
```

Reference: globals.h:469, IniHandler.cpp:4310

### File Location

`ShaderFixes/ShaderUsage.txt`

### Format

**Resource Entries:**
```
Resource Hash: 12345678
  Dimensions: 1920x1080
  Format: DXGI_FORMAT_R8G8B8A8_UNORM
  Used by Pixel Shaders:
    0123456789abcdef
    fedcba9876543210
  Contamination: Update (copy from unknown source)
  Update Regions: Full
```

**Shader Peer Relationships:**
```
Vertex Shader: 0123456789abcdef
  Paired with Pixel Shaders:
    fedcba9876543210 (100 draws)
    abcdef0123456789 (50 draws)
  Render Targets:
    12345678 (150 draws)
  Depth Targets:
    87654321 (150 draws)
```

**Hash Contamination:**
```
Contamination: Copy
  Source: unknown (copied from backbuffer or external resource)
  
Contamination: Update
  Updated via UpdateSubresource or Map/Unmap
  Hash may not be stable across frames

Contamination: Region
  Partial updates detected
  Hash covers full resource but only regions updated
```

### Interpreting ShaderUsage

**Finding Related Shaders:**
1. Look up texture hash
2. See which shaders use it
3. Check peer relationships
4. Identify shader combinations

**Understanding Contamination:**
- **Clean hash** - Resource loaded from file, hash stable
- **Copy contamination** - Copied from dynamic source, hash may change
- **Update contamination** - Modified at runtime, hash unstable
- **Region contamination** - Partial updates, hash may not reflect state

Reference: Hunting.cpp:22-255

---

## NVIDIA Profile Logs

When `dump_all_profiles = 1`, NVIDIA driver profiles are logged.

### Format

```
Profile: [Application Name]
  Setting ID: 0x12345678
  Setting Name: AAMode
  Value: 0x00000002
  
  Setting ID: 0x87654321
  Setting Name: Anisotropic Filtering
  Value: 0x00000001
```

Reference: nvprofile.cpp:766-1017

---

## Reading Logs Effectively

### Finding Errors

Search for keywords:
```
ERROR
FAILED
BUG
WARNING
Duplicate
Conflict
```

### Correlating with Game Behavior

1. **Note timestamp** - When issue occurred
2. **Find corresponding log entries** - Search around that time
3. **Check preceding entries** - What happened before error
4. **Look for patterns** - Does it repeat

### Understanding Draw Calls

**Frame analysis log correlation:**
1. Find draw call with visual issue (note number, e.g., 000042)
2. Look up 000042 in log.txt
3. Check shaders: VS and PS hashes
4. Check inputs: VB, IB, CB, T (textures)
5. Check outputs: OM-RT, OM-DS

**Example analysis:**
```
000042 DrawIndexed(1024, 0, 0)
000042 VS: hash=0123456789abcdef
000042 PS: hash=fedcba9876543210
000042 PS-T0: view=000007 res=000008 hash=12345678
000042 OM-RT0: view=000015 res=000016 hash=11111111
```

**What this tells you:**
- Draw call 42 draws 1024 indexed vertices
- Uses vertex shader 0123456789abcdef
- Uses pixel shader fedcba9876543210
- Pixel shader reads texture 12345678 from slot 0
- Renders to render target 11111111

### Debugging Mod Conflicts

**Steps:**
1. Search log for "Possible Mod Conflict"
2. Note which sections conflict
3. Check INI file load order (alphabetical)
4. Determine which mod should have priority
5. Rename INI files to control order or merge sections

**Example:**
```
Possible Mod Conflict: Duplicate ShaderOverride hash=0123456789abcdef
 - First defined: ModA.ini
 - Overridden by: ModB.ini
```

**Resolution:**
- If ModA should win: rename `ModA.ini` to `ZZ_ModA.ini` (loads last)
- If ModB should win: keep as-is
- If both needed: merge into one section in separate file

### Tracking Resource Flow

**Using frame analysis:**
1. Find texture hash in log (e.g., `hash=12345678`)
2. Search all occurrences: `grep "12345678" log.txt`
3. See which draw calls use it
4. See which slots it's bound to (PS-T0, PS-T1, etc.)
5. See if it's also used as render target (OM-RT)

**Resource reuse example:**
```
000010 PS-T0: hash=12345678      # Used as input
...
000050 OM-RT0: hash=12345678     # Used as output
...
000100 PS-T1: hash=12345678      # Used as input again
```

---

## Log File Management

### Log File Size

Logs can grow large with `debug = 1`:
- Normal logging: ~1-10 MB
- Debug logging: ~100-500 MB
- Frame analysis: ~10-100 MB per frame

### Clearing Logs

Logs are overwritten on each game launch:
- `d3d11_log.txt` - Cleared on startup
- Frame analysis - New directory each time
- `ShaderUsage.txt` - Appended to (can grow large)

### Archiving Logs

For bug reports or analysis:
```
1. Complete full run with issue
2. Copy d3d11_log.txt immediately
3. Copy relevant FrameAnalysis directory
4. Rename with descriptive name:
   - d3d11_log_crash_2024-02-10.txt
   - FrameAnalysis_glitch_character
```

---

## Best Practices

### Logging for Development

```ini
[Logging]
calls = 1
debug = 1
unbuffered = 1  ; Safer for crashes
show_warnings = 1
```

### Logging for Release

```ini
[Logging]
calls = 1
debug = 0       ; Reduce overhead
unbuffered = 0  ; Better performance
show_warnings = 1
```

### Frame Analysis Efficiency

1. **Dump only needed resources** - Don't dump everything
2. **Use short captures** - Hold key for 1-2 frames only
3. **Enable filename_reg** - Easier correlation with log
4. **Check log first** - Verify draw call before opening dumps

### Log Analysis Workflow

1. **Reproduce issue** with logging enabled
2. **Note exact moment** issue occurs
3. **Check d3d11_log.txt** for errors around that time
4. **Run frame analysis** during issue
5. **Correlate log.txt** with visual problem
6. **Identify resources** involved (shaders, textures, buffers)
7. **Hunt and modify** identified resources

---
