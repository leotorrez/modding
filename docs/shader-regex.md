# ShaderRegex

ShaderRegex is a powerful feature that allows automatic patching of shader assembly code using regular expression patterns. It enables broad fixes to multiple shaders without manually editing each one.

## Overview

ShaderRegex uses PCRE2 (Perl Compatible Regular Expressions) to match and modify shader assembly instructions at runtime. This is particularly useful for:

- Applying stereo 3D corrections across many shaders
- Fixing common shader issues automatically
- Inserting instrumentation code
- Modifying shader behavior without manual editing

**Key Characteristics:**
- Operates on assembly code (not HLSL)
- Uses PCRE2 regex engine with JIT compilation
- Results cached for performance
- Can insert declarations (e.g., StereoParams access)
- Integrates with ShaderOverride command lists

Reference: ShaderRegex.cpp, IniHandler.cpp:2357-2608

---

## Basic Structure

A complete ShaderRegex consists of up to 4 sections:

```ini
[ShaderRegexName]              ; Main section (required)
shader_model = ps_5_0          ; Target shader types
temps = stereo tmp1            ; Named temp registers
; Command list operations...

[ShaderRegexName.Pattern]     ; Pattern to match (optional)
; Regular expression pattern

[ShaderRegexName.Pattern.Replace]  ; Replacement (optional)
; Replacement text with substitutions

[ShaderRegexName.InsertDeclarations]  ; Declarations (optional)
; Assembly declarations to insert
```

---

## Main Section

The main section defines the regex group and acts as a command list.

### Required Properties

#### shader_model

Specifies which shader types this pattern applies to.

```ini
[ShaderRegex1]
shader_model = ps_5_0

[ShaderRegex2]
; Multiple shader models
shader_model = ps_4_0 ps_5_0 vs_5_0
```

**Valid Values:**
- `ps_4_0`, `ps_5_0` - Pixel shaders
- `vs_4_0`, `vs_5_0` - Vertex shaders
- `gs_4_0`, `gs_5_0` - Geometry shaders
- `hs_5_0` - Hull shaders
- `ds_5_0` - Domain shaders
- `cs_5_0` - Compute shaders

**Note:** Shader model 4 and 5 have instruction differences, so you may need separate patterns for each.

Reference: IniHandler.cpp:2367-2378

### Optional Properties

#### temps

Defines named temporary registers that will be allocated automatically.

```ini
[ShaderRegex1]
shader_model = ps_5_0
temps = stereo tmp1 tmp2
```

**Behavior:**
- 3dmigoto finds free register numbers
- Updates `dcl_temps` declaration automatically
- Registers available in pattern replacement as `${stereo}`, `${tmp1}`, etc.

Reference: ShaderRegex.cpp:96-132

#### filter_index

Sets partner shader filtering value (same as ShaderOverride).

```ini
[ShaderRegex1]
shader_model = ps_5_0
filter_index = 1
```

Reference: IniHandler.cpp:2359-2366

### Command List Integration

The main section acts as a command list that executes when shader matches:

```ini
[ShaderRegex1]
shader_model = ps_5_0

; Run command list on match
run = CommandListStereoSetup

; Set IniParams
x10 = 1.0

; Conditional execution
if ps-t0 !== -0.0
    run = CommandListTexturePresent
endif
```

See [Command List](./command-list.md) for available commands.

---

## Pattern Section

The Pattern section contains the regular expression to match against shader assembly.

### Section Name

Must be `[SectionName.Pattern]` where SectionName matches the main section:

```ini
[ShaderRegex1]
shader_model = ps_5_0

[ShaderRegex1.Pattern]
; Pattern here
```

### Pattern Syntax

3dmigoto uses PCRE2 with the following defaults:

**Flags:**
- `PCRE2_CASELESS` - Case-insensitive (handles d3dcompiler differences)
- `PCRE2_MULTILINE` - `^` and `$` match line boundaries

**JIT Compilation:**
- Enabled automatically for ~10x performance

Reference: ShaderRegex.cpp:145-179

### PCRE2 Syntax Reference

Full syntax: http://www.pcre.org/current/doc/html/pcre2syntax.html

**Character Classes:**
- `\d` - Digit [0-9]
- `\D` - Non-digit
- `\s` - Whitespace
- `\S` - Non-whitespace
- `\w` - Word character [a-zA-Z0-9_]
- `\W` - Non-word character

**Quantifiers:**
- `*` - 0 or more
- `+` - 1 or more
- `?` - 0 or 1
- `{n}` - Exactly n
- `{n,}` - n or more
- `{n,m}` - Between n and m

**Anchors:**
- `^` - Start of line
- `$` - End of line
- `\n` - Newline character

**Groups:**
- `(pattern)` - Capture group
- `(?P<name>pattern)` - Named capture group
- `(?P=name)` - Named backreference
- `\N` - Numeric backreference (N=1,2,3...)

**Alternation:**
- `|` - OR operator

**Character Sets:**
- `[abc]` - Any of a, b, or c
- `[a-z]` - Range
- `[^abc]` - Not a, b, or c

### INI File Considerations

**Whitespace:**
- Leading/trailing whitespace stripped from each line
- To match indented lines, use `\s*` explicitly

**Comments:**
- INI comments (`;` or `#`) are ignored
- Blank lines ignored

**Newlines:**
- Must use `\n` to match newline at end of line
- Don't confuse with extended mode `(?x)`

**Example:**
```ini
[ShaderRegex1.Pattern]
; This matches mul instruction
\s*mul r\d+\.xyzw, r\d+\.yyyy, cb0\[28\]\.xyzw\n
; \s* matches leading whitespace
; \n matches end of line
```

### Assembly Instruction Format

Shader assembly follows specific patterns:

**Instruction Format:**
```
opcode dst, src1, src2, ...\n
```

**Register Patterns:**
- `r\d+` - Temporary register (r0, r1, r10, etc.)
- `cb\d+\[\d+\]` - Constant buffer (cb0[5])
- `t\d+` - Texture register (t0, t1, etc.)
- `v\d+` - Input register
- `o\d+` - Output register

**Swizzles:**
- `\.xyzw` - Component access
- `\.[xyzw]{1,4}` - 1-4 components

**Examples:**
```ini
; Match mul instruction
mul r\d+\.xyzw, r\d+\.yyyy, cb0\[28\]\.xyzw\n

; Match any mad instruction
mad r\d+\.xyzw, r\d+\.[xyzw]{4}, cb0\[\d+\]\.xyzw, r\d+\.xyzw\n

; Match texture sample
sample_indexable\(texture2d\)\(float,float,float,float\) r\d+\.xyzw, r\d+\.xy, t\d+\.xyzw, s\d+\n
```

### Named Capture Groups

Use named groups to extract specific parts of the match:

```ini
[ShaderRegex1.Pattern]
mad r\d+\.xyzw, (?P<pos_x>r\d+)\.(?P<swizzle_x>[xyzw])[xyzw]{3}, cb0\[27\]\.xyzw, r\d+\.xyzw\n
```

**Named Group Syntax:**
- `(?P<name>pattern)` - Define named group
- `(?P=name)` - Reference named group (backreference)

**Example with Backreference:**
```ini
; Match add followed by use of same register
add (?P<result>r\d+)\.xyzw, r\d+\.xyzw, cb0\[30\]\.xyzw\n
div r\d+\.[xyzw]{2}, (?P=result)\.[xyzw]{4}, r\d+\.wwww\n
```

Reference: ShaderRegex.cpp:170-176

### Pattern Without Replacement

If no Replace section provided, pattern is just a match test:

```ini
[ShaderRegex1]
shader_model = ps_5_0

[ShaderRegex1.Pattern]
; Matches shaders with specific pattern
mul r\d+\.xyzw, r\d+\.yyyy, cb0\[28\]\.xyzw\n

; Command list runs on match (but shader not modified)
run = CommandListMatched
```

This is useful for identifying shaders without modifying them.

---

## Replace Section

The Replace section specifies how to modify the matched pattern.

### Section Name

Must be `[SectionName.Pattern.Replace]`:

```ini
[ShaderRegex1.Pattern.Replace]
; Replacement text
```

**Requirements:**
- Must have corresponding Pattern section
- Associates replacement with specific pattern

Reference: IniHandler.cpp:2457-2493

### Replacement Syntax

Use `${0}` to reference the entire matched text, allowing insertion before/after:

```ini
[ShaderRegex1.Pattern.Replace]
; Insert before match
// My comment\n
${0}

; Insert after match
${0}
\n
// Added code\n

; Replace entirely (no ${0})
// Completely different code\n
```

### Substitutions

**Capture Group References:**
- `${name}` - Named capture group
- `${0}` - Entire match
- `$1`, `$2` - Numeric capture groups

**Temp Register References:**
- `${tempname}` - Temp register from `temps =` declaration
- Automatically replaced with `rN` where N is allocated register

**Example:**
```ini
[ShaderRegex1]
temps = stereo tmp1

[ShaderRegex1.Pattern]
mad r\d+\.xyzw, (?P<pos_x>r\d+)\.(?P<swizzle_x>[xyzw])[xyzw]{3}, cb0\[27\]\.xyzw, r\d+\.xyzw\n

[ShaderRegex1.Pattern.Replace]
; Use captured groups and temp registers
ld_indexable(texture2d)(float,float,float,float) ${stereo}.xyzw, l(0, 0, 0, 0), t125.xyzw\n
mad ${pos_x}.${swizzle_x}, ${tmp1}.x, ${stereo}.x, ${pos_x}.${swizzle_x}\n
${0}
```

### Extended Substitution

PCRE2 extended substitution is enabled, providing:

**Escape Sequences:**
- `\n` - Newline
- `\t` - Tab
- `\\` - Backslash
- `\$` - Literal dollar sign

**Example:**
```ini
[ShaderRegex1.Pattern.Replace]
// This is a comment\n
\n
${0}
\n
// End of block\n
```

Reference: ShaderRegex.cpp:254-324

---

## InsertDeclarations Section

Adds declarations at the end of the shader's declaration block.

### Section Name

Must be `[SectionName.InsertDeclarations]`:

```ini
[ShaderRegex1.InsertDeclarations]
; Declarations here
```

Reference: IniHandler.cpp:2435-2455

### Common Declarations

**StereoParams Access:**
```ini
[ShaderRegex1.InsertDeclarations]
dcl_resource_texture2d (float,float,float,float) t125
```

**Additional Samplers:**
```ini
[ShaderRegex1.InsertDeclarations]
dcl_sampler s5, mode_default
```

**Constant Buffer:**
```ini
[ShaderRegex1.InsertDeclarations]
dcl_constantbuffer cb13[10], dynamicIndexed
```

### Automatic Deduplication

3dmigoto checks if declaration already exists before inserting:

```cpp
if (asm_text->find(*declaration) != string::npos)
    continue; // Skip if already present
```

Reference: ShaderRegex.cpp:59-82

---

## Complete Example: UE4 Shadow Correction

This real-world example demonstrates all ShaderRegex features:

```ini
[ShaderRegexUE4Shadow]
; Target pixel shaders
shader_model = ps_5_0

; Define temp registers
temps = stereo tmp1

; Run command list on match
run = CommandListShadowCorrection

; Match UE4 matrix multiply pattern
[ShaderRegexUE4Shadow.Pattern]
mul r\d+\.xyzw, r\d+\.yyyy, cb0\[28\]\.xyzw\n
mad r\d+\.xyzw, (?P<pos_x>r\d+)\.(?P<swizzle_x>[xyzw])[xyzw]{3}, cb0\[27\]\.xyzw, r\d+\.xyzw\n
mad r\d+\.xyzw, (?P<pos_z>r\d+)\.(?P<swizzle_z>[xyzw])[xyzw]{3}, cb0\[29\]\.xyzw, r\d+\.xyzw\n
add (?P<result>r\d+)\.xyzw, r\d+\.xyzw, cb0\[30\]\.xyzw\n
div r\d+\.[xyzw]{2}, (?P=result)\.[xyzw]{4}, r\d+\.wwww\n

; Insert stereo correction code
[ShaderRegexUE4Shadow.Pattern.Replace]
\n
// UE4 shadow correction:\n
ld_indexable(texture2d)(float,float,float,float) ${stereo}.xyzw, l(0, 0, 0, 0), t125.xyzw\n
add ${tmp1}.x, ${pos_z}.${swizzle_z}, -${stereo}.y\n
mad ${pos_x}.${swizzle_x}, -${tmp1}.x, ${stereo}.x, ${pos_x}.${swizzle_x}\n
\n
${0}

; Add StereoParams declaration
[ShaderRegexUE4Shadow.InsertDeclarations]
dcl_resource_texture2d (float,float,float,float) t125
```

**What This Does:**

1. **Matches** world-view-projection matrix multiply in UE4 shaders
2. **Captures** X and Z position registers and their swizzles
3. **Inserts** stereo correction code before the original multiply
4. **Uses** temp registers `stereo` and `tmp1` (automatically allocated)
5. **Accesses** StereoParams from t125
6. **Adds** StereoParams declaration if not present
7. **Runs** CommandListShadowCorrection command list

---

## Pattern Matching Process

### Application Flow

1. **Shader Load:**
   - Game creates shader
   - 3dmigoto intercepts and calculates hash

2. **Cache Check:**
   - Look for `{hash}-{type}_regex.dat`
   - If found and valid, load match status
   - If patched, load `{hash}-{type}_regex.bin`

3. **On Cache Miss:**
   - Disassemble shader to assembly text
   - Filter ShaderRegex groups by shader_model
   - Apply each matching group's patterns

4. **Pattern Application:**
   - Try to match pattern against assembly
   - If no Replace section: check match only
   - If Replace section: patch assembly
   - Continue to next pattern in group

5. **Early Exit:**
   - If any pattern in group fails to match, skip group
   - This allows multi-pattern groups for complex matching

6. **After All Patterns:**
   - Update dcl_temps if temp registers used
   - Insert declarations
   - Assemble patched assembly to bytecode

7. **Cache Save:**
   - Save match status and IDs
   - Save patched bytecode if modified
   - Export assembly if `export_fixed = 1`

Reference: ShaderRegex.cpp:646-692, HackerContext.cpp:540-647

### Multiple Patterns in Group

You can have multiple patterns in one group:

```ini
[ShaderRegex1]
shader_model = ps_5_0

[ShaderRegex1.Pattern1]
; Must match
mul r\d+\.xyzw, r\d+\.yyyy, cb0\[28\]\.xyzw\n

[ShaderRegex1.Pattern1.Replace]
${0}

[ShaderRegex1.Pattern2]
; Must also match (after Pattern1)
add r\d+\.xyzw, r\d+\.xyzw, cb0\[30\]\.xyzw\n

[ShaderRegex1.Pattern2.Replace]
${0}
```

**Behavior:**
- Patterns applied in sorted order
- All patterns must match for group to apply
- First non-match exits group
- Each pattern can have its own replacement

---

## Integration with ShaderOverride

When ShaderRegex matches a shader, it automatically creates/updates a ShaderOverride entry:

```ini
; ShaderRegex matches shader hash 0123456789abcdef
[ShaderRegex1]
shader_model = ps_5_0
run = CommandListA
filter_index = 1

; Automatically creates:
[ShaderOverride0123456789abcdef]
run = CommandListA
filter_index = 1
; Plus any other ShaderRegex command list operations
```

**Command List Linking:**
- ShaderRegex command lists added to ShaderOverride
- Multiple ShaderRegex groups can match same shader
- All matching command lists execute
- Prevents duplicate linking

Reference: ShaderRegex.cpp:366-426

---

## Caching System

### Cache Files

**Metadata:** `{hash}-{type}_regex.dat`

Format:
```cpp
struct {
    uint32_t version;           // Cache version (1)
    uint32_t shader_regex_hash; // Validates consistency
    uint32_t patched;           // 1 if modified
    uint32_t num_matches;       // Matched group count
    uint32_t match_ids[];       // IDs of matched groups
};
```

**Bytecode:** `{hash}-{type}_regex.bin`
- Only if shader was patched
- Compiled bytecode ready to use

**Assembly:** `{hash}-{type}_regex.txt`
- Only if `export_fixed = 1`
- Patched assembly for review

Reference: ShaderRegex.cpp:470-643

### Cache Validation

Cache is invalidated when:
- ShaderRegex configuration changes
- `assemble_signature_comments` changes
- `disassemble_undecipherable_custom_data` changes
- `patch_cb_offsets` changes

These settings affect assembly output, so cached results may be incorrect.

### Cache Benefits

**Performance:**
- Regex processing skipped on subsequent loads
- Pre-compiled bytecode loaded directly
- Even non-matches cached (avoids re-checking)

**Overhead Reduction:**
- First load: ~10ms per shader (regex + assembly)
- Cached load: ~1ms (load bytecode only)
- Non-match cache: ~0.1ms (metadata read only)

---

## Hunting Integration

### Marking Actions

Enable ShaderRegex during hunting:

```ini
[Hunting]
marking_actions = clipboard asm regex
```

**When marking a shader:**
1. Disassembles original shader
2. Applies all matching ShaderRegex patterns
3. Exports result to ShaderFixes

**Files Created:**
- `{hash}-{type}.txt` - Original assembly
- `{hash}-{type}_regex.txt` - Patched assembly (if matched)

Reference: Hunting.cpp:1022-1075

---

## Performance Considerations

### Overhead

ShaderRegex processing has measurable CPU cost:

**Pattern Matching:**
- PCRE2 JIT compilation: ~10x faster than interpreted
- Per-pattern match: ~0.1-1ms depending on complexity
- Assembly/disassembly: ~5-10ms per shader

**Optimization Strategies:**

1. **Use Specific Patterns:**
   ```ini
   ; BAD: Too broad
   r\d+\.xyzw

   ; GOOD: Specific instruction
   mul r\d+\.xyzw, r\d+\.yyyy, cb0\[28\]\.xyzw\n
   ```

2. **Limit Shader Models:**
   ```ini
   ; BAD: Applies to all types
   shader_model = ps_4_0 ps_5_0 vs_4_0 vs_5_0 gs_5_0

   ; GOOD: Only pixel shaders
   shader_model = ps_5_0
   ```

3. **Early Exit Patterns:**
   ```ini
   ; Put most distinctive pattern first
   [ShaderRegex1.Pattern1]
   ; Unique instruction sequence
   ; If this fails, skip group quickly
   ```

4. **Cache Properly:**
   - Avoid frequent config changes
   - Don't modify settings that invalidate cache unnecessarily

### Profiling

Enable profiling to measure ShaderRegex overhead:

```ini
[Profiling]
mode = summary
```

Look for "ShaderRegex" in profiling output.

---

## Common Patterns

### Stereo Correction

```ini
[ShaderRegexStereo]
shader_model = ps_5_0
temps = stereo

[ShaderRegexStereo.Pattern]
; Match projection
mul r\d+\.xyzw, (?P<pos>r\d+\.[xyzw]{4}), cb0\[\d+\]\.xyzw\n

[ShaderRegexStereo.Pattern.Replace]
; Load stereo params
ld_indexable(texture2d)(float,float,float,float) ${stereo}.xyzw, l(0, 0, 0, 0), t125.xyzw\n
; Adjust position
mad ${pos}, ${pos}, ${stereo}.x, ${stereo}.y\n
${0}

[ShaderRegexStereo.InsertDeclarations]
dcl_resource_texture2d (float,float,float,float) t125
```

### Texture Replacement

```ini
[ShaderRegexTexSwap]
shader_model = ps_5_0

[ShaderRegexTexSwap.Pattern]
; Match specific texture sample
sample_indexable\(texture2d\)\(float,float,float,float\) r\d+\.xyzw, r\d+\.xy, t5\.xyzw, s\d+\n

[ShaderRegexTexSwap.Pattern.Replace]
; Change to t6
sample_indexable(texture2d)(float,float,float,float) r\d+\.xyzw, r\d+\.xy, t6.xyzw, s\d+\n
```

### Instrumentation

```ini
[ShaderRegexDebug]
shader_model = ps_5_0

[ShaderRegexDebug.Pattern]
; Match shader output
mov o0\.xyzw, r\d+\.xyzw\n

[ShaderRegexDebug.Pattern.Replace]
${0}
; Add debug output
mov o1.xyzw, cb0[0].xyzw\n
```

---

## Troubleshooting

### Pattern Not Matching

**Check Assembly:**
1. Hunt and mark shader
2. Open `{hash}-{type}.txt`
3. Find instruction sequence you're trying to match
4. Copy exact assembly text
5. Escape regex special characters: `()[]{}.*+?|`

**Common Issues:**
- Wrong shader_model
- Case sensitivity (should be insensitive by default)
- Missing `\n` at line endings
- Whitespace not matched (use `\s*`)
- Register numbers hardcoded (use `\d+`)

### Regex Compilation Failed

**Error:** `WARNING: PCRE2 regex compilation failed at offset N`

**Causes:**
- Invalid regex syntax
- Unmatched parentheses/brackets
- Invalid escape sequence
- Invalid backreference

**Solution:**
- Test regex at https://regex101.com/ (use PCRE2 flavor)
- Check error offset in pattern
- Validate escape sequences

Reference: ShaderRegex.cpp:145-164

### Assembly Failed After Patch

**Error:** `*** Assembling patched shader failed`

**Causes:**
- Invalid assembly syntax in replacement
- Register number mismatch
- Missing declarations
- Incorrect instruction format

**Solution:**
1. Enable `export_fixed = 1`
2. Check `{hash}-{type}_regex.txt` for errors
3. Verify replacement syntax matches assembly format
4. Check dcl_temps updated correctly

Reference: HackerContext.cpp:585-602

### Cache Issues

**Problem:** Changes not taking effect

**Solution:**
1. Delete `ShaderCache/*.dat` files
2. Reload config (F10)
3. Check shader_regex_hash in cache header
4. Verify no settings that invalidate cache changed

### Performance Issues

**Problem:** Game stutters when shaders load

**Solution:**
1. Reduce number of ShaderRegex groups
2. Make patterns more specific
3. Limit shader_model types
4. Let cache build (first load always slower)
5. Profile to identify expensive patterns

---

## Best Practices

### Pattern Design

1. **Be Specific:**
   - Match complete instruction sequences
   - Use exact constant buffer indices when possible
   - Include surrounding context

2. **Use Named Groups:**
   - Makes replacement more readable
   - Self-documenting patterns
   - Easier to maintain

3. **Test Thoroughly:**
   - Test on multiple shaders
   - Verify no false matches
   - Check assembly output

### Code Organization

```ini
; Group related patterns
[ShaderRegexStereo1]
; Character rendering stereo fix
shader_model = ps_5_0

[ShaderRegexStereo2]
; Environment stereo fix
shader_model = ps_5_0

[ShaderRegexStereo3]
; UI stereo fix
shader_model = ps_5_0
```

### Documentation

```ini
[ShaderRegexUE4Fix]
; Fixes UE4 shadow projection artifacts in stereo
; Matches world-view-projection matrix multiply
; Applies correction based on StereoParams
shader_model = ps_5_0
temps = stereo tmp1
```

### Debugging

1. **Enable Exports:**
   ```ini
   [Hunting]
   export_fixed = 1
   ```

2. **Use Marking:**
   ```ini
   [Hunting]
   marking_actions = regex
   ```

3. **Check Logs:**
   - Look for "ShaderRegex" in d3d11_log.txt
   - Check for compilation warnings
   - Verify match counts

---

## See Also

- [ShaderOverride](./shader-override.md) - Shader override sections
- [Custom Shader](./custom-shader.md) - Custom shader creation
- [Hunting](./debugging.md#hunting-mode) - Shader hunting techniques
- [Command List](./command-list.md) - Command list syntax
- [Troubleshooting](./troubleshooting.md#shader-compilation-errors) - Shader error resolution
