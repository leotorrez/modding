# ShaderOverride

ShaderOverride sections allow you to intercept and modify the behavior of specific shaders in DirectX 11 games. When a shader with a matching hash is used in a draw call, the ShaderOverride can execute custom commands, replace the shader, or conditionally alter the rendering pipeline.

## Overview

ShaderOverride sections are triggered when a shader (vertex, hull, domain, geometry, or pixel) is bound to the rendering pipeline and used in a draw call. They provide a powerful mechanism to:

- **Execute commands** when a specific shader is used
- **Replace shaders** dynamically based on conditions
- **Filter shader execution** based on depth buffer state or partner shaders
- **Control rendering state** (scissor clipping, render targets, etc.)
- **Inject resources** into the pipeline (textures, buffers, constants)
- **Skip draw calls** conditionally

ShaderOverride sections work for all shader stages: vertex shaders (VS), hull shaders (HS), domain shaders (DS), geometry shaders (GS), and pixel shaders (PS).

```ini
; Basic shader override
[ShaderOverrideCharacterOutline]
hash = abc12345def67890
; Execute commands when this shader is used
ps-t0 = ResourceCustomTexture
run = CustomCommandList

; Advanced filtering
[ShaderOverrideShadowPS]
hash = 123456789abcdef0
filter_index = 0.5
depth_filter = depth_active
run = ShadowCorrection
```

## Syntax

### Section Header

```ini
[ShaderOverride<UniqueIdentifier>]
```

The section name must start with `ShaderOverride` followed by any unique identifier. The identifier is for your reference only and doesn't affect functionality.

**Examples:**
```ini
[ShaderOverrideCharacterVS]
[ShaderOverride_UI_PixelShader]
[ShaderOverride1]
```

## How ShaderOverride Works

ShaderOverride sections are processed during draw calls, after shaders are bound but before the actual rendering happens:

1. **Shader Binding**: Game binds shaders to the pipeline (vertex, pixel, etc.)
2. **Hash Lookup**: 3DMigoto looks up each shader's hash in the ShaderOverride map
3. **Filter Evaluation**: If a match is found, depth_filter and filter_index conditions are checked
4. **Command Execution**: The override's command list runs before the draw call
5. **Draw Call**: The (possibly modified) draw call executes
6. **Post Commands**: Post command lists run after the draw call completes

ShaderOverride command lists run for every draw call that uses the matching shader, making them ideal for per-draw-call modifications.

Reference: HackerContext.cpp:820-858

---

## Properties Reference

### hash

**Type:** Hexadecimal (64-bit)  
**Required:** Yes  
**Default:** None

The 64-bit hash identifying the shader to match. This is the primary matching criterion for ShaderOverride sections.

```ini
[ShaderOverrideExample]
hash = abc12345def67890
```

**How to find shader hashes:**
1. Enable hunting mode with F10
2. Use frame analysis (F8) to dump shaders
3. Check `d3d11_log.txt` for shader hashes
4. Hunt shaders with numpad keys (see [Debugging](/docs/debugging.md))

The hash is computed from the shader bytecode, so identical shaders across different games will have the same hash.

**Use Case:** Every ShaderOverride section must specify exactly one shader hash.

Reference: IniHandler.cpp:2267-2271

---

### allow_duplicate_hash

**Type:** Boolean or `overrule`  
**Default:** `false`  
**Values:** `true`, `false`, `overrule`

Controls whether multiple ShaderOverride sections can use the same shader hash. By default, duplicate hashes generate a warning to help detect mod conflicts.

```ini
; Example 1: Cooperative duplicates (all sections must opt in)
[ShaderOverrideFromScript]
hash = abc12345def67890
allow_duplicate_hash = true
run = ScriptCommands

[ShaderOverrideUserCustomization]
hash = abc12345def67890
allow_duplicate_hash = true
run = UserCommands

; Example 2: Overrule (force allow even if other sections don't opt in)
[ShaderOverrideThirdPartyMod]
hash = abc12345def67890
allow_duplicate_hash = overrule
run = ThirdPartyCommands
```

**Values:**
- `false` (default): Warn if duplicate hash found
- `true`: Allow duplicate if all sections using this hash set `allow_duplicate_hash = true`
- `overrule`: Allow duplicate regardless of other sections' settings

**Use Case:** Use `true` when you intentionally want multiple mods to add commands to the same shader without merging sections. Use `overrule` when you can't modify another mod's configuration but have verified compatibility.

**Warning:** Using `allow_duplicate_hash` doesn't merge command lists - each section's commands run independently. Be cautious of conflicting commands between sections.

Reference: IniHandler.cpp:2156-2202

---

### depth_filter

**Type:** Enum  
**Default:** `none`  
**Values:** `none`, `depth_active`, `depth_inactive`  
**Status:** Deprecated

Filters shader execution based on whether a depth buffer is bound to the output merger stage.

```ini
[ShaderOverrideDepthEffect]
hash = abc12345def67890
depth_filter = depth_active
run = DepthBasedCommands
```

**Values:**
- `none`: No filtering (always execute)
- `depth_active`: Only execute when a depth buffer is bound
- `depth_inactive`: Only execute when no depth buffer is bound

::: warning DEPRECATED
This feature is deprecated. Use texture filtering with the `oD` pseudo-register instead for more flexibility:

```ini
[ShaderOverrideDepthEffect]
hash = abc12345def67890
x = oD
run = DepthBasedCommands

[DepthBasedCommands]
; Check if depth buffer is bound
if x == -0.0
    ; No depth buffer bound
else
    ; Depth buffer bound
endif
```

This approach provides:
- More flexible conditions (check specific depth buffers)
- Access to depth buffer properties
- Better integration with other filtering logic
:::

Reference: IniHandler.cpp:2204-2230, HackerContext.cpp:458-476

---

### model

**Type:** String  
**Default:** Empty (no filtering)

Filters shader execution based on the shader model. Only execute commands if the shader uses the specified model(s).

```ini
[ShaderOverrideSM5Only]
hash = abc12345def67890
model = ps_5_0
run = SM5Commands

[ShaderOverrideMultipleModels]
hash = 1234567890abcdef
model = vs_4_0 vs_5_0
run = VertexCommands
```

**Common shader models:**
- `vs_4_0`, `vs_5_0`: Vertex shaders
- `hs_5_0`: Hull shaders (tessellation)
- `ds_5_0`: Domain shaders (tessellation)
- `gs_4_0`, `gs_5_0`: Geometry shaders
- `ps_4_0`, `ps_5_0`: Pixel shaders
- `cs_4_0`, `cs_5_0`: Compute shaders

**Use Case:** Filter execution when the same hash appears in different shader stages or models (rare but possible).

Reference: IniHandler.cpp:2287-2290

---

### filter_index

**Type:** Float  
**Default:** `FLT_MAX` (no filtering)

Advanced filtering mechanism for partner shader matching. Enables shader pairs to communicate and conditionally execute based on whether specific shaders are bound together.

```ini
[ShaderOverrideCharacterVS]
hash = abc12345def67890
x = 0.5
filter_index = 0.5
run = CharacterVertexCommands

[ShaderOverrideCharacterPS]
hash = 1234567890abcdef
y = oVS
if y == 0.5
    ; Character vertex shader is active
    run = CharacterPixelCommands
endif
```

**How it works:**
1. One shader sets a variable to a specific value and sets `filter_index` to that value
2. Another shader reads `oVS` (vertex shader index), `oHS` (hull), `oDS` (domain), `oGS` (geometry), or `oPS` (pixel shader index)
3. The value will match the `filter_index` if that shader is currently bound, or `FLT_MAX` if not bound or no filter_index set

**Use Case:** Detect shader combinations (e.g., "only run this pixel shader override when used with specific vertex shader").

**Technical Note:** ShaderRegex sections can modify filter_index dynamically. The `backup_filter_index` stores the original value from INI.

Reference: IniHandler.cpp:2283-2285, globals.h:259

---

### disable_scissor

**Type:** Boolean  
**Default:** `false`  
**Status:** Backwards compatibility only

Disables scissor clipping for draw calls using this shader. This was used in the Nier: Automata fix for lighting issues.

```ini
[ShaderOverrideLightingFix]
hash = abc12345def67890
disable_scissor = true
```

::: tip MODERN ALTERNATIVE
This property is translated into equivalent command list syntax automatically:

```ini
; Instead of disable_scissor = true, use:
run = BuiltInCustomShaderDisableScissorClipping

; Instead of disable_scissor = false, use:
run = BuiltInCustomShaderEnableScissorClipping
```

The command list approach is more flexible and can be used conditionally.
:::

Reference: IniHandler.cpp:2296-2305

---

## Command Lists

ShaderOverride sections support command lists, allowing you to execute any 3DMigoto command when the shader is used. Commands run at two possible times:

### Pre-Commands (Default)

Commands without the `post` modifier run **before** the draw call executes.

```ini
[ShaderOverrideSetup]
hash = abc12345def67890
; These run before the draw call
ps-t0 = ResourceCustomTexture
x = 1.0
y = 2.0
run = CustomLogic
```

### Post-Commands

Commands with the `post` modifier run **after** the draw call completes.

```ini
[ShaderOverrideCleanup]
hash = abc12345def67890
; This runs after the draw call
post run = Cleanup
post ps-t0 = null
```

### Available Commands

All standard 3DMigoto commands work in ShaderOverride sections:

**Resource Bindings:**
```ini
ps-t0 = ResourceName          ; Bind texture to pixel shader slot 0
vs-cb0 = ResourceName         ; Bind constant buffer to vertex shader slot 0
```

**Variable Operations:**
```ini
x = 1.0                       ; Set variable
y = x + 2.0                   ; Expression evaluation
```

**Control Flow:**
```ini
if x == 1.0
    run = CommandList1
else
    run = CommandList2
endif
```

**Draw Calls:**
```ini
draw = auto                   ; Re-issue the current draw call
draw = 100, 0                 ; Draw with different parameters
```

**Shader Replacement:**
```ini
vs = ResourceShader           ; Replace vertex shader
ps = ResourceShader           ; Replace pixel shader
```

**Render State:**
```ini
handling = skip               ; Skip this draw call
run = CommandListName         ; Execute another command list
```

See [Command List](/docs/command-list.md) for complete command reference.

---

## Common Use Cases

### 1. Character Model Modifications

Replace textures or adjust shaders for specific character parts:

```ini
[ShaderOverrideCharacterSkin]
hash = abc12345def67890
ps-t0 = ResourceCustomSkinTexture
ps-t1 = ResourceCustomNormalMap
```

### 2. Shadow Correction

Fix shadow rendering issues in stereo 3D:

```ini
[ShaderOverrideShadowPS]
hash = 1234567890abcdef
ps-t125 = ResourceStereoParams
run = ShadowStereoCorrection
```

### 3. UI Depth Adjustment

Move UI elements to a specific depth:

```ini
[ShaderOverrideUI]
hash = fedcba9876543210
ps-cb0 = ResourceUIDepthBuffer
```

### 4. Conditional Rendering

Skip rendering based on custom conditions:

```ini
[ShaderOverrideOptionalEffect]
hash = abc12345def67890
if $toggle_effect == 0
    handling = skip
endif
```

### 5. Shader Pair Detection

Execute commands only when specific shader combinations are active:

```ini
[ShaderOverrideWaterVS]
hash = abc12345def67890
filter_index = 0.75
run = WaterVertexSetup

[ShaderOverrideWaterPS]
hash = fedcba9876543210
x = oVS
if x == 0.75
    ; Water vertex shader is active
    run = WaterPixelEffects
endif
```

### 6. Object Hiding/Showing

Hide objects by skipping their draw calls:

```ini
[ShaderOverrideHideObject]
hash = 1234567890abcdef
handling = skip

[Key1]
key = VK_F1
$show_object = 1
type = toggle

[ShaderOverrideToggleObject]
hash = 1234567890abcdef
if $show_object == 0
    handling = skip
endif
```

### 7. Resource Injection

Inject custom resources into shaders:

```ini
[ShaderOverrideCustomData]
hash = abc12345def67890
ps-t100 = ResourceCustomData
vs-cb13 = ResourceTransformBuffer
```

---

## Best Practices

### Finding Shader Hashes

1. **Enable hunting mode** (F10) to start hunting shaders
2. **Use frame analysis** (F8) to dump all shaders and their hashes to ShaderFixes/
3. **Check logs** - `d3d11_log.txt` contains shader hashes when loaded
4. **Hunt during gameplay** - Use numpad 1/2 to cycle through pixel shaders, 3/4 for vertex shaders

See [Debugging](/docs/debugging.md) for detailed hunting instructions.

### Performance Considerations

- **ShaderOverride runs per draw call** - Commands execute every time the shader is used
- **Use conditionals to minimize work** - Skip unnecessary operations with `if` statements
- **Be careful with heavy operations** - Avoid complex calculations in frequently-used shaders
- **Consider filtering** - Use `filter_index` or `depth_filter` to limit execution

### Organization

```ini
; Group related overrides together
; Character model overrides
[ShaderOverrideCharacterHead]
hash = abc12345def67890
; ...

[ShaderOverrideCharacterBody]
hash = 1234567890abcdef
; ...

; UI overrides
[ShaderOverrideUIBackground]
hash = fedcba9876543210
; ...
```

### Duplicate Hash Management

When multiple mods need to override the same shader:

1. **Check for conflicts** - Look for duplicate hash warnings in logs
2. **Use allow_duplicate_hash** if sections don't conflict:
   ```ini
   [ShaderOverrideMod1]
   hash = abc12345def67890
   allow_duplicate_hash = true
   ps-t0 = ResourceMod1
   
   [ShaderOverrideMod2]
   hash = abc12345def67890
   allow_duplicate_hash = true
   vs-cb0 = ResourceMod2
   ```
3. **Merge sections** if commands conflict or order matters
4. **Use overrule sparingly** - Only when you can't modify the other mod

### Testing

Always test ShaderOverride sections:

```ini
[ShaderOverrideTest]
hash = abc12345def67890
; Add a visual indicator to verify override is working
ps-t0 = ResourceTestPattern
```

Enable log output to verify execution:

```ini
[Logging]
calls = 1
```

Then check `d3d11_log.txt` for "override found for shader" messages.

---

## Troubleshooting

### Override Not Executing

**Problem:** ShaderOverride section defined but commands not running.

**Solutions:**
1. **Verify hash is correct** - Check `d3d11_log.txt` or use frame analysis to confirm shader hash
2. **Check for typos** - Ensure section name starts with `ShaderOverride`
3. **Look for duplicate warnings** - If another mod uses the same hash, add `allow_duplicate_hash`
4. **Enable logging** - Set `calls = 1` in `[Logging]` to see if override is found
5. **Check conditions** - If using `if` statements, verify conditions are true

### Hash Changes Between Sessions

**Problem:** Shader hash works one day but not the next.

**Solutions:**
1. **Game patched** - Game updates may change shader code and thus hashes
2. **Different shader variations** - Some games compile shaders differently based on settings
3. **Use ShaderRegex** - For more robust matching, consider [Shader Regex](/docs/shader-regex.md) instead

### Commands Not Taking Effect

**Problem:** Commands execute but don't seem to work.

**Solutions:**
1. **Check resource exists** - Verify referenced resources are defined
2. **Verify slot numbers** - Ensure you're binding to the correct shader slots (check assembly)
3. **Check timing** - Some operations need `post` modifier to run after draw call
4. **Test in isolation** - Comment out other commands to find conflicts

### Performance Issues

**Problem:** Game slows down after adding ShaderOverride.

**Solutions:**
1. **Check execution frequency** - Shader might be used more than you think
2. **Add conditions** - Use `if` to skip unnecessary work
3. **Optimize command lists** - Reduce number of commands or combine operations
4. **Consider alternatives** - Some effects might work better as TextureOverride or Custom Shader

### Depth Filter Not Working

**Problem:** `depth_filter` doesn't filter as expected.

**Solutions:**
1. **Verify depth buffer state** - Use frame analysis to see if depth buffer is actually bound
2. **Consider migration** - `depth_filter` is deprecated; use `oD` register instead:
   ```ini
   x = oD
   if x == -0.0
       ; No depth buffer
   else
       ; Depth buffer active
   endif
   ```

### Filter Index Not Matching

**Problem:** `filter_index` partner detection not working.

**Solutions:**
1. **Check both shaders** - Verify both VS and PS overrides are being executed
2. **Verify value matches** - Ensure the filter_index value exactly matches what you're checking
3. **Use correct register** - Use `oVS` for vertex shader index, `oPS` for pixel shader, etc.
4. **Debug with logging** - Print the value to verify:
   ```ini
   x = oVS
   run = LogValue  ; Create a command list that visualizes x
   ```

---

## Related Documentation

- [TextureOverride](/docs/texture-override.md) - Override textures and buffers
- [Command List](/docs/command-list.md) - Complete command reference
- [Custom Shader](/docs/custom-shader.md) - Write custom shader code
- [Shader Regex](/docs/shader-regex.md) - Pattern-based shader matching and patching
- [Debugging](/docs/debugging.md) - Hunting and frame analysis
- [Resource](/docs/resource.md) - Define custom resources
- [Constants](/docs/constants.md) - IniParams and variables
- [Override](/docs/override.md) - Override section syntax
