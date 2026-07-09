# GI Textures and Properties

GI models have a few types of information encoded into their meshes other than the mere position of their vertex. That would be its normals, tangents, uvs, vertex color and weights.

## Table of Contents
[[toc]]

## UV Maps

* Most objects have 2 UV maps controlling texture application (TEXCOORD.xy for outside, TEXCOORD1.xy for inside).

## Textures

A Genshin character uses many different textures. Below is a basic identification and explanation of the textures a character can use:
- Base Diffuse - Base texture.
- Base Alpha - Used as a bloom/emissive mask in the body, alpha depending on texture, or as a blush mask for the face.
- Shadow Ramp - Determines shadow and lit color, as well as fake SSS. To be used with half lambert shading but you can still use it with ordinary lambert, just multiply SSS Rate by 2.
- Lightmap - For lightmaps, please look at the lightmap section.
- Normal Map - The normal map, it's functionality is like any other game.
- Specular Ramp - Similar to the Shadow Ramp texture, but for Specular.
- Metal MatCap texture - Used as a matcap on the metallic matcap mask (Lightmap R)
- Face Shadow Mask texture (alpha included) - controls lighting for the mouth and eyebrows.
- Face Lightmap texture - Controls face lighting.
## Lightmap

Lightmaps are split into channels, like most PBR maps. Here's what each channel does, neutral being the default/no-effect value:
- **R** - Used in calculating non-metallic specular AND Metallic matcap mask (< 0.9), aka metallic in Blender, neutral 0.0.
- **G** - Ambient Occlusion (< 0.2), and > 0.8 separates eye from the hair (only applies to hair lightmap, sometimes body lightmap like Yae’s), neutral 0.5.
- **B** - Used in calculating both non-metallic and metallic specular (as a whole), aka glossy/roughness in Blender, neutral 0.0.
- **A** - Used as a threshold for outline colors, multiplies specular values and the ramp textures, divided into a maximum of 5 regions, neutral is either 0 or 1.

**NOTE:** Lightmap values can vary slightly from character to character.


## Vertex Colors 

There is 1 main color attribute (COLOR), split into 4 channels:
- **R** - Used to complement Lightmap G
- **G** - Used for vertex ramp width, I also personally use this channel for outlines depending on camera distance
- **B** - Used for outlines, for example for Z-offset
- **A** - Base outline thickness that does not scale with camera