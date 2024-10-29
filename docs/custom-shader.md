# CustomShader (section)
Running your own shader. Calling this with the `run =` will create a new draw call. All of the following parameters are optional. 
```ini
[CustomShaderWOW]
handling = skip
drawindexed = auto
```

## topology
https://learn.microsoft.com/en-us/windows/win32/direct3d11/d3d11-primitive-topology  
Change object rendering type.  
Values:  
point_list  
line_list  
line_strip  
triangle_list  
triangle_strip  
line_list_adj  
line_strip_adj  
triangle_list_adj  
triangle_strip_adj  
1_control_point_patch_list  
2_control_point_patch_list  
3_control_point_patch_list  
4_control_point_patch_list  
5_control_point_patch_list  
6_control_point_patch_list  
7_control_point_patch_list  
8_control_point_patch_list  
9_control_point_patch_list  
10_control_point_patch_list  
11_control_point_patch_list  
12_control_point_patch_list  
13_control_point_patch_list  
14_control_point_patch_list  
15_control_point_patch_list  
16_control_point_patch_list  
17_control_point_patch_list  
18_control_point_patch_list  
19_control_point_patch_list  
20_control_point_patch_list  
21_control_point_patch_list  
22_control_point_patch_list  
23_control_point_patch_list  
24_control_point_patch_list  
25_control_point_patch_list  
26_control_point_patch_list  
27_control_point_patch_list  
28_control_point_patch_list  
29_control_point_patch_list  
30_control_point_patch_list  
31_control_point_patch_list  
32_control_point_patch_list  
```ini
[CustomShaderTopology]
topology = point_list
handling = skip
drawindexed = auto
```

## cull
https://learn.microsoft.com/en-us/windows/win32/api/d3d11/ne-d3d11-d3d11_cull_mode  
Indicates triangles facing a particular direction are not drawn.  
Values:  
none  
front  
back  
```ini
[CustomShaderCull]
cull = none
handling = skip
drawindexed = auto
```

## fill
https://learn.microsoft.com/en-us/windows/win32/api/d3d11/ne-d3d11-d3d11_fill_mode  
Determines the fill mode to use when rendering triangles.
Values:  
wireframe    
solid    
```ini
[CustomShaderFill]
fill = solid
handling = skip
drawindexed = auto
```

## blend
https://learn.microsoft.com/en-us/windows/win32/api/d3d11/ne-d3d11-d3d11_blend  
Blend factors, which modulate values for the pixel shader and render target.  
2 applications  
1. blend = disable  
2. blend = BlendOp SrcBlend DestBlend
Where SrcBlend and DestBlend can have values:  
zero  
one  
src_color  
inv_src_color  
src_alpha  
inv_src_alpha  
dest_alpha  
inv_dest_alpha  
dest_color  
inv_dest_color  
src_alpha_sat  
blend_factor  
inv_blend_factor  
src1_color  
inv_src1_color  
src1_alpha  
inv_src1_alpha  

BlendOp Values:  
add  
subtract  
rev_subtract  
min  
max  

also blend is blend[0]-blend[7]

```ini
[CustomShaderBlend]
blend[0] = add src_alpha inv_src_alpha
handling = skip
drawindexed = auto
```

## alpha 
alpha = BlendOpAlpha SrcBlendAlpha DestBlendAlpha

Where SrcBlendAlpha and DestBlendAlpha can have values:  
zero  
one  
src_color  
inv_src_color  
src_alpha  
inv_src_alpha  
dest_alpha  
inv_dest_alpha  
dest_color  
inv_dest_color  
src_alpha_sat  
blend_factor  
inv_blend_factor  
src1_color  
inv_src1_color  
src1_alpha  
inv_src1_alpha  

BlendOpAlpha Values:  
add  
subtract  
rev_subtract  
min  
max  

also alpha is alpha[0]-alpha[7]

```ini
[CustomShaderAlpha]
alpha[0] = add src_alpha inv_src_alpha
handling = skip
drawindexed = auto
```

## max_executions_per_frame
max_executions_per_frame to limit this to the first time the reflection  
```ini
[CustomShaderMEPF]
max_executions_per_frame = 1
handling = skip
drawindexed = auto
```

## alpha_to_coverage
Alpha-to-coverage is a multisampling technique that is most useful for situations such as dense foliage where several overlapping polygons use alpha transparency to define edges within the surface.
```ini
[CustomShaderATC]
alpha_to_coverage = 0
handling = skip
drawindexed = auto
```
## ps
## vs
## gs
## cs
## ps-tx


<!-- TODO: add ps,vs,gs,cs,vs-t and similars -->