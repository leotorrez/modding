# WW Textures and Properties

WuWa models have a few types of information encoded into their meshes other than the mere position of their vertex. That would be its normals, tangents, uvs, vertex color and weights.

:::danger
This guide is currently under construction. Information is lacking but more will be added in the future. Make sure to revisit often.
:::

## Table of Contents
[[toc]]


## Note

Most of this information is taken from the WWMI Tools Github Modder Guide: https://github.com/SpectrumQT/WWMI-Tools/blob/main/guides/modder_guide.md
## UV Maps

* Each object has 2 UV maps controlling texture application (TEXCOORD.xy for outside, TEXCOORD1.xy for inside).
* There's also one extra UV map (TEXCOORD2.xy) with frontal projection, potentially used for shading purposes. Documentation TBA.

## Vertex Colors 

There are 2 color attributes (COLOR and COLOR1):
* **COLOR**:
    - **R** - **Outline Mask**: Prevents outlines on certain areas from being drawn on certain angle, might be changing colors according to existing Material Functions in-game (needs more testing). 0 (black) means no draw, 1 (white) means draw.
    - **G** - **Outline Thickness**: 0 (black) means no outline, 1 (white) means thick outlines. However, Alpha at 0 is the exact opposite of Green value.
    - **B** - **Skin Mask**: Determines whenever the certain area is skin or not, affects colors and may be more. 0 (black) = not skin, 1 (white) = skin.
    - **A** - **Outline Thickness**: Only affects hair so far, Material Dependant.
    - For uasset dumps, R and B are swapped.
* **COLOR1**:
    - **R** - **Outlines Control**: not researched, set it to 0 (black).
    - **G** - **Outlines Control**: not researched, set it to 0 (black).
    - **B** - **Ignored**.
    - **A** - **Ignored**.