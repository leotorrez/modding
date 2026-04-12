# WWMI Importing

This page explores the import process of the WWMI Tools plugin, and explains the various settings the plugin has for importing.

## Table of Contents

[[toc]]

## Assets

You can find various assets in the [WWMI-Assets](https://github.com/SpectrumQT/WWMI-Assets) repository. If not found there, you will need to follow the [WWMI Extraction](/guides/wwmi/wwmi_extract) guide.

## Importing

To import, make sure to select the object source folder, the simply press import!

## Settings

**`Vertex Colors`**

This can be either linear or sRGB. Preferably, keep it linear.

**`Skeleton`**

This is primarily for vertex groups rather than the actual skeleton. 

- The `Merged` option makes it so that all components share the same Vertex Group order (Ex: 5 is the head vertex group on the hair. 5 is also the head vertex group on the body.)
- The `Per-Component` option makes it so that components won't necessarily share the same Vertex Group order (Ex: 5 is the head vertex group on the hair. 27 is the head vertex group on the body.)

**`Skip Empty Vertex Groups`**

This will skip vertex groups that have no influence on the mesh. **Note:** You need to make sure `Add Missing Vertex Groups` is enabled when exporting later.

**`Mirror Mesh`**

This will mirror the mesh on the X axis when importing, since otherwise they are flipped. **Note:** You need to make sure `Mirror Mesh` is enabled when exporting later.