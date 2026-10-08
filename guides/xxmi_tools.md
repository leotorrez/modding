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

## Shape keys

Some games (Zenless Zone Zero is one of them) drive their characters with a real shape key system: deformations are morph targets that blend into the base mesh at runtime. The plugin supports modding those entirely from Blender, letting you:

- Keep and edit the original deformations the game already ships
- Add brand-new deformations
- Have both work in game with a plain `.ini` + buffer mod, no extra steps

### Naming your shape keys

Shape keys are matched by **name**. The rule is:

```text
DEFORM<n>   or   CUSTOM<n>
```

- The number has **at most 4 digits** (`0` to `9999`)
- A separator is optional, so `DEFORM1`, `DEFORM 1`, `DEFORM_1`, `DEFORM-1` and `DEFORM.1` all work (same for `CUSTOM`)
- Names are case insensitive

| Key name | Meaning |
| --- | --- |
| `Basis` | The base mesh. Ignored. |
| `Deform 1`, `Deform 2`, ... | Vanilla keys - the game's original deformations. Keep the number the import gave you. |
| `CUSTOM 1`, `CUSTOM 2`, ... | New deformations you create. |

Any key with a different name is skipped at export (a warning is printed, nothing breaks). The number is what ties a vanilla key to the game: `Deform 7` maps back to the game's 7th shape key slot. Never renumber the vanilla keys; edit their shape or leave them alone. New keys are appended after all the vanilla ones, in numeric order.

### Capturing shape key data

Dumps are captured with the launcher as usual. When you capture a character that uses shape keys, the tool also saves:

```text
<mesh>SKDeltas.buf     raw vertex movements
<mesh>SKDeltas.txt     text header with `sk offsets:` / `sk counts:`
```

Keep the dump folder pointed at by the plugin. That header is what the importer uses to build the vanilla keys.

### Importing shape keys

Import the dump exactly like any other model. For a mesh that uses shape keys you get:

- One shape key per original deformation, named `Deform {n}`
- The original offsets/counts and the mirror flag stored automatically (`3DMigoto:SKOffsets`, `3DMigoto:SKCounts`, `3DMigoto:FlipMesh`); you never touch these, they are read back at export time

:::tip
A character's mesh is often split into several objects (e.g. face parts A/B/C). Every sub-object gets its own copy of the vanilla keys and they all share the same export slot pool.
:::

### Editing the original keys

Vanilla keys behave exactly like the game's: each one moves a set of vertices out of the base pose.

- To change what a deformation **looks like**, select the key in the Shape Keys panel and move vertices. Only the vertices that actually move are exported, so the file stays small.
- To keep a key behaving **like the original game**, leave its value slider at `0` - the game keeps driving it every frame, and your edit only changes the shape it produces.
- To force a fixed amount instead, set the slider to a value (`1` = full) - the plugin bakes it into the mod's `.ini` and it holds in game.

### Adding a brand-new deformation

1. Select an existing key (usually the one closest to what you want to make)
2. Click **Duplicate** in the Shape Keys panel
3. Rename it to `CUSTOM 1` (or `CUSTOM 2`, any unique number of at most 4 digits)
4. Edit its vertices to define the deformation

The value slider you leave on it becomes the key's exported default intensity.

### Exporting a mod with shape keys

Export exactly like any other mod. Make sure **Export shape keys** is enabled (it is by default). The plugin generates, per mesh:

| File / section | What it is |
| --- | --- |
| `<mesh>SKDeltas.buf` | The vertex movements (only moved vertices are stored). |
| `<mesh>SKIdentity.buf` | Maps every key (vanilla + custom) to its export slot. |
| `<mesh>SKMultipliers` | Runtime buffer, generated in the `.ini`, no file. |
| `<mesh>SKOverrides` | The key values you left in Blender, written into the `.ini` as numbers you can edit by hand. |

Install the mod folder as usual.

### Runtime behaviour

- When the game applies a shape key to your mesh, the mod's buffers are used instead of the vanilla ones
- **Vanilla keys** you didn't touch stay slot-for-slot identical to the game. Edited ones produce your shape at whatever intensity the game requests; forced ones (slider != 0) hold the baked value
- **Custom keys** are deformations the game knows nothing about, so they only move from your override: `0` = off, `1` = full. Tune them by editing the `SKOverrides` numbers in the mod `.ini` without touching Blender

### Tips

- Use one custom key per slot number and never renumber vanilla keys - the number is the link to the game's data
- If a vanilla pool warning appears at export, the key count no longer matches the stored offsets/counts. It is safe to proceed, but the affected vanilla keys won't be driven by the game until the counts line up again
- Mirror symmetry (X axis) is handled automatically from the imported mesh's mirror flag - you only need to model one side

## Advanced usage of the tool

In construction...
