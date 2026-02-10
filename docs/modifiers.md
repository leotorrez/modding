# Modifiers

Modifiers are keywords that modify the behavior of commands, resource assignments, and draw calls. They are placed before the command or used inline with resource operations. This page documents all modifiers available in 3dmigoto.

## Command List Execution Modifiers

These modifiers control when commands execute during the frame rendering pipeline.

### post

Explicitly executes a command in the post-command list (beginning of frame). When used in sections like `[Present]`, `post` runs before the game's rendering begins, making it ideal for initialization and resource setup.

**Syntax:**
```ini
post <command>
```

**Examples:**
```ini
[Present]
post $triggerDate = time
post ResourceBackup = copy ps-t0
```

**Source:** `IniHandler.cpp:1987-1994`

### pre

Explicitly executes a command in the pre-command list (end of frame). When used in sections like `[Present]`, `pre` runs after the game's rendering completes, making it ideal for overlays and post-processing.

**Syntax:**
```ini
pre <command>
```

**Examples:**
```ini
[Present]
pre $frameCount = $frameCount + 1
pre ps-t0 = ResourceOverlay
pre run = CommandListPostProcess
```

**Source:** `IniHandler.cpp:1987-1994`

### run

Executes a CommandList or CustomShader section. This modifier triggers the execution of another section's commands, enabling modular command organization and reusability.

**Syntax:**
```ini
run = <CommandListName>
run = <CustomShaderName>
```

**Examples:**
```ini
[KeyToggleEffect]
key = VK_F1
run = CommandListToggleEffect

[TextureOverrideSomeHash]
if $effect_enabled
    run = CustomShaderEffect
endif
```

**Special Behavior:** When `run` is used with explicit `pre`/`post` in checktextureoverride commands, both phases execute together.

**Source:** `CommandList.cpp:617`

---

## Resource Copy Modifiers

These modifiers control how resources are assigned, copied, or referenced. They can be combined in most cases.

### copy

Performs a full resource copy using DirectX's `CopyResource()`. This creates an independent duplicate of the source resource. Use this when you need to preserve a resource's state before it gets modified.

**Syntax:**
```ini
<target> = copy <source>
```

**Examples:**
```ini
; Backup a texture before game modifies it
pre ResourceBackup = copy ps-t0

; Copy depth buffer for later processing
post ResourceDepthCopy = copy ps-t100
```

**Default Behavior:** Automatically used when copying to custom resources.

**Source:** `CommandList.h:610-646`, `CommandList.cpp:5128+`

### ref / reference

Creates a reference (pointer) to a resource instead of copying it. Both the target and source will point to the same DirectX resource in memory. Changes to one affect the other. This is significantly faster than `copy` but provides no isolation.

**Syntax:**
```ini
<target> = ref <source>
<target> = reference <source>
```

**Examples:**
```ini
; Point to the same resource
pre ResourceAlias = ref ps-t0

; Both names access identical syntax
pre ResourceAlias = reference ps-t0
```

**Default Behavior:** Automatically used when assigning resources of the same type or render targets.

**When to Use:**
- Aliasing resources (multiple names for same resource)
- Performance-critical scenarios (no copy overhead)
- When you want changes to propagate between names

**Source:** `CommandList.h:610-646`, `CommandList.cpp:5128+`

### unless_null

Conditionally performs a copy or reference operation only if the source resource is NOT NULL. If the source is NULL, the operation is skipped entirely. This prevents errors when optional resources might not be bound.

**Syntax:**
```ini
<target> = unless_null <source>
<target> = unless_null copy <source>
<target> = unless_null ref <source>
```

**Examples:**
```ini
; Only copy if ps-t0 is bound
ps-t10 = unless_null copy ps-t0

; Only reference if resource exists
ResourceOptional = unless_null ref ResourceMaybeExists

; Safely backup optional texture
pre ResourceBackup = unless_null copy ps-t5
```

**Use Cases:**
- Working with optional texture slots
- Conditional resource processing
- Avoiding NULL resource errors in complex command lists

**Source:** `CommandList.cpp:7414`

### copy_desc / copy_description

Copies the resource description (format, dimensions, properties) when creating the destination resource. Both names are accepted and functionally identical.

**Syntax:**
```ini
<target> = copy_desc <source>
<target> = copy_description <source>
```

**Examples:**
```ini
; Create resource with same properties
ResourceClone = copy_desc ps-t0

; Both syntaxes are equivalent
ResourceClone = copy_description ps-t0
```

**Use Cases:**
- Creating resources that match game resource specifications
- Dynamic resource sizing based on game resolution
- Ensuring format compatibility

**Source:** `CommandList.h:610-646`

### mono

Forces monoscopic (non-stereo) operation on the resource. This treats the resource as a single view instead of separate left/right eye views in stereo 3D rendering.

**Syntax:**
```ini
<target> = mono <source>
```

**Examples:**
```ini
; Treat stereo resource as mono
ResourceMono = mono ps-t0
```

**Use Cases:**
- Converting stereo resources to single view
- UI elements that should not have stereo depth
- Post-processing effects that work on combined view

**Source:** `CommandList.h:610-646`

### set_viewport

Automatically sets the viewport to match the resource dimensions when the resource is used. This ensures rendering operations use the correct viewport size for the target resource.

**Syntax:**
```ini
<target> = set_viewport <source>
```

**Examples:**
```ini
; Auto-adjust viewport to texture size
o0 = set_viewport ResourceCustom
```

**Use Cases:**
- Rendering to custom-sized render targets
- Ensuring viewport matches resource dimensions
- Avoiding manual viewport management

**Source:** `CommandList.h:610-646`

### no_view_cache

Prevents caching of the shader resource view (SRV) or unordered access view (UAV) created for this resource. Each use creates a fresh view. This is primarily for advanced scenarios where view caching causes issues.

**Syntax:**
```ini
<target> = no_view_cache <source>
```

**Examples:**
```ini
; Always create fresh view
ps-t0 = no_view_cache ResourceDynamic
```

**Use Cases:**
- Resources with frequently changing properties
- Debugging view-related issues
- Specific edge cases where cached views cause problems

**Source:** `CommandList.cpp:7522`

### raw

Creates a raw buffer view with R32_TYPELESS format. This allows treating structured or typed buffers as raw 32-bit data, useful for low-level buffer manipulation.

**Syntax:**
```ini
<target> = raw <source>
```

**Examples:**
```ini
; Access buffer as raw data
cs-u0 = raw ResourceBuffer
```

**Use Cases:**
- Low-level buffer manipulation in compute shaders
- Reinterpreting buffer data
- Custom buffer processing algorithms

**Source:** `CommandList.cpp:6596`

### Combining Resource Modifiers

Multiple modifiers can be combined in a single command:

```ini
; Conditionally copy with mono view
ResourceBackup = unless_null copy mono ps-t0

; Reference with custom viewport
o0 = ref set_viewport ResourceCustomRT

; Conditional reference
ps-t10 = unless_null ref ResourceOptional
```

**Common Combinations:**
- `unless_null copy` - Safe backup operations
- `unless_null ref` - Optional resource aliasing
- `copy mono` - Mono copy of stereo resources
- `ref set_viewport` - Reference with viewport adjustment

---

## Draw Command Modifiers

These modifiers control how draw calls are executed.

### from_caller

Replays the exact draw call that triggered the current command list. This captures the original draw call's parameters (vertex count, index count, instance count, topology, etc.) and re-executes it.

**Syntax:**
```ini
draw = from_caller
```

**Examples:**
```ini
[TextureOverrideSomeHash]
; Re-execute the original draw call
draw = from_caller

; Use with custom shader
run = CustomShaderReplacement
draw = from_caller
```

**Use Cases:**
- Executing original draw call after modifying resources
- Rendering with replaced shaders while keeping original geometry
- Multi-pass rendering of same geometry

**Supported Draw Types:** Works with all draw call variants (Draw, DrawIndexed, DrawInstanced, DrawIndexedInstanced, DrawInstancedIndirect, DrawIndexedInstancedIndirect).

**Source:** `CommandList.cpp:770, 1278-1335`

### auto

Automatically determines vertex or index count from currently bound vertex/index buffers. This eliminates the need to specify counts manually and works with dynamically sized buffers.

**Syntax:**
```ini
draw = auto
drawindexed = auto
drawindexedinstanced = auto <instance_count>
```

**Examples:**
```ini
; Auto-detect vertex count from VB0
vb0 = ResourceCustomVertices
draw = auto

; Auto-detect index count from current IB
ib = ResourceCustomIndices
drawindexed = auto

; Auto-detect index count, specify instance count
ib = ResourceCustomIndices
drawindexedinstanced = auto 10
```

**How It Works:**
- For `draw = auto`: Reads vertex buffer description and calculates vertex count from buffer size and stride
- For `drawindexed = auto`: Reads index buffer description and calculates index count from buffer size and format (16-bit or 32-bit)
- For `drawindexedinstanced = auto <N>`: Calculates index count automatically, uses specified instance count

**Use Cases:**
- Custom vertex/index buffers with variable sizes
- Avoiding hardcoded counts
- Working with procedurally generated geometry

**Source:** `CommandList.cpp:772, 781, 788, 1337-1364`

---

## Modifier Precedence and Defaults

### Resource Copy Defaults

3dmigoto automatically selects `copy` or `ref` based on context:

**Automatic `copy`:**
- Copying to custom resources (defined in `[Resource...]` sections)
- When explicit copy is needed for isolation

**Automatic `ref`:**
- Same resource type assignments
- Render target assignments
- Resource aliasing operations

**Override Default:** Explicitly specify `copy` or `ref` to override automatic behavior.

### Modifier Combinations

**Valid Combinations:**
```ini
unless_null copy          ; Conditional copy
unless_null ref           ; Conditional reference
copy mono                 ; Mono copy
ref set_viewport          ; Reference with viewport
copy_desc copy            ; Description + data copy
```

**Invalid Combinations:**
```ini
copy ref                  ; Cannot both copy AND reference
```

### Execution Order

When multiple modifiers are present, they are processed in this order:
1. `unless_null` - Check if operation should proceed
2. `copy_desc` - Copy resource description
3. `copy` / `ref` - Perform copy or reference operation
4. `mono` / `raw` / `set_viewport` / `no_view_cache` - Apply view/viewport modifiers

---

## Advanced Usage Examples

### Conditional Resource Backup
```ini
[Present]
; Only backup if texture is bound
post ResourceBackup = unless_null copy ps-t0

[TextureOverrideSomeHash]
if $backup_exists
    ; Restore from backup
    ps-t0 = ref ResourceBackup
endif
```

### Multi-Pass Rendering
```ini
[TextureOverrideCharacter]
; Pass 1: Render to custom target
o0 = ResourcePass1
run = CustomShaderPass1
draw = from_caller

; Pass 2: Use Pass 1 result
ps-t0 = ResourcePass1
o0 = ResourcePass2
run = CustomShaderPass2
draw = from_caller

; Final: Restore original target and render
ps-t0 = ResourcePass2
o0 = ref bb
run = CustomShaderFinal
draw = from_caller
```

### Dynamic Vertex Buffer Rendering
```ini
[CommandListRenderCustom]
; Setup custom vertex buffer
vb0 = ResourceCustomVB
handling = skip
checktextureoverride = vb0

; Let 3dmigoto calculate count from buffer size
draw = auto
```

### Stereo to Mono Conversion
```ini
[Present]
; Create mono version of stereo UI texture
pre ResourceUIMonoLeft = copy mono ps-t50

[TextureOverrideUI]
; Use mono version instead
ps-t0 = ref ResourceUIMonoLeft
```

---

## Performance Considerations

### Copy vs Reference
- **`copy`**: Expensive GPU operation, creates duplicate data
  - Use when: You need isolation, original will be modified
- **`ref`**: Free operation, just pointer assignment
  - Use when: You need aliasing, no isolation required

### unless_null Overhead
- Minimal overhead: Single NULL check on CPU
- Always use when source might be unbound
- Prevents GPU errors and crashes

### View Caching
- Default caching improves performance
- Only use `no_view_cache` when absolutely necessary
- Cached views are automatically invalidated when resource changes

### auto Draw Calls
- CPU overhead: Reads buffer descriptions
- GPU overhead: None (same as manual counts)
- Use freely for dynamic buffers

---

## Source Code References

All modifiers documented here are verified against the 3dmigoto source code:

- **Modifier Definitions:** `CommandList.h:610-646` (ResourceCopyOptions), `CommandList.h:1050-1067` (DrawCommandType)
- **Command List Execution:** `IniHandler.cpp:1987-1994`, `CommandList.cpp:617`
- **Resource Copy Parsing:** `CommandList.cpp:5128+`
- **Resource Copy Implementation:** `CommandList.cpp:6452-7522`
- **Draw Command Parsing:** `CommandList.cpp:769-810`
- **Draw Command Execution:** `CommandList.cpp:1278-1364`
