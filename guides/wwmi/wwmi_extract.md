# WWMI Extracting

This page explores the extract process of the WWMI Tools plugin, and explains the various settings the plugin has for extracting.

## Table of Contents

[[toc]]

## Dumping In Game

To dump in game:
- Open the hash hunting UI with 0 on the numpad.
- Press F8
- Once done, find the dump in the WWMI base folder (Where the exe is located)

**Note:** It is **strongly** recommended to do an F8 dump in the character archive when dumping characters or weapons, to minimise the dump size.

## Extracting Dumps

In blender:
- Select the frame dump folder (not the deduped folder, the base folder)
- Select the output folder
- Select `Extract Objects From Dump`
- Done!

## Settings

**`Textures Filtering: Skip Small`**

Skips small textures. You may select the minimum skip size with the `Min Size` setting on the right.

**`Textures Filtering: Skip .jpg`**

Skips jpg files in the dump.

**`Textures Filtering: Skip known cubemaps`**

Skips known cubemaps in the dump. It is best to avoid modding these to avoid errors.

**`Textures Filtering: Skip Same Slot-Hash`**

Skips textures that are in the same slot for multiple components. It is recommended to keep this disabled, as it may skip useful files!



