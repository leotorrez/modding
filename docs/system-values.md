# System Values (Shader Semantics)

System values are special shader input/output variables with predefined meanings in the DirectX 11 pipeline. They are identified by `SV_` prefixes in HLSL shader code and provide access to built-in hardware functionality.

## Overview

System values (also called system-value semantics) are used in shader signatures to connect shader stages and access GPU-provided data. Understanding system values is important for:

- **Shader analysis** - Identifying what data shaders consume/produce
- **Shader modification** - Adding or removing shader inputs/outputs
- **3dmigoto integration** - Understanding how 3dmigoto intercepts shader data
- **Hunting** - Identifying shaders by their signatures

**Key Concept:** System values are automatically provided by the GPU or previous pipeline stages. You cannot arbitrarily assign values to most system value outputs (some exceptions like SV_Target, SV_Depth).

## System Value Categories

System values are organized by shader stage and input/output direction:

| Category | Examples | Description |
|----------|----------|-------------|
| **Vertex Inputs** | SV_VertexID, SV_InstanceID | Per-vertex/instance data |
| **Pixel Inputs** | SV_Position, SV_IsFrontFace | Rasterizer-generated data |
| **Pixel Outputs** | SV_Target, SV_Depth | Render target outputs |
| **Geometry** | SV_PrimitiveID, SV_RenderTargetArrayIndex | Geometry processing |
| **Compute** | SV_DispatchThreadID, SV_GroupID | Compute thread identification |
| **Tessellation** | SV_TessFactor, SV_InsideTessFactor | Tessellation control |

## Vertex Shader System Values

### SV_VertexID

**Type:** `uint`  
**Direction:** Input only  
**Description:** Automatically-generated vertex index for the current vertex.

**Behavior:**
- For non-indexed draws: Sequential counter starting from `FirstVertex` parameter
- For indexed draws: Value from index buffer + `FirstVertex` offset
- Always per-vertex unique within a draw call

**Usage:**
```hlsl
float4 main(uint vertexID : SV_VertexID) : SV_Position
{
    // Procedural geometry without vertex buffers
    float2 positions[3] = { float2(-1,-1), float2(3,-1), float2(-1,3) };
    return float4(positions[vertexID % 3], 0, 1);
}
```

**3dmigoto Integration:**
- Can be used to identify vertex positions without vertex buffers
- Useful for fullscreen triangle detection
- Visible in shader disassembly as `v0.vertex` or similar

Reference: [Microsoft SV_VertexID Documentation](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-semantics#system-value-semantics)

### SV_InstanceID

**Type:** `uint`  
**Direction:** Input only  
**Description:** Automatically-generated instance index for instanced rendering.

**Behavior:**
- Sequential counter starting from `FirstInstance` parameter
- Unique per-instance within a draw call
- 0 for non-instanced draws

**Usage:**
```hlsl
struct VSInput
{
    float3 position : POSITION;
    uint instanceID : SV_InstanceID;
};

float4 main(VSInput input) : SV_Position
{
    // Different transform per instance
    float4x4 instanceTransform = instanceTransforms[input.instanceID];
    return mul(float4(input.position, 1), instanceTransform);
}
```

**3dmigoto Integration:**
- Can be filtered with `match_instance_count` in TextureOverride
- Useful for identifying instanced geometry (grass, particles, etc.)
- Can be extracted for conditional stereo corrections

Reference: [Microsoft SV_InstanceID Documentation](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-semantics#system-value-semantics)

### SV_Position (Vertex Output)

**Type:** `float4`  
**Direction:** Output only (from vertex/geometry/domain shader)  
**Description:** Clip-space position of the vertex.

**Behavior:**
- Must be output by vertex shader (or last geometry stage)
- Interpreted as homogeneous clip-space coordinates (x, y, z, w)
- After w-divide, x and y are screen coordinates, z is depth

**Usage:**
```hlsl
struct VSOutput
{
    float4 position : SV_Position;  // Clip-space position
    float2 texcoord : TEXCOORD0;
};

VSOutput main(float3 pos : POSITION)
{
    VSOutput output;
    output.position = mul(float4(pos, 1), worldViewProj);
    output.texcoord = ...;
    return output;
}
```

**3dmigoto Stereo Correction:**
This is the primary target for stereo 3D corrections:
```hlsl
// Common stereo correction pattern
output.position.x += stereoParams.x * output.position.w;
```

Reference: [Microsoft SV_Position Documentation](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-semantics#system-value-semantics)

## Pixel Shader System Values

### SV_Position (Pixel Input)

**Type:** `float4`  
**Direction:** Input only (to pixel shader)  
**Description:** Screen-space pixel position.

**Behavior:**
- x, y: Pixel coordinates in screen space (e.g., 0.5-1919.5 for 1920x1080)
- z: Interpolated depth value (0.0 at near plane, 1.0 at far plane)
- w: 1/w from clip-space (reciprocal of homogeneous w)

**Usage:**
```hlsl
float4 main(float4 screenPos : SV_Position) : SV_Target
{
    // Checkerboard pattern based on pixel position
    bool isEven = ((uint)screenPos.x + (uint)screenPos.y) % 2 == 0;
    return isEven ? float4(1,1,1,1) : float4(0,0,0,1);
}
```

**Important:** Pixel shader SV_Position is different from vertex shader SV_Position:
- **Vertex output:** Clip-space coordinates (before perspective divide)
- **Pixel input:** Screen-space coordinates (after perspective divide)

**3dmigoto Integration:**
- Can be used to detect screen-space effects
- Useful for identifying fullscreen passes
- Contains depth information for depth-based filtering

### SV_Target[N]

**Type:** `float4` (or other format-compatible type)  
**Direction:** Output only (from pixel shader)  
**Description:** Render target output.

**Behavior:**
- SV_Target0 = first render target (or just SV_Target)
- SV_Target1, SV_Target2, ... = additional render targets (MRT)
- Type must match render target format
- Can output to up to 8 render targets simultaneously

**Usage:**
```hlsl
struct PSOutput
{
    float4 color : SV_Target0;      // Render target 0
    float4 normal : SV_Target1;     // Render target 1 (G-buffer)
    float4 specular : SV_Target2;   // Render target 2 (G-buffer)
};

PSOutput main(float2 texcoord : TEXCOORD0)
{
    PSOutput output;
    output.color = tex2D(colorSampler, texcoord);
    output.normal = float4(normalize(normal), 1);
    output.specular = float4(specular, roughness, 0, 0);
    return output;
}
```

**Simplified Syntax:**
```hlsl
// Single render target
float4 main(...) : SV_Target
{
    return color;
}

// Equivalent to SV_Target0
float4 main(...) : SV_Target0
{
    return color;
}
```

**3dmigoto Integration:**
- All pixel shader outputs must be accounted for
- Removing SV_Target outputs requires updating shader signature
- Used to identify deferred rendering passes (multiple outputs)

Reference: [Microsoft SV_Target Documentation](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-semantics#system-value-semantics)

### SV_Depth

**Type:** `float`  
**Direction:** Output only (from pixel shader)  
**Description:** Explicit depth value for the pixel.

**Behavior:**
- Overrides rasterizer-calculated depth
- Value should be in range [0.0, 1.0]
- Disables early-z optimization (performance cost)
- Useful for custom depth calculations

**Usage:**
```hlsl
struct PSOutput
{
    float4 color : SV_Target;
    float depth : SV_Depth;
};

PSOutput main(float4 screenPos : SV_Position)
{
    PSOutput output;
    output.color = ...;
    // Custom logarithmic depth
    output.depth = log(screenPos.z) / log(farPlane);
    return output;
}
```

**Performance Warning:** Using SV_Depth disables hardware early-z optimization, which can significantly impact performance. Only use when necessary.

**3dmigoto Integration:**
- Identifies shaders that modify depth
- Can be used to detect custom shadow mapping
- Relevant for depth-based stereo effects

Reference: [Microsoft SV_Depth Documentation](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-semantics#system-value-semantics)

### SV_IsFrontFace

**Type:** `bool`  
**Direction:** Input only (to pixel shader)  
**Description:** Indicates whether the pixel is on a front-facing triangle.

**Behavior:**
- `true` for front-facing triangles
- `false` for back-facing triangles
- Determined by winding order and cull mode
- Available even when culling is disabled

**Usage:**
```hlsl
float4 main(float3 normal : NORMAL, bool isFrontFace : SV_IsFrontFace) : SV_Target
{
    // Flip normal for back faces
    float3 finalNormal = isFrontFace ? normal : -normal;
    // Two-sided lighting
    float lighting = saturate(dot(finalNormal, lightDir));
    return float4(lighting.xxx, 1);
}
```

**3dmigoto Integration:**
- Used in two-sided material shaders
- Can identify shaders that handle backface rendering
- Useful for detecting double-sided geometry fixes

Reference: [Microsoft SV_IsFrontFace Documentation](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-semantics#system-value-semantics)

### SV_Coverage

**Type:** `uint`  
**Direction:** Input/Output  
**Description:** Bitmask of which MSAA samples are covered.

**Behavior:**
- **Input:** Which samples the pixel covers (sample mask from rasterizer)
- **Output:** Which samples to update (can discard specific samples)
- One bit per sample (e.g., 0xF for 4x MSAA with all samples covered)
- Only meaningful with MSAA enabled

**Usage:**
```hlsl
struct PSOutput
{
    float4 color : SV_Target;
    uint coverage : SV_Coverage;
};

PSOutput main(uint coverageIn : SV_Coverage)
{
    PSOutput output;
    output.color = ...;
    // Discard sample 0 and 2 (custom alpha-to-coverage)
    output.coverage = coverageIn & 0xA;  // Binary 1010
    return output;
}
```

**3dmigoto Integration:**
- Identifies MSAA-aware shaders
- Used in custom alpha-to-coverage implementations
- Can affect edge quality in antialiasing

Reference: [Microsoft SV_Coverage Documentation](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-semantics#system-value-semantics)

### SV_SampleIndex

**Type:** `uint`  
**Direction:** Input only  
**Description:** Index of the current MSAA sample being evaluated.

**Behavior:**
- Only available when pixel shader runs per-sample (not per-pixel)
- Value is 0 to (SampleCount - 1)
- Requires `sample` interpolation modifier on inputs
- Significantly increases pixel shader invocations (performance cost)

**Usage:**
```hlsl
// Per-sample pixel shader
float4 main(float4 color : COLOR, uint sampleIndex : SV_SampleIndex) : SV_Target
{
    // Different processing per sample
    float offset = sampleIndex * 0.1;
    return color + offset;
}
```

**Performance Warning:** Per-sample shading is very expensive (4x cost for 4x MSAA). Only use for critical quality improvements.

**3dmigoto Integration:**
- Identifies performance-critical per-sample shaders
- Can be used to detect supersampling effects
- Relevant for MSAA troubleshooting

Reference: [Microsoft SV_SampleIndex Documentation](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-semantics#system-value-semantics)

## Geometry Shader System Values

### SV_PrimitiveID

**Type:** `uint`  
**Direction:** Input/Output  
**Description:** Unique identifier for the current primitive.

**Behavior:**
- **Vertex/Geometry/Pixel Input:** Sequential primitive counter
- **Geometry/Pixel Output:** Can pass through or generate new IDs
- Resets per draw call
- Can be used to index into buffers

**Usage (Geometry Shader):**
```hlsl
[maxvertexcount(3)]
void main(triangle float4 input[3] : SV_Position, uint primID : SV_PrimitiveID,
          inout TriangleStream<GSOutput> stream)
{
    // Use primitive ID to look up per-primitive data
    float4 color = primitiveColors[primID];
    
    for (int i = 0; i < 3; i++)
    {
        GSOutput output;
        output.position = input[i];
        output.color = color;
        output.primID = primID;  // Pass through
        stream.Append(output);
    }
}
```

**3dmigoto Integration:**
- Can be used to identify specific primitives
- Useful for per-primitive fixes
- Can be extracted for conditional processing

Reference: [Microsoft SV_PrimitiveID Documentation](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-semantics#system-value-semantics)

### SV_RenderTargetArrayIndex

**Type:** `uint`  
**Direction:** Output only (from geometry shader)  
**Description:** Selects which slice of a render target array to render to.

**Behavior:**
- Must be output by geometry shader
- Determines destination layer in texture array
- Enables single-pass rendering to multiple array slices
- Common use: cubemap rendering, stereo rendering, instanced rendering

**Usage:**
```hlsl
struct GSOutput
{
    float4 position : SV_Position;
    uint rtIndex : SV_RenderTargetArrayIndex;
};

[maxvertexcount(3)]
void main(triangle VSOutput input[3], inout TriangleStream<GSOutput> stream)
{
    // Duplicate triangle to two array slices (stereo rendering)
    for (int eye = 0; eye < 2; eye++)
    {
        for (int i = 0; i < 3; i++)
        {
            GSOutput output;
            output.position = ApplyStereoTransform(input[i].position, eye);
            output.rtIndex = eye;  // Left eye = 0, right eye = 1
            stream.Append(output);
        }
        stream.RestartStrip();
    }
}
```

**3dmigoto Stereo:**
- Used for geometry shader-based stereo rendering
- Alternative to vertex shader stereo corrections
- Can render left/right eyes in single pass

Reference: [Microsoft SV_RenderTargetArrayIndex Documentation](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-semantics#system-value-semantics)

### SV_ViewportArrayIndex

**Type:** `uint`  
**Direction:** Output only (from geometry shader)  
**Description:** Selects which viewport to use for rasterization.

**Behavior:**
- Must be output by geometry shader
- Determines which viewport in the viewport array to use
- Enables rendering different views in single pass
- Requires D3D11.1 or newer

**Usage:**
```hlsl
struct GSOutput
{
    float4 position : SV_Position;
    uint viewportIndex : SV_ViewportArrayIndex;
};

[maxvertexcount(3)]
void main(triangle VSOutput input[3], inout TriangleStream<GSOutput> stream)
{
    GSOutput output;
    for (int i = 0; i < 3; i++)
    {
        output.position = input[i].position;
        output.viewportIndex = 0;  // Use first viewport
        stream.Append(output);
    }
}
```

**3dmigoto Integration:**
- Can be used for multi-viewport rendering
- Relevant for advanced stereo techniques
- Less common than SV_RenderTargetArrayIndex

Reference: [Microsoft SV_ViewportArrayIndex Documentation](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-semantics#system-value-semantics)

## Compute Shader System Values

### SV_DispatchThreadID

**Type:** `uint3`  
**Direction:** Input only  
**Description:** Global thread coordinates across entire dispatch.

**Behavior:**
- Unique 3D coordinates for each thread in the entire dispatch
- Calculated as: `SV_GroupID * numthreads + SV_GroupThreadID`
- Most commonly used for indexing output resources
- Range: (0,0,0) to (dispatch size - 1)

**Usage:**
```hlsl
[numthreads(8, 8, 1)]
void main(uint3 dispatchThreadID : SV_DispatchThreadID)
{
    // Global pixel coordinates
    uint2 pixelPos = dispatchThreadID.xy;
    
    // Write to output texture
    outputTexture[pixelPos] = ComputeValue(pixelPos);
}
```

**3dmigoto Integration:**
- Used to identify compute shader work distribution
- Relevant for compute-based post-processing
- Can be used to understand dispatch dimensions

Reference: [Microsoft SV_DispatchThreadID Documentation](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-semantics#system-value-semantics)

### SV_GroupID

**Type:** `uint3`  
**Direction:** Input only  
**Description:** Work group coordinates within the dispatch.

**Behavior:**
- Identifies which thread group this thread belongs to
- Same value for all threads in a group
- Range: (0,0,0) to (number of groups - 1)
- Used for group-level decisions

**Usage:**
```hlsl
[numthreads(64, 1, 1)]
void main(uint3 groupID : SV_GroupID, uint3 groupThreadID : SV_GroupThreadID)
{
    // Each group processes one tile
    uint tileIndex = groupID.x;
    uint threadIndex = groupThreadID.x;
    
    ProcessTile(tileIndex, threadIndex);
}
```

**3dmigoto Integration:**
- Used to understand compute work organization
- Relevant for tiled rendering techniques
- Can affect performance characteristics

Reference: [Microsoft SV_GroupID Documentation](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-semantics#system-value-semantics)

### SV_GroupThreadID

**Type:** `uint3`  
**Direction:** Input only  
**Description:** Thread coordinates within the current work group.

**Behavior:**
- Unique coordinates within the thread group
- Range: (0,0,0) to (numthreads - 1)
- Used for indexing group shared memory
- Same pattern repeated in each group

**Usage:**
```hlsl
groupshared float sharedData[64];

[numthreads(8, 8, 1)]
void main(uint3 groupThreadID : SV_GroupThreadID)
{
    uint flatIndex = groupThreadID.y * 8 + groupThreadID.x;
    
    // Load into shared memory
    sharedData[flatIndex] = LoadData();
    GroupMemoryBarrierWithGroupSync();
    
    // Process using shared memory
    float result = ProcessSharedData(flatIndex);
}
```

**3dmigoto Integration:**
- Critical for understanding group shared memory usage
- Relevant for optimizing compute shaders
- Affects memory access patterns

Reference: [Microsoft SV_GroupThreadID Documentation](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-semantics#system-value-semantics)

### SV_GroupIndex

**Type:** `uint`  
**Direction:** Input only  
**Description:** Flattened thread index within the group.

**Behavior:**
- 1D flattened version of SV_GroupThreadID
- Calculated as: `z * (numthreads.x * numthreads.y) + y * numthreads.x + x`
- Convenient for 1D indexing of group shared memory
- Range: 0 to (total threads per group - 1)

**Usage:**
```hlsl
groupshared float sharedData[256];

[numthreads(16, 16, 1)]
void main(uint groupIndex : SV_GroupIndex)
{
    // Simple 1D indexing
    sharedData[groupIndex] = LoadData(groupIndex);
    GroupMemoryBarrierWithGroupSync();
    
    // Process
    float result = ProcessSharedData(groupIndex);
}
```

**3dmigoto Integration:**
- Simplifies group shared memory indexing
- Common in 1D compute workloads
- Equivalent to manually flattening SV_GroupThreadID

Reference: [Microsoft SV_GroupIndex Documentation](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-semantics#system-value-semantics)

## Tessellation System Values

### SV_TessFactor

**Type:** `float[2]` (isoline) or `float[3]` (triangle) or `float[4]` (quad)  
**Direction:** Output only (from hull shader)  
**Description:** Edge tessellation factors.

**Behavior:**
- Controls subdivision level along each edge
- Array size depends on patch type
- Values >= 1.0 (higher = more subdivision)
- Fractional values supported

**Usage (Triangle Patch):**
```hlsl
struct HSConstantOutput
{
    float edges[3] : SV_TessFactor;
    float inside : SV_InsideTessFactor;
};

HSConstantOutput PatchConstantFunc(InputPatch<VSOutput, 3> patch)
{
    HSConstantOutput output;
    
    // Distance-based tessellation
    float distance = length(patch[0].worldPos - cameraPos);
    float factor = saturate(10.0 / distance);
    
    output.edges[0] = 1.0 + factor * 7.0;  // Edge 0: 1-8x subdivision
    output.edges[1] = output.edges[0];
    output.edges[2] = output.edges[0];
    output.inside = output.edges[0];
    
    return output;
}
```

**3dmigoto Integration:**
- Used in tessellated geometry shaders
- Relevant for terrain, water, displacement mapping
- Can identify adaptive tessellation schemes

Reference: [Microsoft SV_TessFactor Documentation](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-semantics#system-value-semantics)

### SV_InsideTessFactor

**Type:** `float` (triangle/quad) or `float[2]` (quad)  
**Direction:** Output only (from hull shader)  
**Description:** Interior tessellation factor.

**Behavior:**
- Controls subdivision inside the patch
- Triangle patches: single value
- Quad patches: two values (U and V direction)
- Works together with SV_TessFactor

**Usage:** See SV_TessFactor example above.

**3dmigoto Integration:**
- Complements SV_TessFactor in tessellation shaders
- Affects interior detail level
- Can differ from edge factors for smooth LOD transitions

Reference: [Microsoft SV_InsideTessFactor Documentation](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-semantics#system-value-semantics)

### SV_DomainLocation

**Type:** `float2` (quad/isoline) or `float3` (triangle)  
**Direction:** Input only (to domain shader)  
**Description:** Parametric coordinates within the tessellated patch.

**Behavior:**
- Barycentric coordinates for triangles
- UV coordinates for quads
- Range: [0.0, 1.0] for each component
- Used to interpolate control point data

**Usage:**
```hlsl
struct DSOutput
{
    float4 position : SV_Position;
};

[domain("tri")]
DSOutput main(HSConstantOutput input, float3 bary : SV_DomainLocation,
              const OutputPatch<HSOutput, 3> patch)
{
    DSOutput output;
    
    // Barycentric interpolation
    float3 worldPos = bary.x * patch[0].worldPos +
                     bary.y * patch[1].worldPos +
                     bary.z * patch[2].worldPos;
    
    // Apply displacement
    worldPos += GetDisplacement(worldPos) * GetNormal(worldPos);
    
    output.position = mul(float4(worldPos, 1), viewProj);
    return output;
}
```

**3dmigoto Integration:**
- Critical for domain shader transformations
- Used in displacement mapping
- Relevant for terrain and water rendering

Reference: [Microsoft SV_DomainLocation Documentation](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-semantics#system-value-semantics)

### SV_OutputControlPointID

**Type:** `uint`  
**Direction:** Input only (to hull shader)  
**Description:** Index of the current control point being output.

**Behavior:**
- Range: 0 to (number of output control points - 1)
- Used to determine which control point to compute
- Can differ from input control point count

**Usage:**
```hlsl
struct HSOutput
{
    float3 position : POSITION;
};

[domain("tri")]
[partitioning("fractional_odd")]
[outputtopology("triangle_cw")]
[outputcontrolpoints(3)]
[patchconstantfunc("PatchConstantFunc")]
HSOutput main(InputPatch<VSOutput, 3> input, uint cpID : SV_OutputControlPointID)
{
    HSOutput output;
    output.position = input[cpID].position;
    return output;
}
```

**3dmigoto Integration:**
- Used in hull shader control point processing
- Relevant for understanding tessellation data flow
- Can be used to identify pass-through hull shaders

Reference: [Microsoft SV_OutputControlPointID Documentation](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-semantics#system-value-semantics)

## 3dmigoto-Specific Considerations

### Stereo Corrections

3dmigoto most commonly modifies SV_Position output from vertex shaders for stereo 3D:

```hlsl
// Typical stereo correction pattern
output.position.x += stereoParams.x * output.position.w;
```

This shifts geometry horizontally based on depth for left/right eye separation.

### Shader Hunting

System values help identify shader types during hunting:
- Shaders with SV_VertexID are likely procedural or instanced
- Multiple SV_Target outputs indicate deferred rendering
- SV_Depth output suggests custom depth effects (shadows, fog)
- Compute semantics (SV_DispatchThreadID) identify post-processing

### Shader Signatures

When modifying shaders, system values must match between stages:
- Vertex shader SV_Position output → Pixel shader SV_Position input
- Geometry shader outputs → Pixel shader inputs
- Mismatched signatures cause pipeline errors

### Shader Disassembly

System values appear in disassembly with specific naming:
- `v0.vertex` → SV_VertexID
- `v1.instance` → SV_InstanceID
- `o0.xyzw` → SV_Position output
- `o0, o1, o2` → SV_Target0, SV_Target1, SV_Target2

## Non-System-Value Semantics

Not all semantics are system values. Custom semantics (without `SV_` prefix) are user-defined:

```hlsl
struct VSOutput
{
    float4 position : SV_Position;  // System value
    float2 texcoord : TEXCOORD0;    // Custom semantic
    float3 normal : NORMAL;         // Custom semantic
    float4 color : COLOR;           // Custom semantic
};
```

**Custom Semantics:**
- Arbitrary data passed between stages
- Interpolated by hardware (unless `nointerpolation` specified)
- Can have any name (TEXCOORD, NORMAL, COLOR, etc.)
- Index numbers distinguish multiple semantics (TEXCOORD0, TEXCOORD1)

**System Values:**
- Predefined meaning to GPU
- Always have `SV_` prefix
- Cannot be arbitrary types
- May have special hardware handling

## System Value Summary Table

| Semantic | Stages | Type | Direction | Description |
|----------|--------|------|-----------|-------------|
| SV_VertexID | VS | uint | In | Vertex index |
| SV_InstanceID | VS | uint | In | Instance index |
| SV_Position | VS,GS,DS | float4 | Out | Clip-space position |
| SV_Position | PS | float4 | In | Screen-space position |
| SV_Target[N] | PS | float4 | Out | Render target output |
| SV_Depth | PS | float | Out | Depth buffer output |
| SV_IsFrontFace | PS | bool | In | Front/back face flag |
| SV_Coverage | PS | uint | In/Out | MSAA sample mask |
| SV_SampleIndex | PS | uint | In | MSAA sample index |
| SV_PrimitiveID | GS,PS | uint | In/Out | Primitive identifier |
| SV_RenderTargetArrayIndex | GS | uint | Out | Render target slice |
| SV_ViewportArrayIndex | GS | uint | Out | Viewport selection |
| SV_DispatchThreadID | CS | uint3 | In | Global thread ID |
| SV_GroupID | CS | uint3 | In | Thread group ID |
| SV_GroupThreadID | CS | uint3 | In | Thread ID in group |
| SV_GroupIndex | CS | uint | In | Flattened thread index |
| SV_TessFactor | HS | float[] | Out | Edge tessellation |
| SV_InsideTessFactor | HS | float[] | Out | Interior tessellation |
| SV_DomainLocation | DS | float2/3 | In | Parametric coordinates |
| SV_OutputControlPointID | HS | uint | In | Control point index |

**Shader Stage Abbreviations:**
- VS = Vertex Shader
- HS = Hull Shader (tessellation control)
- DS = Domain Shader (tessellation evaluation)
- GS = Geometry Shader
- PS = Pixel Shader
- CS = Compute Shader

## See Also

- [Shader Regex](./shader-regex.md) - Pattern-based shader modification
- [Custom Shader](./custom-shader.md) - Shader replacement and injection
- [Debugging](./debugging.md) - Shader hunting and frame analysis
- [Glossary](./glossary.md) - Terminology reference
- [Microsoft HLSL Semantics Documentation](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-semantics)
- [DirectX Pipeline](./directx-pipeline.md) - Pipeline stages and data flow
