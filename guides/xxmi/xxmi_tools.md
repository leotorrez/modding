# XXMI Tools

We will look into the features of XXMI Tools blender plugin. From importing a mesh into the editor all the way up to in game reinjection.

:::danger
This guide is currently under construction. Information is lacking but more will be added in the future. Make sure to revisit often.
:::

## Table of Contents

[[toc]]

## Installation

- Head to <https://github.com/leotorrez/XXMITools/releases>
- Download the latest `.zip` file
- Open `blender settings > Add-ons > Install from Disk`
- Locate the `zip file` and proceed with the installation
- Ensure you removed old versions of this plugin, 3dmigoto, GIMI, SRMI, LeoTools or similar (If you never made mods you won't have any of these. You can skip this step.)
- Restart `Blender`

## Importing a Mesh

- In a new project open the File menu at the top and head into `Import > 3DMigoto frame analysis dump (vb.txt + ib.txt)`
- Locate a valid dump folder
  - You can get a valid dump folder from one of the asset repositories: [GIMI](https://github.com/SilentNightSound/GI-Model-Importer-Assets/), [SRMI](https://github.com/SilentNightSound/SR-Model-Importer-Assets/), [ZZMI](https://github.com/leotorrez/ZZ-Model-Importer-Assets/)
  - Or you can make a dump directly from the game yourself by following the [Hunting Guide](/guides/hunting.md)
- On the right hand side you have several options available. Hover over them for more information on their particular use.
  Some might prove useful according to the game you are trying to mod or the clean up steps you'd like applied to your mesh at import time.
- Chose the ones that will be useful for your project and click on `Import`
- DONE!

## Modding

The plugin is not designed to directly aid on the process of replacing, modifying or creating a mod. Simply on the import export process.
Check the other guides in the site to see examples of how to create and prepare your models for export.

If you are a beginner, I recommend you starting at [Mona Hat](/guides/mona-hat.md) or [Weapon Banana](/guides/weapon-banana.md) guides.

## Exporting a mod

- If it was not detected automatically, select your dump folder on the right hand side menu in your viewport
- Select a destination folder(can be a /Mods subdirectory) for your mod to be exported at
- Click on `Export`
- DONE!

## Advanced usage of the tool

In construction...
