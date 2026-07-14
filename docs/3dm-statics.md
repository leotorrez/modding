# Static Analysis Tools

3dmigoto includes several static analysis tools for offline shader inspection, decompilation, disassembly, and assembly. These tools allow you to analyze shaders without running the game and automate shader processing workflows.

## Overview

**Static analysis** refers to examining shaders and resources offline (not at runtime). 3dmigoto provides command-line tools and libraries for:

- **Decompiling** binary shaders to HLSL source code
- **Disassembling** binary shaders to assembly text
- **Assembling** assembly text back to binary shaders
- **Validating** shader conversions (round-trip testing)
- **Calculating hashes** for shader identification
- **Parsing signatures** and reflection information

These tools complement the runtime frame analysis system and enable automated processing of large shader collections.

## cmd_Decompiler

The primary static analysis tool for 3dmigoto.

**Location:** `cmd_Decompiler.exe` in the 3dmigoto distribution (x64/Release/)

Reference: `HLSLDecompiler/cmd_Decompiler/cmd_Decompiler.cpp`

### Basic Usage

```bash
# Decompile binary shader to HLSL
cmd_Decompiler -D shader.bin
# Output: shader.hlsl

# Disassemble binary shader to assembly
cmd_Decompiler -d shader.bin
# Output: shader.asm

# Assemble assembly back to binary
cmd_Decompiler -a shader.asm
# Output: shader.shdr
```

### Decompilation Mode (-D, --decompile)

Converts binary shaders (bytecode) to HLSL source code.

**Syntax:**
```bash
cmd_Decompiler -D [options] <shader.bin>
```

**Options:**
- `-V, --validate` - Recompile HLSL with FXC to verify correctness
- `-v, --verbose` - Enable verbose debugging output

**Example:**
```bash
# Decompile with validation
cmd_Decompiler -D -V ABC123DEF-vs.bin
```

**Output:**
- `ABC123DEF-vs.hlsl` - Decompiled HLSL source

**Supported Shader Models:**
- DirectX 11: vs_5_0, ps_5_0, gs_5_0, hs_5_0, ds_5_0, cs_5_0
- DirectX 10: vs_4_0, ps_4_0, gs_4_0, cs_4_0
- DirectX 9: vs_3_0, ps_3_0 (limited)

**Decompiled Features:**
- Constant buffers (cbuffer)
- Structured buffers, raw buffers
- Texture sampling (Texture2D, Texture3D, TextureCube, arrays)
- UAVs (RWTexture, RWStructuredBuffer)
- System value semantics (SV_Position, SV_Target, etc.)
- Control flow (if, for, while, switch)
- Tessellation (hull/domain shaders)
- Geometry shaders with streams

Reference: `HLSLDecompiler/DecompileHLSL.cpp` (DecompileBinaryHLSL function)

### Disassembly Mode (-d, --disassemble)

Converts binary shaders to assembly text (human-readable instruction listing).

**Syntax:**
```bash
cmd_Decompiler -d [options] <shader.bin>
```

**Disassembly Variants:**

| Option | Description | Output Format |
|--------|-------------|---------------|
| `-d, --disassemble` | Flugan's disassembler (default, recommended) | .asm |
| `--disassemble-ms` | Microsoft D3DDisassemble | .msasm |
| `-x, --disassemble-hexdump` | Disassembly with hex overlay | .asm |
| `-6, --disassemble-46` | Compatibility mode for d3dcompiler_46 | .asm |

**Additional Options:**
- `-16, --patch-cb-offsets` - Replace constant buffer byte offsets with indices
- `-V, --validate` - Reassemble and compare to original binary

**Examples:**
```bash
# Standard disassembly
cmd_Decompiler -d shader.bin

# Disassembly with hex dump (debugging)
cmd_Decompiler -x shader.bin

# Disassembly with CB index patching
cmd_Decompiler -d -16 shader.bin

# Microsoft-style disassembly
cmd_Decompiler --disassemble-ms shader.bin
```

**Hexdump Modes (-x):**
- Mode 0: Hex bytes before each instruction
- Mode 1: Interleaved hex and disassembly
- Mode 2: Hex on left, disassembly on right

**Flugan vs Microsoft Disassemblers:**

| Feature | Flugan | Microsoft |
|---------|--------|-----------|
| **Float Precision** | %.9e (exact) | %f (lossy) |
| **Reassembly** | Perfect round-trip | May lose precision |
| **Compatibility** | 3dmigoto-optimized | Standard D3D |
| **Output** | .asm | .msasm |

**Critical Difference:** Flugan's disassembler uses `%.9e` floating-point format instead of `%f`, ensuring exact bit-for-bit reconstruction during reassembly. This is essential for shader modding.

Reference: `D3D_Shaders/Shaders.cpp` (disassembler function)

### Assembly Mode (-a, --assemble)

Converts assembly text back to binary shaders.

**Syntax:**
```bash
cmd_Decompiler -a [options] <shader.asm>
```

**Options:**
- `--copy-reflection <file.bin>` - Copy reflection/signature sections from reference shader
- `-V, --validate` - Disassemble result and compare to input
- `--lenient` - Don't fail on certain section mismatches

**Examples:**
```bash
# Basic assembly
cmd_Decompiler -a modified_shader.asm
# Output: modified_shader.shdr

# Assembly with reflection copying
cmd_Decompiler -a --copy-reflection original.bin modified.asm
# Output: modified.shdr

# Assembly with validation
cmd_Decompiler -a -V shader.asm
```

**Reflection Copying:**

When you modify shader assembly, the reflection information (resource bindings, constant buffer layouts) may become stale or missing. Use `--copy-reflection` to copy this metadata from an original compiled shader:

```bash
# Workflow:
# 1. Disassemble original
cmd_Decompiler -d original.bin  # → original.asm

# 2. Edit original.asm (modify instructions)

# 3. Assemble with reflection from original
cmd_Decompiler -a --copy-reflection original.bin original.asm
# → original.shdr (with correct reflection info)
```

This is critical for shaders with complex resource layouts.

Reference: `D3D_Shaders/Assembler.cpp`

### Signature Parsing

cmd_Decompiler can parse shader signatures from assembly comments.

**Signature Format in Assembly:**
```asm
//
// Input signature:
//
// Name                 Index   Mask Register SysValue  Format   Used
// -------------------- ----- ------ -------- -------- ------- ------
// POSITION                 0   xyz         0     NONE   float   xyz 
// TEXCOORD                 0   xy          1     NONE   float   xy  
//
// Output signature:
//
// Name                 Index   Mask Register SysValue  Format   Used
// -------------------- ----- ------ -------- -------- ------- ------
// SV_Position              0   xyzw        0      POS   float   xyzw
// TEXCOORD                 0   xy          1     NONE   float   xy  
```

The assembler parses these comments to reconstruct signature sections (ISGN, OSGN) in the binary shader.

**When Signatures are Needed:**
- DirectX 11 requires matching signatures between pipeline stages
- Incorrect signatures cause shader linkage errors
- Signatures are preserved through disassembly comments

Reference: `D3D_Shaders/SignatureParser.cpp`

### Batch Processing

cmd_Decompiler accepts multiple input files:

```bash
# Decompile all shaders in directory
cmd_Decompiler -D *.bin

# Disassemble all vertex shaders
cmd_Decompiler -d *-vs.bin

# Assemble all modified assembly files
cmd_Decompiler -a *.asm
```

**Options for Batch Processing:**
- `-S, --stop-on-failure` - Stop if any file fails (default: continue)
- `-v, --verbose` - Show progress for each file

**Exit Codes:**
- 0: Success (all files processed)
- Non-zero: Error occurred

### Validation Mode (-V, --validate)

Validation performs round-trip conversion to verify correctness:

**Decompilation Validation:**
```bash
cmd_Decompiler -D -V shader.bin
```
1. Decompile binary → HLSL
2. Recompile HLSL with FXC → new binary
3. Compare new binary with original
4. Report differences (should be identical for valid decompilation)

**Requires FXC:** You must have `fxc.exe` (DirectX Shader Compiler) in your PATH.

**Assembly Validation:**
```bash
cmd_Decompiler -a -V shader.asm
```
1. Assemble ASM → binary
2. Disassemble binary → new ASM
3. Compare new ASM with original
4. Report differences (should be identical)

**Lenient Validation:**
```bash
cmd_Decompiler -a -V --lenient shader.asm
```

Ignores mismatches in these sections:
- SHDR vs SHEX (shader model encoding differences)
- STAT (compiler statistics)
- RDEF (resource definitions, if unchanged)
- SDBG (debug info)

Useful when modifying shaders that don't affect these metadata sections.

Reference: `cmd_Decompiler.cpp` (validation logic)

## Hash Calculation

3dmigoto uses FNV-64 hash algorithm for shader identification.

### FNV-64 Algorithm

**Implementation:** `util.h` (fnv_64_buf function)

**Properties:**
- 64-bit output
- Fast computation
- Consistent across all 3dmigoto tools
- Non-cryptographic (not secure, just for identification)

**Formula:**
```c
FNV-64 Hash:
hash = 0xcbf29ce484222325  // FNV offset basis
for each byte:
    hash = hash * 0x100000001b3  // FNV prime
    hash = hash XOR byte
```

Reference: `util.h:44-55`

### Calculating Shader Hashes

**Manual Calculation:**

You can calculate shader hashes offline using the same algorithm:

```python
# Python implementation
def fnv_64_buf(data):
    hash_val = 0xcbf29ce484222325
    prime = 0x100000001b3
    for byte in data:
        hash_val = ((hash_val * prime) & 0xffffffffffffffff) ^ byte
    return hash_val

# Example
with open('shader.bin', 'rb') as f:
    shader_data = f.read()
    hash_value = fnv_64_buf(shader_data)
    print(f"{hash_value:016x}")  # e.g., "abc123def4567890"
```

**Usage:**
- Shader filenames: `<hash>-<type>.bin` (e.g., `ABC123DEF-vs.bin`)
- TextureOverride hash matching: `hash = 0xABC123DEF`
- ShaderOverride hash matching: `hash = 0xABC123DEF`

**Why FNV-64?**
- Fast computation (important for runtime hashing)
- Good distribution (minimal collisions in practice)
- Consistent results across platforms
- Simple implementation

### CRC32C Alternative

3dmigoto also includes CRC32C (hardware-accelerated) for resource hashing:

**Implementation:** `util.h` (crc32c_hw function)

**Properties:**
- Uses SSE 4.2 instructions (much faster than FNV-64)
- 32-bit output (smaller)
- Used for resource hashes, not shader hashes
- ~30x faster than FNV-64

**When to Use:**
- FNV-64: Shader identification (consistency with existing tools)
- CRC32C: Resource pool hashing (performance-critical runtime)

Reference: `util.h:233-253`

## Test and Validation Scripts

3dmigoto includes comprehensive test suites for validation.

**Location:** `TestShaders/` directory in source repository

### run_hlsl_tests.sh

Tests HLSL decompilation with FXC recompilation validation.

**Syntax:**
```bash
./run_hlsl_tests.sh [--update-chk]
```

**Process:**
1. Compiles HLSL test cases with FXC
2. Decompiles binary shaders to HLSL
3. Compares output with .chk (check) files
4. Recompiles to verify correctness

**Test Cases:**
- Structured buffers
- Compute shaders
- Tessellation (hull/domain)
- Geometry shaders
- Complex control flow
- Resource types (textures, UAVs)

**Options:**
- `--update-chk` - Update check files with new output (use carefully!)

**Requirements:**
- FXC compiler in PATH
- cmd_Decompiler.exe in PATH or via environment variable

Reference: `TestShaders/run_hlsl_tests.sh`

### run_asm_tests.sh

Tests assembler/disassembler with round-trip validation.

**Syntax:**
```bash
./run_asm_tests.sh [--lenient]
```

**Test Types:**
1. **Pure assembly tests** - Hand-written assembly files
   - emit_then_cut, sync, atomic operations
   - System value semantics
   - Specific instruction sequences

2. **HLSL→ASM compilation tests** - Compile HLSL, disassemble, validate
   - All HLSL test cases disassembled
   - Round-trip assembly/disassembly

3. **Signature parser tests** - Verify signature parsing from comments

4. **Binary decompiler tests** - Low-level bytecode parsing

**Options:**
- `--lenient` - Allow certain section mismatches (SHDR/SHEX, STAT, RDEF, SDBG)

**Validation:**
- Disassemble original
- Reassemble disassembly
- Binary compare
- Report any differences

Reference: `TestShaders/run_asm_tests.sh`

### run_game_example_tests.sh

Tests with real-world game shaders.

**Syntax:**
```bash
./run_game_example_tests.sh [options]
```

**Options:**
- `--asm` - Assembly validation only
- `--asm-reconstructed` - Test reconstructed shaders
- `--hlsl` - HLSL decompilation only
- `--update-chk` - Update check files

**Purpose:**
- Verify tools work on actual game shaders
- Catch edge cases not covered by synthetic tests
- Ensure backward compatibility

**Game Examples Included:**
- Various AAA game shaders
- Different shader models
- Complex resource bindings
- Unusual instruction patterns

Reference: `TestShaders/run_game_example_tests.sh`

### reconstruct_binary_shader.sh

Rebuilds original binary shaders from modified HLSL.

**Syntax:**
```bash
./reconstruct_binary_shader.sh <shader.hlsl>
```

**Process:**
1. Extract assembly from HLSL comments (if present)
2. Compile HLSL to temporary binary (gets reflection info)
3. Assemble with `--copy-reflection` to merge both

**Use Case:**
When you modify HLSL and need to create a binary with correct reflection metadata.

**Example:**
```bash
# Workflow:
# 1. Decompile original
cmd_Decompiler -D original.bin  # → original.hlsl (includes assembly comments)

# 2. Edit original.hlsl (modify HLSL code)

# 3. Reconstruct binary
./reconstruct_binary_shader.sh original.hlsl
# → original.shdr (correct reflection, modified code)
```

Reference: `TestShaders/reconstruct_binary_shader.sh`

## Shader Binary Format (DXBC)

Understanding the binary format helps with analysis and debugging.

### DXBC Container Structure

**FOURCC:** `'DXBC'` (DirectX Bytecode Container)

**Header:**
```
Offset  Size  Description
0x00    4     'DXBC' magic
0x04    16    Checksum (MD5)
0x14    4     Always 0x00000001
0x18    4     Container size in bytes
0x1C    4     Number of chunks
0x20    N*4   Chunk offsets (relative to start)
```

**Chunks:**
Each chunk has a FOURCC identifier and size:
```
Offset  Size  Description
0x00    4     FOURCC (e.g., 'SHEX', 'RDEF')
0x04    4     Chunk size
0x08    N     Chunk data
```

Reference: `BinaryDecompiler/decode.cpp:70-180`

### Important Chunk Types

| FOURCC | Name | Description |
|--------|------|-------------|
| **SHDR** | Shader | Shader bytecode (DX10, SM 4.0) |
| **SHEX** | Shader Extended | Shader bytecode (DX11, SM 5.0) |
| **RDEF** | Resource Definitions | Constant buffers, samplers, textures |
| **ISGN** | Input Signature | Vertex/pixel shader inputs |
| **OSGN** | Output Signature | Vertex/pixel shader outputs |
| **OSG5** | Output Signature 5.0 | Stream outputs (geometry shader) |
| **PSGN** | Patch Signature | Patch constants (tessellation) |
| **STAT** | Statistics | Instruction count, temp registers |
| **IFCE** | Interface | Shader interfaces (dynamic linking) |
| **SDBG** | Debug | Source-level debugging info |

Reference: `BinaryDecompiler/decode.cpp:200-500`

### RDEF Section (Resource Definitions)

Contains constant buffer layouts, resource bindings:

**Structure:**
- Constant buffer definitions (cbuffer)
  - Buffer name, size, type
  - Variable definitions (name, offset, size, type)
- Bound resources
  - Textures, samplers, UAVs
  - Bind points (t0, s0, u0)
  - Dimension, return type, sample count

**Example RDEF:**
```
Constant buffer: $Globals (size: 256)
  Variable: ViewProjection (offset: 0, size: 64, type: float4x4)
  Variable: LightDirection (offset: 64, size: 16, type: float3)

Bound resources:
  Texture2D diffuseTexture (t0, rettype: float4)
  SamplerState linearSampler (s0)
```

Reference: `BinaryDecompiler/reflect.cpp`

### Signature Sections (ISGN/OSGN/PSGN)

Define shader inputs/outputs with semantics:

**Structure:**
- Number of elements
- Element definitions:
  - Semantic name (e.g., "POSITION", "SV_Position")
  - Semantic index
  - System value type
  - Component type (float, int, uint)
  - Register index
  - Component mask (which xyzw components used)

**Example ISGN:**
```
Input signature:
  POSITION, 0, register 0, float3, xyz
  TEXCOORD, 0, register 1, float2, xy
  NORMAL, 0, register 2, float3, xyz
```

Reference: `BinaryDecompiler/decode.cpp:1100-1300`

## Disassembly Format

Understanding assembly syntax is essential for shader modification.

### Instruction Format

```asm
opcode[_modifier] dest, src0, src1, src2
```

**Components:**
- **opcode** - Instruction name (add, mul, mov, etc.)
- **modifier** - Optional modifier (_sat for saturate, _nz for non-zero)
- **dest** - Destination operand
- **src** - Source operands (0-3 depending on instruction)

**Example:**
```asm
mul r0.xyz, r1.xyzx, r2.xyzx
add_sat r3.w, r0.w, l(1.000000)
```

Reference: `D3D_Shaders/Shaders.cpp`

### Register Types

| Type | Prefix | Description |
|------|--------|-------------|
| **Temp** | r# | Temporary registers (r0-r4095) |
| **Input** | v# | Shader inputs (v0-v31) |
| **Output** | o# | Shader outputs (o0-o31) |
| **Constant Buffer** | cb#[#] | Constant buffer access (cb0[5] = buffer 0, offset 5) |
| **Texture** | t# | Texture resource (t0-t127) |
| **Sampler** | s# | Sampler state (s0-s15) |
| **UAV** | u# | Unordered access view (u0-u7) |
| **Immediate** | l() | Literal value (l(1.0, 0.0, 0.0, 1.0)) |

### Swizzles and Masks

**Swizzle (source):**
```asm
mov r0.xyzw, r1.xxxx  ; Replicate r1.x to all components
mov r0.xy, r1.zw      ; Move r1.z→r0.x, r1.w→r0.y
```

**Mask (destination):**
```asm
mov r0.xz, r1.xy      ; Write to x and z only (y and w unchanged)
mul r0.w, r1.x, r2.y  ; Write result only to w
```

### Declaration Statements

Declarations specify shader inputs, outputs, resources:

```asm
// Input declaration (vertex shader input)
dcl_input v0.xyz          // POSITION (xyz)
dcl_input v1.xy           // TEXCOORD (xy)

// Output declaration (vertex shader output)
dcl_output_siv o0.xyzw, position  // SV_Position
dcl_output o1.xy                   // TEXCOORD

// Constant buffer declaration
dcl_constantbuffer cb0[8], dynamicIndexed

// Texture declaration
dcl_resource_texture2d (float,float,float,float) t0

// Sampler declaration
dcl_sampler s0, mode_default
```

### System Value Semantics

System values specified with `_siv` (system interpreted value):

```asm
dcl_input_siv v0.x, vertex_id           // SV_VertexID
dcl_output_siv o0.xyzw, position        // SV_Position
dcl_output_siv o0.xyzw, target0         // SV_Target0
```

See [system-values.md](./system-values.md) for complete semantic reference.

## Integration with Frame Analysis

Static analysis tools complement runtime frame analysis:

### Workflow

1. **Runtime Capture** (Frame Analysis)
   - Press F8 in-game to dump frame
   - Shaders saved as `<drawcall>-<type>.txt` (disassembled)
   - Vertex/index buffers, textures dumped

2. **Static Analysis** (cmd_Decompiler)
   - Decompile interesting shaders: `cmd_Decompiler -D 000123-vs.bin`
   - Edit HLSL or assembly
   - Validate modifications: `cmd_Decompiler -D -V modified.hlsl`

3. **Reintegration** (ShaderOverride)
   - Copy modified shader to game directory
   - Create ShaderOverride section in d3dx.ini
   - Test in-game

**Example:**
```bash
# 1. After frame analysis, decompile shader
cmd_Decompiler -D 000123-vs.txt

# 2. Edit 000123-vs.hlsl (add stereo correction)

# 3. Validate decompilation
cmd_Decompiler -D -V 000123-vs.hlsl

# 4. Copy to game ShaderFixes/
cp 000123-vs.hlsl /path/to/game/ShaderFixes/ABC123DEF-vs.hlsl

# 5. Add to d3dx.ini
[ShaderOverrideVS]
hash = 0xABC123DEF
```

See [debugging.md](./debugging.md) for complete workflow.

## Performance Considerations

### Decompilation Speed

**Typical Performance:**
- Decompilation: ~10-50ms per shader (depends on complexity)
- Disassembly: ~1-5ms per shader
- Assembly: ~5-20ms per shader

**For large shader collections (1000s of shaders):**
- Use batch processing
- Consider parallel processing (run multiple cmd_Decompiler instances)
- Validate only critical shaders (validation is slow)

### Validation Overhead

Validation significantly increases processing time:

| Operation | Time (approximate) |
|-----------|-------------------|
| Decompile only | 10ms |
| Decompile + validate | 100ms (10x slower) |
| Assemble only | 5ms |
| Assemble + validate | 50ms (10x slower) |

**Recommendation:** Validate during development, disable for production batch processing.

## Common Use Cases

### Use Case 1: Bulk Shader Decompilation

Decompile all shaders from a frame analysis dump:

```bash
cd /path/to/game/FrameAnalysis-*
cmd_Decompiler -D *-vs.txt *-ps.txt *-gs.txt *-hs.txt *-ds.txt *-cs.txt
```

Result: All shaders decompiled to HLSL.

### Use Case 2: Shader Modification and Validation

Modify a shader and verify it compiles correctly:

```bash
# 1. Decompile original
cmd_Decompiler -D original.bin

# 2. Edit original.hlsl

# 3. Validate modification
cmd_Decompiler -D -V original.hlsl
# If validation passes, shader is valid
```

### Use Case 3: Assembly-Level Tweaking

Make small assembly modifications for fine control:

```bash
# 1. Disassemble
cmd_Decompiler -d shader.bin

# 2. Edit shader.asm (change specific instructions)

# 3. Reassemble with reflection
cmd_Decompiler -a --copy-reflection shader.bin shader.asm

# 4. Test shader.shdr in-game
```

### Use Case 4: Hash Calculation for New Shaders

Calculate hash for a custom shader:

```python
import hashlib

def fnv_64_buf(data):
    hash_val = 0xcbf29ce484222325
    prime = 0x100000001b3
    for byte in data:
        hash_val = ((hash_val * prime) & 0xffffffffffffffff) ^ byte
    return hash_val

with open('custom_shader.bin', 'rb') as f:
    shader_data = f.read()
    hash_value = fnv_64_buf(shader_data)
    print(f"hash = 0x{hash_value:016x}")
```

Use calculated hash in ShaderOverride section.

### Use Case 5: Signature Inspection

Extract input/output semantics from shader:

```bash
# Disassemble with full output
cmd_Decompiler -d shader.bin

# Check assembly comments for signatures
# Look for "Input signature:" and "Output signature:" sections
```

Use signature information to match shader stages correctly.

## Troubleshooting

### Error: "Failed to decompile shader"

**Causes:**
- Corrupted binary file
- Unsupported shader model (very old DX9 shaders)
- Encrypted or compressed shader (some DRM systems)

**Solutions:**
- Verify file is valid DXBC (starts with 'DXBC' magic)
- Check shader model (only DX10/DX11 fully supported)
- Try disassembly instead of decompilation

### Error: "Validation failed" (HLSL)

**Causes:**
- Decompilation introduced syntax errors
- FXC compiler not found
- Shader uses features FXC doesn't support

**Solutions:**
- Check decompiled HLSL for obvious errors
- Ensure FXC.exe is in PATH
- Try different FXC version (SDK vs Windows Kit)
- Some complex shaders may not perfectly decompile

### Error: "Assembly failed"

**Causes:**
- Syntax errors in assembly file
- Missing or malformed signature comments
- Invalid instruction sequences

**Solutions:**
- Check assembly syntax carefully
- Ensure signature comments are intact (especially with `--copy-reflection`)
- Validate original disassembly before modifying
- Use `--lenient` if metadata sections don't matter

### Assembly Doesn't Match Original

**Problem:** Reassembled shader differs from original binary.

**Causes:**
- Floating-point precision loss (if using Microsoft disassembler)
- Optimizations or instruction reordering
- Missing metadata sections

**Solutions:**
- Always use Flugan's disassembler (`-d`, not `--disassemble-ms`)
- Check float formatting (%.9e vs %f)
- Use `--copy-reflection` to preserve metadata
- Compare with hexdump mode (`-x`) to identify differences

## Environment Setup

### Required Tools

1. **cmd_Decompiler.exe**
   - Download from 3dmigoto releases
   - Or build from source (requires Visual Studio 2022)

2. **FXC.exe** (for validation)
   - Included in Windows SDK
   - Typical locations:
     - `C:\Program Files (x86)\Windows Kits\10\bin\<version>\x64\fxc.exe`
     - `C:\Program Files (x86)\Microsoft DirectX SDK\Utilities\bin\x64\fxc.exe`

3. **Bash** (for test scripts, optional)
   - Git Bash (Windows)
   - WSL (Windows Subsystem for Linux)
   - Native bash (Linux/Mac)

### Environment Variables

```bash
# Windows
set PATH=%PATH%;C:\path\to\3dmigoto\x64
set FXC="C:\Program Files (x86)\Windows Kits\10\bin\10.0.19041.0\x64\fxc.exe"

# Linux/Mac/Bash
export PATH=$PATH:/path/to/3dmigoto/x64
export FXC="/path/to/fxc.exe"
export CMD_DECOMPILER="/path/to/cmd_Decompiler.exe"
```
