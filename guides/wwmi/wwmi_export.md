# WWMI Exporting

This page explores the export process of the WWMI Tools plugin, and explains the various settings the plugin has for exporting.

## Table of Contents

[[toc]]

## Exporting a mod

- If it was not detected automatically, select your dump folder on the right hand side menu in your viewport
- Select a destination folder(can be a /Mods subdirectory) for your mod to be exported at
- Ensure that the `Skeleton` setting is set to the same value as what you selected when initially importing your object into blender.
- Click on `Export`
- DONE!

## Basic settings

**`Mirror Mesh`**

Flips a model on it's X axis. You should only select this if you selected `Mirror Mesh` on import.

**`Apply all modifiers`** 

This applies the modifiers on temporary copies of each object. **Note:** This uses a different process than the application of modifiers in XXMI tools, and as such the application process can be substantially slower. This is due to how shape keys are processed for WWMI modding.

**`Copy Textures`**

This copies textures from the extracted model folder to the mod folder. **This should preferably be disabled after the first export in order to not overwrite textures.**

**`Write Mod INI`**

This writes a mod INI, and will overwrite existing mod INIs. You may disable this as long as vertices aren't added or removed to the mod.

**`Comment INI code`**

Adds comments to INI code. Useful to learn how WWMI INIs work.

**`Ignore nested collections`**

This will ensure that models within nested collections (ie Collections within the selected collection for export) are ignored when exporting.

**`Ignore Hidden Objects`** 

This will ignore hidden objects when exporting.

**`Ignore Muted Shape Keys`**

This will ignore muted shape keys (ie shape keys where the checkmark box is empty) when exporting a model with shape keys.

## Advanced settings

``Textures Filtering: Skip Known Cubemaps``

This will skip a texture if its hash is listed in the list of known cubemaps. This should usually be enabled, since otherwise it may break the texture.

``Add Missing Vertex Groups``

This will automatically fill out the vertex groups list on a mesh. Example: If a mesh ending in VG 5 is missing 2, 3, 4, it will add VGs 2, 3, 4 as empty VGs.

``Fill Missing Mesh Data``

This will automatically fill out mesh data, from COLOR to the UV maps.

``Unrestricted Custom Shape Keys``

This allows the user to add shape keys to meshes without shape keys initially. This adds mod ini logic.

``Skeleton scale``

This will scale meshes to be larger or smaller depending on the value. By default it is 1.

``Partial export``

This will skip select buffers. Only for advanced users that know what they're doing.

## Mod Info

The mod info will allow a mod author to display their name, the mod name, the mod description, the mod link and mod logo for notifications and mod managers.

## Ini template

When enabling the `Use Custom Template` setting, this allows you to use a custom ini template.

**This feature requires [Jinja](https://jinja.palletsprojects.com/en/stable/) knowledge for the template.**