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
- Ensure you removed old versions of this plugin, 3dmigoto, LeoTools or similar (If you never made mods you won't have any of these. You can skip this step.)
- Restart `Blender`

## Importing a Mesh

- In a new project open the File menu at the top and head into `Import > 3DMigoto frame analysis dump (vb.txt + ib.txt)` (or `Import > XXMI Dump` if your capture uses the XXMI format)
- Locate a valid dump folder
  - You can get a valid dump folder from one of the asset repositories: [GIMI](https://github.com/SilentNightSound/GI-Model-Importer-Assets/), [SRMI](https://github.com/SilentNightSound/SR-Model-Importer-Assets/), [ZZMI](https://github.com/leotorrez/ZZ-Model-Importer-Assets/)
  - Or you can make a dump directly from the game yourself by following the [Hunting Guide](/guides/hunting.md)
- On the right hand side you have several options available. Hover over them for more information on their particular use.
  Some might prove useful according to the game you are trying to mod or the clean up steps you'd like applied to your mesh at import time.
- Chose the ones that will be useful for your project and click on `Import`
- DONE!

### Orientation & shading

Options to fix how the model sits in Blender:

| Option             | What it does                                          | When to use it                                          |
| ------------------ | ----------------------------------------------------- | ------------------------------------------------------- |
| Flip Mesh          | Mirrors the mesh over the X axis and inverts winding. | Most games: characters import facing the wrong way.     |
| Flip Winding Order | Reverses face orientation without flipping normals.   | Model looks RED with the **Face Orientation** overlay.  |
| Flip Normal        | Flips the normals only.                               | Model looks BLUE with the **Face Orientation** overlay. |
| Flip TEXCOORD V    | Flips the UVs vertically.                             | Textures appear upside down.                            |

### Related files, buffers & bones

| Option                             | What it does                                                                                                                                                                                    |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auto-load related meshes           | Imports other geometry from the capture that belongs with this mesh.                                                                                                                            |
| Load pre-SO buffers (experimental) | Loads the pre-skinning (neutral pose) buffers. Nice for Unity titles to bring models in unposed.                                                                                                |
| Load .buf files instead            | Reads binary dumps as one whole-buffer object instead of one object per draw call.                                                                                                              |
| Limit to draw range                | Only loads the vertices/indices used in that draw call (same as the .txt import).                                                                                                               |
| Merge meshes                       | Joins the related meshes into a single object.                                                                                                                                                  |
| Bone CB                            | Reads a skeleton pose from the capture's bone constant buffer, so you can import the mesh posed as it was in game. `Bone CB range` and `Vertex group step` fine-tune how the matrices are read. |

### Clean up after import

| Option         | What it does                                  |
| -------------- | --------------------------------------------- |
| Merge Vertices | Welds duplicate vertices (merge by distance). |
| Tris to Quads  | Converts triangles to quads where possible.   |
| Clean Loose    | Removes loose geometry.                       |

### Semantic remap (advanced)

If the game packs custom data in a common slot (for example reusing `TEXCOORD3`), use the remap list to tell the plugin what each semantic really is: game semantic on the left, replacement type on the right.

### XXMI dump extras

The `XXMI Dump` import additionally offers:

- **Game** - pick your title so the import applies the right conventions automatically (including `Flip Mesh` where the game needs it)
- **Create materials** - blank materials with the correct names assigned
- **Create collections** - makes collections that map to in-game objects, used to recombine objects at export

## Modding

The plugin is not designed to directly aid on the process of replacing, modifying or creating a mod. Simply on the import export process.
Check the other guides in the site to see examples of how to create and prepare your models for export.

If you are a beginner, I recommend you starting at [Mona Hat](/guides/mona-hat.md) or [Weapon Banana](/guides/weapon-banana.md) guides.

## Exporting a mod

- If it was not detected automatically, select your dump folder on the right hand side menu in your viewport
- Select a destination folder(can be a /Mods subdirectory) for your mod to be exported at
- Click on `Export`
- DONE!

### Where things go

- **Dump folder** - the game capture the plugin reads to match hashes and vanilla data. Point it at the folder you imported from.
- **Destination** - where the finished mod is written. Any `/Mods` subfolder works and the game picks it up from there.

### Export options

| Option                                             | What it does                                                                                                                                         |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ignore hidden objects                              | Leaves out objects hidden in the Blender viewport.                                                                                                   |
| Only export selected                               | Only exports from the objects you selected.                                                                                                          |
| Apply modifiers and shapekeys                      | Evaluates modifiers and shape keys before writing the buffers. Keep this on unless a modifier causes problems.                                       |
| Normalize weights                                  | Clamps and re-normalizes vertex weights to the game's format.                                                                                        |
| Copy textures                                      | Copies the mod's texture files into the output. Enable when your mod changes textures.                                                               |
| - Ignore shadow ramps / metal maps / diffuse guide | Skips those helper textures.                                                                                                                         |
| - Ignore duplicated textures                       | Doesn't re-copy textures that already have the same hash in the output.                                                                              |
| Outline optimization                               | Recomputes the game's outline data. Slow, so use it for the final export. The rounding precision below it controls how close outline vertices merge. |
| Export shape keys                                  | Enables shape key export for this mod (see the [Shape keys](#shape-keys) section).                                                                   |
| Batch pattern                                      | e.g. `name_###` - export to numbered folders. Pairs with the **Start Batch export** button.                                                          |
| Write buffers / Write ini                          | Uncheck either to skip writing buffer or ini files (handy when you only changed the other half, or are testing).                                     |

### INI & credit

- **Use custom template + path** - advanced: swap the built-in ini generator for your own template file.
- **Credit** - a name that pops up on screen when the mod loads (leave blank for none).

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

| Key name                    | Meaning                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------- |
| `Basis`                     | The base mesh. Ignored.                                                               |
| `Deform 1`, `Deform 2`, ... | Vanilla keys - the game's original deformations. Keep the number the import gave you. |
| `CUSTOM 1`, `CUSTOM 2`, ... | New deformations you create.                                                          |

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

| File / section         | What it is                                                                                   |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| `<mesh>SKDeltas.buf`   | The vertex movements (only moved vertices are stored).                                       |
| `<mesh>SKIdentity.buf` | Maps every key (vanilla + custom) to its export slot.                                        |
| `<mesh>SKMultipliers`  | Runtime buffer, generated in the `.ini`, no file.                                            |
| `<mesh>SKOverrides`    | The key values you left in Blender, written into the `.ini` as numbers you can edit by hand. |

Install the mod folder as usual.

### Runtime behaviour

- When the game applies a shape key to your mesh, the mod's buffers are used instead of the vanilla ones
- **Vanilla keys** you didn't touch stay slot-for-slot identical to the game. Edited ones produce your shape at whatever intensity the game requests; forced ones (slider != 0) hold the baked value
- **Custom keys** are deformations the game knows nothing about, so they only move from your override: `0` = off, `1` = full. Tune them by editing the `SKOverrides` numbers in the mod `.ini` without touching Blender

### Tips

- Use one custom key per slot number and never renumber vanilla keys - the number is the link to the game's data
- If a vanilla pool warning appears at export, the key count no longer matches the stored offsets/counts. It is safe to proceed, but the affected vanilla keys won't be driven by the game until the counts line up again
- Mirror symmetry (X axis) is handled automatically from the imported mesh's mirror flag - you only need to model one side

## Toolbox and helpers

In the 3D viewport, open the right-hand **N** panel and switch to the **XXMI Tools** tab. Besides the main import/export panel you get:

- **Apply modifiers to Objects with Shapekeys** - applies only the modifiers you pick onto the objects that carry shape keys, without ruining the keys.
- **Remove unused Vertex Groups** - cleans up vertex groups that are no longer needed.
- **Merge shared name Vertex Groups** - combines vertex groups that share a name. The _active Vertex Group_ variant merges them into the one you selected. Useful to consolidate bones.
- **Fill gaps in Vertex Groups** - creates the missing vertex groups in between your existing ones (e.g. fills 1,2 when only 0 and 3 exist).
- **Clean UV Names** - renames UV layers to the expected format.
- **Reset Vertex Colors** - sets the mesh's vertex colors to a single solid color.

There is also a **XXMI Object's Custom properties** panel on selected objects that shows the `3DMigoto:*` data imported with the mesh (hashes, mirror flag, shape key info). Those values drive the export, so treat them as read-only unless you know what you are doing.

### Other import/export entries

Under `File > Import` the plugin also exposes a few power-user tools, mostly for people familiar with the raw 3DMigoto workflow:

- `3DMigoto raw buffers (.vb + .ib)` - import/export the raw binary buffers directly
- `3DMigoto pose (.txt)` - import a captured pose onto an armature
- `Apply 3DMigoto vertex group map (.vgmap)` - apply a bone/vertex group mapping file
