# Override Sections

Override sections are the foundation of 3DMigoto modding. They allow you to intercept specific game objects (shaders, textures, buffers) as they are used during rendering and modify their behavior. The two main override types are **ShaderOverride** and **TextureOverride**, each serving distinct purposes in the rendering pipeline.

## Overview

Override sections work by matching against identifiable properties of rendering objects:

- **ShaderOverride** - Matches shaders by their hash and executes commands when that shader is used in a draw call
- **TextureOverride** - Matches textures/buffers by hash or properties and executes commands when bound to the pipeline

When a match occurs, the override section can:
- Execute custom commands
- Replace resources (textures, buffers, shaders)
- Modify rendering state
- Skip rendering operations
- Inject custom data

```ini
; ShaderOverride - Executed when shader is used
[ShaderOverrideCharacterShader]
hash = abc12345def67890
ps-t0 = ResourceCustomTexture
run = CustomCommands

; TextureOverride - Executed when texture is bound
[TextureOverrideCharacterTexture]
hash = fedcba98
ps-t1 = ResourceReplacementTexture
```

## ShaderOverride vs TextureOverride

Understanding when to use each override type is crucial:

| Feature | ShaderOverride | TextureOverride |
|---------|---------------|-----------------|
| **Matches** | Shaders (VS, HS, DS, GS, PS) | Textures and buffers |
| **Hash Size** | 64-bit (16 hex chars) | 32-bit (8 hex chars) |
| **When Triggered** | During draw calls using the shader | When resource is bound to pipeline |
| **Primary Use** | Draw call modifications, shader logic | Resource replacement, buffer modifications |
| **Fuzzy Matching** | No | Yes (match by properties) |
| **Vertex Limit Raise** | No | Yes |
| **Filtering** | depth_filter, filter_index, model | Extensive fuzzy matching properties |

### When to Use ShaderOverride

Use ShaderOverride when you need to:
- Modify behavior for specific draw calls
- Detect shader combinations (vertex + pixel shader pairs)
- Skip rendering specific objects
- Replace or modify shaders
- Execute logic based on which shader is active

```ini
[ShaderOverrideHideObject]
hash = abc12345def67890
handling = skip
```

### When to Use TextureOverride

Use TextureOverride when you need to:
- Replace textures or buffers
- Increase vertex buffer sizes (vertex limit raise)
- Match resources by properties (size, format, type)
- Modify texture dimensions or formats
- Control buffer behavior

```ini
[TextureOverrideCustomTexture]
hash = fedcba98
ps-t0 = ResourceNewTexture
```

---

## Common Properties

These properties work in both ShaderOverride and TextureOverride sections (with some restrictions noted).

### hash

**Type:** Hexadecimal  
**Required:** Yes (unless using fuzzy matching in TextureOverride)

The primary identifier for matching game objects.

```ini
; ShaderOverride: 64-bit hash (16 hex characters)
[ShaderOverrideExample]
hash = abc12345def67890

; TextureOverride: 32-bit hash (8 hex characters)
[TextureOverrideExample]
hash = fedcba98
```

**Finding Hashes:**
1. Enable hunting mode (F10)
2. Use frame analysis (F8)
3. Check d3d11_log.txt
4. Hunt with numpad keys during gameplay

See [Debugging](/docs/debugging.md) for detailed instructions.

Reference: IniHandler.cpp:2267-2271 (ShaderOverride), IniHandler.cpp:2880-2894 (TextureOverride)

---

### handling

**Type:** Enum  
**Default:** None  
**Values:** `skip`, `abort`

Controls how the current operation is handled.

```ini
; Skip rendering this object
[ShaderOverrideHideObject]
hash = abc12345def67890
handling = skip

; Stop processing further (rarely used)
[TextureOverrideAbort]
hash = fedcba98
handling = abort
```

**Values:**
- `skip`: Skip the current draw call or resource binding
- `abort`: Stop processing command list immediately

**Use Case:** Most commonly used to hide objects by skipping their draw calls.

Reference: CommandList.cpp (handling command implementation)

---

### Resource Bindings

Bind custom resources to shader slots.

#### Vertex Buffers (vb0-vb31)

```ini
[TextureOverrideCustomModel]
hash = abc12345
vb0 = ResourcePositionBuffer
vb1 = ResourceTexcoordBuffer
```

**Use Case:** Replace vertex data (positions, normals, texcoords) for custom models.

#### Index Buffer (ib)

```ini
[TextureOverrideCustomModel]
hash = abc12345
ib = ResourceIndexBuffer
```

**Use Case:** Replace index buffer for custom geometry. Only one index buffer per draw call.

#### Shader Resource Views (ps-t*, vs-t*, etc.)

```ini
[ShaderOverrideCustomTextures]
hash = abc12345def67890
ps-t0 = ResourceDiffuse      ; Pixel shader texture slot 0
ps-t1 = ResourceNormal       ; Pixel shader texture slot 1
vs-t0 = ResourceVertexData   ; Vertex shader texture slot 0
```

**Common Texture Slots:**
- `t0`: Diffuse/albedo texture
- `t1`: Normal map or lightmap
- `t2`: Specular/metallic map
- `t3`: Shadow ramp or other data

::: warning GAME-SPECIFIC
Texture slot conventions vary by game engine. Use frame analysis to determine which slots contain which data for your specific game.
:::

#### Constant Buffers (ps-cb*, vs-cb*, etc.)

```ini
[ShaderOverrideCustomData]
hash = abc12345def67890
vs-cb0 = ResourceTransformData
ps-cb1 = ResourceMaterialData
```

**Use Case:** Inject custom constant buffer data into shaders.

Reference: CommandList.cpp (resource binding commands)

---

### Draw Commands

#### drawindexed

**Type:** `auto` or parameters  
**Applies to:** Both override types

Re-issue the draw call with potentially modified parameters.

```ini
; Re-issue with same parameters
[TextureOverrideRedraw]
hash = abc12345
drawindexed = auto

; Re-issue with custom parameters
[TextureOverrideCustomDraw]
hash = abc12345
drawindexed = 1000, 0, 0, 0, 0
```

**Use Case:** Re-render an object with modified resources or state. Often used with `handling = skip` to replace the original draw call.

**Pattern:**
```ini
[TextureOverrideReplace]
hash = abc12345
handling = skip         ; Skip original draw
vb0 = ResourceNewVB     ; Replace resources
ib = ResourceNewIB
drawindexed = auto      ; Re-draw with new resources
```

Reference: See [Draw Calls](/docs/draw-calls.md) for complete draw command documentation.

#### draw

**Type:** Vertex count, start vertex  
**Applies to:** Both override types

Issue a non-indexed draw call.

```ini
[TextureOverrideDraw]
hash = abc12345
draw = 100, 0    ; Draw 100 vertices starting at vertex 0
```

**Use Case:** Draw calls without index buffers. Less common than drawindexed.

Reference: See [Draw Calls](/docs/draw-calls.md)

---

### run

**Type:** String (command list name)  
**Applies to:** Both override types

Execute a named command list.

```ini
[ShaderOverrideComplex]
hash = abc12345def67890
run = CustomLogic

[CustomLogic]
if $condition == 1
    ps-t0 = ResourceA
else
    ps-t0 = ResourceB
endif
```

**Use Case:** Complex conditional logic, multiple operations, organized code structure.

Reference: See [Command List](/docs/command-list.md) for command syntax.

---

### filter_index

**Type:** Float  
**Applies to:** ShaderOverride

Enable partner shader detection.

```ini
[ShaderOverrideVertexShader]
hash = abc12345def67890
x = 0.5
filter_index = 0.5

[ShaderOverridePixelShader]
hash = fedcba9876543210
y = oVS    ; Read vertex shader filter_index
if y == 0.5
    ; Specific VS is active
    ps-t0 = ResourceCustomTexture
endif
```

**Use Case:** Execute commands only when specific shader combinations are active.

Reference: See [ShaderOverride](/docs/shader-override.md) for complete filter_index documentation.

---

### match_priority (TextureOverride only)

**Type:** Integer  
**Default:** `0`  
**Applies to:** TextureOverride only

Set evaluation priority when multiple fuzzy matches could apply.

```ini
[TextureOverrideSpecific]
match_type = Texture2D
match_width = 1024
match_height = 1024
match_priority = 10    ; Higher priority

[TextureOverrideGeneral]
match_type = Texture2D
match_priority = 0     ; Lower priority
```

**Use Case:** Resolve conflicts when multiple TextureOverride sections match the same resource. Higher values take precedence.

Reference: See [TextureOverride](/docs/texture-override.md#match_priority) for details.

---

### allow_duplicate_hash (ShaderOverride only)

**Type:** Boolean or `overrule`  
**Default:** `false`  
**Applies to:** ShaderOverride only

Allow multiple ShaderOverride sections to share the same hash.

```ini
[ShaderOverrideMod1]
hash = abc12345def67890
allow_duplicate_hash = true
run = Mod1Commands

[ShaderOverrideMod2]
hash = abc12345def67890
allow_duplicate_hash = true
run = Mod2Commands
```

**Use Case:** Multiple mods need to add commands to the same shader without conflicts.

Reference: See [ShaderOverride](/docs/shader-override.md#allow_duplicate_hash) for complete documentation.

---

## Fuzzy Matching (TextureOverride Only)

TextureOverride sections support fuzzy matching - matching resources by their properties instead of hash. This is powerful for matching classes of resources.

```ini
; Match all 1024x1024 render targets
[TextureOverrideRenderTargets]
match_type = Texture2D
match_width = 1024
match_height = 1024
match_bind_flags = render_target
ps-t125 = ResourceBackup
```

### Common Fuzzy Match Properties

#### match_type

Match by DirectX 11 resource type.

```ini
match_type = Texture2D
match_type = Buffer
match_type = Texture2DMS
```

#### match_width / match_height

Match by texture dimensions. Supports expressions.

```ini
match_width = 1920
match_height = 1080

; Expression matching
match_width = res_width
match_height = res_height / 2
```

#### match_format

Match by DXGI format.

```ini
match_format = R8G8B8A8_UNORM
match_format = R32G32B32A32_FLOAT
```

#### match_bind_flags

Match by DirectX 11 bind flags. Use `+` to require, `-` to exclude.

```ini
; Require render_target, exclude depth_stencil
match_bind_flags = +render_target -depth_stencil

; All possible flags
match_bind_flags = vertex_buffer index_buffer constant_buffer shader_resource stream_output render_target depth_stencil unordered_access
```

See [TextureOverride](/docs/texture-override.md) and [Fuzzy Matching](/docs/fuzzy-matching.md) for complete fuzzy matching documentation.

---

## Draw Context Matching (TextureOverride Only)

TextureOverride can match based on draw call context - the parameters of the draw call itself.

```ini
[TextureOverrideSpecificDrawCall]
hash = abc12345
match_first_index = 0
match_index_count = 3600
ps-t0 = ResourceCustomTexture
```

### Draw Context Properties

- `match_first_vertex` - Match by first vertex index
- `match_first_index` - Match by first index
- `match_first_instance` - Match by first instance
- `match_vertex_count` - Match by number of vertices
- `match_index_count` - Match by number of indices
- `match_instance_count` - Match by number of instances

**Use Case:** When the same texture/buffer is used by multiple objects, distinguish them by their draw call parameters.

Example - Separate body parts with same hash:

```ini
[TextureOverrideHead]
hash = abc12345
match_first_index = 0
match_index_count = 1200
vb0 = ResourceHeadVB

[TextureOverrideBody]
hash = abc12345
match_first_index = 1200
match_index_count = 3600
vb0 = ResourceBodyVB
```

Reference: See [TextureOverride](/docs/texture-override.md#draw-context-matching)

---

## Common Patterns

### Pattern 1: Replace Texture

```ini
[TextureOverrideCustomTexture]
hash = abc12345
ps-t0 = ResourceNewTexture
```

### Pattern 2: Hide Object

```ini
[ShaderOverrideHideObject]
hash = abc12345def67890
handling = skip
```

### Pattern 3: Replace Model

```ini
[TextureOverrideCustomModel]
hash = abc12345
handling = skip
vb0 = ResourceNewPosition
vb1 = ResourceNewTexcoord
ib = ResourceNewIB
drawindexed = auto
```

### Pattern 4: Conditional Modification

```ini
[ShaderOverrideConditional]
hash = abc12345def67890
run = ConditionalLogic

[ConditionalLogic]
if $enable_mod == 1
    ps-t0 = ResourceModTexture
    vs-cb13 = ResourceModData
endif
```

### Pattern 5: Shader Pair Detection

```ini
[ShaderOverrideVS]
hash = abc12345def67890
filter_index = 0.75
x = 0.75

[ShaderOverridePS]
hash = fedcba9876543210
y = oVS
if y == 0.75
    ; Specific VS+PS combination active
    ps-t0 = ResourcePairTexture
endif
```

### Pattern 6: Fuzzy Depth Buffer Override

```ini
[TextureOverrideDepthBuffer]
match_type = Texture2D
match_bind_flags = depth_stencil
match_width = res_width
match_height = res_height
ps-t125 = ResourceDepthCopy
```

### Pattern 7: Vertex Limit Raise

```ini
[TextureOverrideExpandBuffer]
hash = abc12345
vb0 = ResourceLargerBuffer
match_first_index = 0
; Vertex buffer ResourceLargerBuffer has increased size
```

---

## Best Practices

### Organization

**Group related overrides:**
```ini
; Character model overrides
[ShaderOverrideCharacterShader]
hash = abc12345def67890

[TextureOverrideCharacterBody]
hash = abc12345

[TextureOverrideCharacterHead]
hash = def67890

; UI overrides
[ShaderOverrideUI]
hash = fedcba9876543210

[TextureOverrideUIBackground]
hash = fedcba98
```

### Naming Conventions

**Use descriptive names:**
```ini
; Good
[ShaderOverrideCharacterOutline]
[TextureOverrideWeaponDiffuse]

; Bad
[ShaderOverride1]
[TextureOverride_abc]
```

### Hash Comments

**Document what each hash represents:**
```ini
; Character body shader - controls lighting and shading
[ShaderOverrideCharacterBody]
hash = abc12345def67890

; Main diffuse texture - 2048x2048 RGBA
[TextureOverrideCharacterDiffuse]
hash = abc12345
```

### Testing

**Test in isolation:**
1. Comment out other overrides
2. Test one override at a time
3. Verify hash is correct
4. Check logs for errors

**Use frame analysis:**
1. F8 to start frame analysis
2. Check ShaderFixes/ for dumped resources
3. Verify hashes match your INI
4. Examine resource properties

---

## Troubleshooting

### Override Not Triggering

**Problem:** Override section defined but not executing.

**Solutions:**
1. **Verify hash** - Use frame analysis to confirm correct hash
2. **Check section name** - Must start with `ShaderOverride` or `TextureOverride`
3. **Check hash length** - ShaderOverride: 16 hex chars, TextureOverride: 8 hex chars
4. **Enable logging** - Set `calls = 1` in `[Logging]` to see execution
5. **Check conditions** - If using `if` statements, verify they evaluate true

### Wrong Object Affected

**Problem:** Override affects different object than intended.

**Solutions:**
1. **Hash collision** - Different objects may share hashes (rare but possible)
2. **Use draw context matching** - Add `match_first_index` or `match_index_count`
3. **Use fuzzy matching** - Match by specific properties to narrow down
4. **Check game updates** - Game patches may change hashes

### Performance Issues

**Problem:** Game slows down after adding overrides.

**Solutions:**
1. **Check execution frequency** - Some resources bound very frequently
2. **Optimize command lists** - Reduce operations in frequently-executed overrides
3. **Use conditions** - Skip unnecessary work with `if` statements
4. **Profile with logs** - Enable timing logs to identify bottlenecks

### Resources Not Loading

**Problem:** Resources specified but not appearing in game.

**Solutions:**
1. **Verify resource exists** - Check [Resource] section is defined
2. **Check resource path** - Verify file paths are correct
3. **Check slot numbers** - Ensure binding to correct shader slots
4. **Check resource type** - Must match what the slot expects (texture vs buffer)

---

## Advanced Topics

### Namespace

Override sections support namespace for variable isolation:

```ini
[ShaderOverride.MyMod.CharacterShader]
hash = abc12345def67890
$mymod_enabled = 1    ; Variable scoped to .MyMod namespace
```

See [Namespace](/docs/namespace.md) for complete documentation.

### Command Lists

Override sections act as command lists and support all command list syntax:

```ini
[ShaderOverrideComplex]
hash = abc12345def67890
; Variable operations
$temp = x + y
x = $temp * 2.0

; Conditionals
if $condition
    ps-t0 = ResourceA
else
    ps-t0 = ResourceB
endif

; Loops (in command lists called via run)
run = ComplexLogic
```

See [Command List](/docs/command-list.md) for complete command syntax.

### Pre and Post Commands

Commands can run before (default) or after (post) the draw call:

```ini
[ShaderOverridePrePost]
hash = abc12345def67890
; Before draw call
ps-t0 = ResourceSetup
x = 1.0

; After draw call
post ps-t0 = null
post x = 0.0
```

See [Command List](/docs/command-list.md#post-modifier) for details.

---

## Related Documentation

- [ShaderOverride](/docs/shader-override.md) - Complete ShaderOverride documentation
- [TextureOverride](/docs/texture-override.md) - Complete TextureOverride documentation
- [Command List](/docs/command-list.md) - Command syntax reference
- [Resource](/docs/resource.md) - Defining custom resources
- [Draw Calls](/docs/draw-calls.md) - Draw command reference
- [Debugging](/docs/debugging.md) - Hunting and frame analysis
- [Fuzzy Matching](/docs/fuzzy-matching.md) - TextureOverride fuzzy matching
- [Namespace](/docs/namespace.md) - Variable scoping
