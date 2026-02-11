# Troubleshooting

This page documents common errors, warnings, and issues encountered when using 3dmigoto, along with their solutions. Errors are displayed both on-screen (for critical issues) and in the d3dx.log file.

::: tip
Enable `show_warnings=1` in [Logging] to see warnings on-screen for easier troubleshooting.
:::

## Installation and Loading Issues

### DLL Loading Failures

**Error:** `LoadLibrary on original_d3d11.dll failed`

**Cause:** 3dmigoto cannot find or load the original DirectX 11 DLL.

**Solutions:**
- Ensure d3d11.dll is installed in the correct game directory
- Check that you're not missing DirectX runtime dependencies
- Verify Windows is up to date (try `allow_platform_update=1`)
- If using `module` to specify an alternate DLL, verify the path is correct

Reference: D3D11Wrapper.cpp:433

---

**Error:** `FATAL: Unsupported DirectX Version!`

**Cause:** The game is not using DirectX 11.

**Solutions:**
- Verify the game uses DirectX 11 (check game settings or documentation)
- If the game offers multiple DirectX versions, select DirectX 11
- 3dmigoto does not support DirectX 9, 10, or 12

Reference: HookedDXGI.cpp:185

---

**Error:** `3DMigoto does not support DirectX 12`

**Cause:** The game is attempting to use DirectX 12.

**Solution:**
- Set the game to use DirectX 11 in its graphics settings
- Some games label this as "DX11" or "DirectX 11" mode

Reference: HookedDXGI.cpp:206

---

### Device/Context Creation Failures

**Error:** `returns E_NOINTERFACE as error for ID3D11Device1`

**Cause:** Windows platform update not installed or unavailable.

**Solution:**
- Add `allow_platform_update=1` to [System] in d3dx.ini
- This enables DirectX 11.1+ features required by some games
- Update Windows to the latest version

Reference: HackerDevice.cpp:1544

---

## Shader Compilation Errors

Shader compilation errors are displayed on-screen and in d3dx.log. These errors occur when 3dmigoto attempts to compile custom shaders or reload modified shaders.

### Common Shader Errors

**Error:** `Error assembling <shader>: <error message>`

**Causes:**
- Syntax errors in shader assembly code
- Invalid register assignments
- Incompatible shader instructions for target shader model
- Missing or incorrect shader declarations

**Solutions:**
1. Check the shader assembly syntax in the .txt file
2. Verify register declarations match shader inputs/outputs
3. Ensure shader model (vs_5_0, ps_5_0, etc.) is correct
4. Use a shader decompiler to compare with original shader structure
5. Check for typos in instruction names or register names

Reference: HackerDevice.cpp:892, Hunting.cpp:621

---

**Error:** `Error compiling custom shader <filename>`

**Cause:** HLSL compilation failed for custom shader.

**Solutions:**
1. Check HLSL syntax - common issues include:
   - Missing semicolons
   - Undefined variables or functions
   - Type mismatches
   - Missing return statements
2. Verify shader entry point matches `EntryPoint` in INI
3. Ensure shader model in `[CustomShader]` matches shader code
4. Check include paths for `#include` directives
5. Review shader compilation errors in d3dx.log (look for "HLSL errors" section)

Reference: CommandList.cpp:1904

---

**Error:** `disassembly of original shader failed`

**Cause:** 3dmigoto cannot disassemble a shader from its bytecode.

**Possible Reasons:**
- Corrupted shader bytecode
- Unsupported shader format
- Protected/obfuscated shader code

**Solutions:**
- Try hunting the shader again to re-extract it
- If persistent, the shader may use features incompatible with disassembly
- Check if the game uses shader protection/obfuscation

Reference: HackerDevice.cpp:697

---

**Error:** `error while decompiling`

**Cause:** HLSL decompilation failed.

**Note:** This is expected for some shaders. 3dmigoto will fall back to assembly mode.

**Solution:**
- Edit the shader in assembly (.txt) format instead of HLSL
- If you need HLSL, try a third-party decompiler

Reference: HackerDevice.cpp:956, Hunting.cpp:353

---

**Error:** `WARNING: Unable to locate end of shader declarations!`

**Cause:** ShaderRegex cannot parse shader structure.

**Impact:** Shader regex replacements may fail or produce incorrect results.

**Solution:**
- Review shader assembly structure
- Ensure shader declarations section is properly formatted
- This is a ShaderRegex limitation for certain shader patterns

Reference: ShaderRegex.cpp:52

---

### Shader Reload Errors

**Error:** `failed to find original shader in mReloadedShaders`

**Cause:** Trying to reload a shader that wasn't marked or doesn't exist in ShaderFixes.

**Solution:**
- Hunt and mark the shader first (press the marking key)
- Ensure the shader .txt file exists in ShaderFixes directory
- Check that the shader hash matches the filename

Reference: Hunting.cpp:727

---

**Error:** `cached shader found, but lacks a matching .txt file`

**Cause:** Shader binary exists but source .txt file is missing.

**Solution:**
- Restore the .txt file from backup
- Re-hunt and mark the shader to regenerate the .txt file
- If intentionally removed, delete the .bin file too

Reference: Hunting.cpp:958

---

## INI Configuration Errors

INI parsing errors are logged to d3dx.log and may appear on-screen if `show_warnings=1` is enabled.

### Parsing Errors

**Error:** `Floating point parse error: <key>=<value>`

**Cause:** Invalid number format for a float parameter.

**Solutions:**
- Use valid float syntax: `1.0`, `.5`, `3.14`, `1e-3`
- Avoid non-numeric characters except `.`, `-`, `+`, `e`
- Check for extra spaces or typos

Reference: IniHandler.cpp:1005

---

**Error:** `Integer parse error: <key>=<value>`

**Cause:** Invalid number format for an integer parameter.

**Solutions:**
- Use valid integer syntax: `0`, `123`, `-5`
- Hex format: `0x1A2B`
- Don't use decimals for integer fields
- Check for typos or non-numeric characters

Reference: IniHandler.cpp:1034

---

**Error:** `Boolean parse error: <key>=<value>`

**Cause:** Invalid value for a boolean parameter.

**Solutions:**
- Use valid boolean values: `true`, `false`, `1`, `0`
- Case-insensitive: `True`, `TRUE`, `False`, `FALSE` also work
- Don't use other values like `yes`, `no`, `on`, `off`

Reference: IniHandler.cpp:1074

---

**Error:** `Hash parse error: <key>=<hash>`

**Cause:** Invalid hash value format.

**Solutions:**
- Use 16-digit hex format: `0123456789abcdef`
- Don't include `0x` prefix for hash values
- Ensure exactly 16 hex digits for shader hashes
- Use 8 hex digits for texture hashes

Reference: IniHandler.cpp:1094

---

**Error:** `Hex string parse error: <key>=<value>`

**Cause:** Invalid hexadecimal string format.

**Solutions:**
- Use even number of hex digits
- Valid characters: `0-9`, `a-f`, `A-F`
- Don't include spaces or `0x` prefix

Reference: IniHandler.cpp:1118

---

### Section Errors

**Error:** `Section missing Hash=`

**Cause:** `[ShaderOverride]` or `[TextureOverride]` section requires a hash value.

**Solutions:**
- Add `hash=<shader_hash>` to `[ShaderOverride*]` sections
- Add `hash=<texture_hash>` to `[TextureOverride*]` sections
- For `[TextureOverride]`, you can use fuzzy matching instead (match_width, match_height, etc.)

Reference: IniHandler.cpp:2269, 3218

---

**Error:** `RegEx section missing shader_model`

**Cause:** `[ShaderRegex]` section requires shader_model to be specified.

**Solution:**
- Add `shader_model = vs_5_0` (or ps_5_0, cs_5_0, etc.) to the section
- Shader model must match the shaders you're targeting

Reference: IniHandler.cpp:2373

---

**Error:** `Command not terminated`

**Cause:** Command list command is missing proper termination or has syntax error.

**Solutions:**
- Ensure all commands end with proper syntax
- Check for missing closing brackets in resource references
- Verify operator syntax in expressions
- Look for unmatched parentheses

Reference: CommandList.cpp:5479

---

**Error:** `Statement "endif" missing "if"`

**Cause:** `endif` command without corresponding `if`.

**Solution:**
- Ensure every `endif` has a matching `if` before it
- Check indentation and structure of conditional blocks
- Review command list flow control logic

Reference: CommandList.cpp:5340

---

**Error:** `Statement "if" missing "endif"`

**Cause:** `if` command without corresponding `endif`.

**Solution:**
- Add `endif` to close the conditional block
- Every `if` must have exactly one `endif`

Reference: CommandList.cpp:5452

---

### Variable Errors

**Error:** `Illegal local variable name: "<name>"`

**Cause:** Variable name uses reserved or invalid characters.

**Solutions:**
- Variable names cannot start with special prefixes reserved by 3dmigoto
- Avoid names like `IniParams`, `StereoParams`, `rt`, `cb`, etc.
- Use alphanumeric names starting with lowercase letter

Reference: CommandList.cpp:384

---

**Error:** `Illegal redeclaration of local variable "<name>"`

**Cause:** Attempting to declare a local variable that already exists.

**Solution:**
- Use unique variable names within a command list
- Remove duplicate `local $var` declarations
- Reuse the variable without redeclaring it

Reference: CommandList.cpp:394

---

**Error:** `Undeclared variable <name>`

**Cause:** Using a variable that hasn't been declared with `local`.

**Solutions:**
- Add `local $variable = 0` before using the variable
- Check variable name spelling
- Ensure the variable is declared in an earlier command

Reference: Override.cpp:49

---

## Conflicts and Duplicates

### Mod Conflicts

**Warning:** `Possible Mod Conflict: Duplicate ShaderOverride hash=<hash>`

**Cause:** Multiple mods or INI files are overriding the same shader.

**Impact:**
- Only the last loaded override takes effect
- Previous overrides are silently replaced
- Mod behavior may be unexpected

**Solutions:**
1. **Identify conflicting mods:**
   - Check which INI files contain the duplicate hash
   - Review load order (alphabetical by INI filename)
2. **Resolve conflict:**
   - Merge the shader overrides into one section
   - Disable one of the conflicting mods
   - Rename INI files to change load order (later = higher priority)
3. **For mod authors:**
   - Use unique section names: `[ShaderOverrideYourModName_Purpose]`
   - Document known conflicts
   - Consider using `[ShaderRegex]` instead for broader patterns

Reference: IniHandler.cpp:2194

---

**Warning:** `Possible Mod Conflict: Duplicate TextureOverride hash=<hash>`

**Cause:** Multiple mods are overriding the same texture.

**Solutions:**
- Same as ShaderOverride conflicts above
- Review which mod should have priority
- Merge texture replacements if both are needed

Reference: IniHandler.cpp:3139

---

**Warning:** `Detected a conflicting d3dx.ini in the game directory that is not being used`

**Cause:** Multiple d3dx.ini files exist and 3dmigoto loaded a different one than expected.

**Solutions:**
- Remove unused d3dx.ini files
- Keep only one d3dx.ini in the game directory
- Check if multiple mod installations created duplicate files

Reference: IniHandler.cpp:4096

---

**Warning:** `Duplicate section found - [<section>]`

**Cause:** Section name is used more than once.

**Impact:**
- Sections are merged (all keys combined)
- May cause unexpected behavior if sections conflict
- Later keys override earlier ones with same name

**Solutions:**
- Use unique section names
- For command lists: `[CommandListName1]`, `[CommandListName2]`, etc.
- For shader overrides: include mod name in section

Reference: IniHandler.cpp:415

---

**Warning:** `Duplicate key found: <key>`

**Cause:** Same key appears multiple times in a section (outside command lists).

**Impact:**
- Last value wins
- Earlier values are ignored
- May indicate configuration error

**Solutions:**
- Remove duplicate keys
- For command lists, duplicates are allowed and intentional
- For other sections, keep only one definition of each key

Reference: IniHandler.cpp:545

---

## Resource Issues

### Resource Loading Errors

**Error:** `Failed to load custom texture resource <filename>: 0x<hresult>`

**Cause:** Cannot load texture file (DDS, PNG, JPG, etc.).

**Solutions:**
1. **File not found:**
   - Verify file exists at specified path
   - Check for typos in filename
   - Ensure path is relative to d3dx.ini location
2. **Invalid format:**
   - Ensure DDS format is valid
   - Check texture dimensions are power-of-2 if required
   - Verify format matches `format=` specification
3. **Memory issues:**
   - Texture may be too large
   - Check available GPU memory
   - Try smaller texture dimensions

Reference: CommandList.cpp:4350

---

**Error:** `Failed to load custom buffer resource <filename>: <error>`

**Cause:** Cannot load buffer data from file.

**Solutions:**
- Verify file exists and is readable
- Check file size matches expected buffer size
- Ensure file is not corrupted
- Verify byte_stride matches data layout

Reference: CommandList.cpp:4271

---

**Error:** `Out of memory loading <filename>`

**Cause:** Insufficient memory to load resource.

**Solutions:**
- Close other applications to free memory
- Reduce texture sizes
- Check for memory leaks in other mods
- Verify file size is reasonable

Reference: CommandList.cpp:4278

---

**Error:** `Resource copy failed <operation>: 0x<hresult>`

**Cause:** DirectX failed to copy resource data.

**Common HRESULT codes:**
- `0x80070057` (E_INVALIDARG): Invalid parameters (size mismatch, format incompatibility)
- `0x8007000E` (E_OUTOFMEMORY): Out of memory
- `0x887A0005` (DXGI_ERROR_DEVICE_REMOVED): GPU device lost

**Solutions:**
1. **Format mismatch:**
   - Ensure source and destination formats are compatible
   - Check resource dimensions match
   - Verify MSAA sample counts match
2. **Size mismatch:**
   - Source and destination must have same dimensions
   - For buffers, sizes must match exactly
3. **Device removed:**
   - GPU driver crash - check Windows Event Viewer
   - Update GPU drivers
   - Reduce graphics settings

Reference: CommandList.cpp:4136

---

**Error:** `Failed to substantiate custom <type> [<name>]: 0x<hresult>`

**Cause:** Cannot create DirectX resource with specified properties.

**Solutions:**
- Check format is supported by GPU (see [Resource](./resource.md) for format list)
- Verify dimensions are valid
- Ensure bind_flags are compatible with resource type
- Check usage flags are valid combination
- Reduce size if memory is issue

Reference: CommandList.cpp:4416

---

### Resource Type Limitations

**Error:** `Dynamic Buffers unsupported`

**Cause:** Inter-device buffer transfer doesn't support dynamic buffers.

**Workaround:**
- Use staging buffers instead
- This is a 3dmigoto limitation for cross-device operations

Reference: CommandList.cpp:4698

---

**Error:** `MSAA resources unsupported`

**Cause:** Inter-device transfer doesn't support MSAA textures.

**Workaround:**
- Resolve MSAA texture before transfer
- Use `ResolveSubresource` command

Reference: CommandList.cpp:4803

---

**Error:** `depth/stencil buffers unsupported`

**Cause:** Inter-device transfer of depth/stencil formats is problematic.

**Note:** May work but not guaranteed. 3dmigoto will attempt anyway with warning.

Reference: CommandList.cpp:4748, 4812

---

### View Creation Errors

**Error:** `Resource copy CreateCompatibleView failed: 0x<hresult>`

**Cause:** Cannot create view for resource copy operation.

**Solutions:**
- Check resource format supports required view type
- Verify bind_flags include necessary flags (e.g., RENDER_TARGET, SHADER_RESOURCE)
- Ensure format is not typeless or incompatible

Reference: CommandList.cpp:6971

---

**Error:** `No view and unable to create view to clear resource`

**Cause:** Resource clear operation requires a view but none exists.

**Solution:**
- Ensure resource has appropriate bind_flags
- For render target clear: bind_flags must include RENDER_TARGET
- For depth/stencil clear: bind_flags must include DEPTH_STENCIL

Reference: CommandList.cpp:7350

---

## Hunting and Frame Analysis

### Hunting Errors

**Error:** `marking_actions=mono_snapshot: Unable to get back buffer`

**Cause:** Cannot access back buffer for screenshot.

**Solutions:**
- Ensure hunting is enabled
- Check game is rendering correctly
- Verify d3dx.ini has proper Present hooks

Reference: Hunting.cpp:290

---

**Error:** `Frame Analysis Context is missing: Restart the game with hunting enabled`

**Cause:** Frame analysis triggered without hunting mode enabled.

**Solution:**
- Enable hunting in d3dx.ini: `hunting=1` or `hunting=2`
- Restart the game
- Press the frame analysis key

Reference: Hunting.cpp:1234

---

**Error:** `Frame analysis aborted`

**Cause:** Frame analysis was cancelled (user pressed cancel key or error occurred).

**Note:** This is informational, not necessarily an error.

Reference: Hunting.cpp:1243

---

### Frame Analysis Dump Errors

**Error:** `Failed to dump Texture2D <src> -> <dst>: 0x<hresult>`

**Cause:** Cannot save texture to file during frame analysis.

**Solutions:**
- Check disk space available
- Verify FrameAnalysis folder is writable
- Ensure filename is valid
- Check texture format is dumpable

Reference: FrameAnalysis.cpp:531

---

**Error:** `DumpBuffer failed to map staging resource: 0x<hresult>`

**Cause:** Cannot map buffer for reading during dump.

**Solutions:**
- Check buffer has appropriate CPU access flags
- Ensure buffer is not in use by GPU
- Verify device is not lost

Reference: FrameAnalysis.cpp:1657, 1708

---

**Error:** `Cannot dump vertex buffer with stride=0`

**Cause:** Vertex buffer has unknown stride.

**Solution:**
- This is usually automatic detection failure
- Buffer cannot be dumped in structured format
- Will be dumped as raw bytes instead

Reference: FrameAnalysis.cpp:1360

---

## System and Platform Issues

### Driver Profile Errors

**Warning:** `WARNING: Profile update failed!`

**Cause:** Cannot update NVIDIA driver profile settings.

**Impact:**
- Profile settings in [Profile] section won't apply
- May affect stereo 3D or driver-specific features

**Solutions:**
- Run game as administrator
- Ensure NVIDIA drivers are installed
- Check profile helper can access driver settings

Reference: nvprofile.cpp:1797

---

**Warning:** `WARNING: Duplicate driver profile setting ID found: 0x<id>`

**Cause:** Same NVIDIA profile setting specified multiple times.

**Solution:**
- Remove duplicate entries from [Profile] section
- Last value will be used

Reference: nvprofile.cpp:1193

---

### Input and Keybinding Errors

**Warning:** `WARNING: UNABLE TO PARSE KEY BINDING <key>=<value>`

**Cause:** Invalid key binding syntax in [Key] section.

**Solutions:**
- Use valid key names (see [Key](./key.md) for list)
- Check syntax: `key = VK_F10`
- Don't use invalid key codes
- Verify no typos in key names

Reference: input.cpp:453

---

### Cursor Hooking Errors

**Error:** `Failed to hook mouse cursor functions - hide_cursor will not work`

**Cause:** Cannot hook Windows cursor API.

**Impact:**
- `hide_cursor` option won't work
- Cursor will remain visible even if configured to hide

**Solutions:**
- Run game as administrator
- Check for conflicts with other software hooking cursor
- Some games may have incompatible cursor handling

Reference: cursor.cpp:357

---

## Performance and Stability

### Potential Deadlocks

**Warning:** `Potential deadlock scenario detected: Lock <A> taken after <B>`

**Cause:** Internal lock ordering violation detected.

**Impact:**
- May cause game to freeze or hang
- This is a 3dmigoto internal issue

**Action:**
- Report to 3dmigoto developers with d3dx.log
- Include steps to reproduce if possible

Reference: lock.cpp:282

---

### Device Removal

**Error:** `DXGI_ERROR_DEVICE_REMOVED` (HRESULT 0x887A0005)

**Cause:** GPU device lost (driver crash, TDR, hardware failure).

**Symptoms:**
- Game crashes or freezes
- Black screen
- DirectX errors

**Solutions:**
1. **Update drivers:**
   - Install latest GPU drivers
   - Use DDU to clean install if needed
2. **Check for overheating:**
   - Monitor GPU temperature
   - Improve case cooling
3. **Reduce load:**
   - Lower graphics settings
   - Reduce resolution
   - Disable resource-intensive mods
4. **Check Windows Event Viewer:**
   - Look for display driver errors
   - Note error codes for troubleshooting
5. **Hardware issues:**
   - Test GPU with stress testing tools
   - Check for hardware defects

---

### Command List Recursion

**Error:** `Command list recursion limit exceeded! Circular reference?`

**Cause:** Command list calls itself directly or indirectly, creating infinite loop.

**Example:**
```ini
[CommandListA]
run = CommandListB

[CommandListB]
run = CommandListA  ; Circular reference!
```

**Solution:**
- Review command list call graph
- Remove circular references
- Restructure command lists to avoid recursion

Reference: CommandList.cpp:129

---

## Deprecated Features

**Notice:** `[<section>] used deprecated depth_filter option`

**Cause:** Using old `depth_filter` parameter instead of current syntax.

**Solution:**
- Replace `depth_filter=<value>` with current filtering syntax
- See [ShaderOverride](./override.md) for current options
- Update old INI files to new syntax

Reference: IniHandler.cpp:2207

---

**Notice:** `Deprecated hook options: Please remove "except" and "skip" options`

**Cause:** Using obsolete `except` or `skip` hook options.

**Solution:**
- Remove these options from [Device] or [Present] sections
- Use current hook configuration syntax
- Check documentation for current hook options

Reference: IniHandler.cpp:4213

---

## Bug Reports

Some errors indicate internal 3dmigoto bugs. These messages start with "BUG:" and should be reported to developers:

**Pattern:** `BUG: <description>`

**Examples:**
- `BUG: Unknown shader filter type`
- `BUG: Unhandled operand type`
- `BUG: Non-evaluatable expression, please report this and provide your d3dx.ini`

**Action:**
1. Copy full error message from d3dx.log
2. Note what you were doing when error occurred
3. Create minimal reproduction case if possible
4. Report to 3dmigoto issue tracker with:
   - Full error message
   - Relevant d3dx.ini sections
   - Steps to reproduce
   - 3dmigoto version

Reference: CommandList.cpp (multiple locations)

---

## Best Practices for Troubleshooting

### Enable Logging
```ini
[Logging]
; Show warnings on screen
show_warnings = 1

; More detailed logging
calls = 1
debug = 1
```

### Check Load Order
- INI files load alphabetically
- Later files override earlier ones
- Rename files to control priority: `01-base.ini`, `02-mod.ini`, `99-final.ini`

### Isolate Issues
1. Disable all mods except one
2. Test if issue persists
3. Add mods back one at a time
4. Identify which mod causes conflict

### Verify Files
- Check INI syntax carefully
- Use text editor with syntax highlighting
- Validate hash values are correct length
- Ensure file paths are correct

### Monitor Logs
- Check d3dx.log after every test
- Look for warnings even if no visible error
- Note timestamps to correlate with actions
- Search log for error keywords: "error", "failed", "warning", "BUG"

### Test Incrementally
- Make one change at a time
- Test after each change
- Keep backups of working configurations
- Document what each change does

---

## See Also

- [Debugging](./debugging.md) - Debugging techniques and tools
- [Logs](./logs.md) - Log file format and interpretation
- [Key](./key.md) - Keybinding configuration
- [Glossary](./glossary.md) - Terminology reference
