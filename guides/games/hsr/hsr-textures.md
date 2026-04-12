# HSR Textures and Properties

HSR models have a few types of information encoded into their meshes other than the mere position of their vertex. That would be its normals, tangents, uvs, vertex color and weights.

:::danger
This guide is currently under construction. Information is lacking but more will be added in the future. Make sure to revisit often.
:::

## Table of Contents
[[toc]]

## Lightmap

Lightmaps are split into channels, like most PBR maps. Here's what each channel does, neutral being the default/no-effect value:

- **R** - Rimlight Mask, neutral 1.0.
- **G** - Ambient Occlusion, neutral 0.5.
- **B** - Specular, neutral 0.0.
- **A** - Material ID, 8 divisions, neutral is usually 0 or 1.

## Vertex Colors

Vertex Colors in HSR reportedly do very little, or must be the same value as the original character, depending on the character (Examples: Fei Xiao, Acheron).