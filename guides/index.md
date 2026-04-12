# Guides

The following guides are set up in roughly the order they should be read in.

## Glossary

- **Mod user**: Person who uses mods in XXMI games.
- **Mod maker**: Person who creates mods for XXMI games.
- **Fix**: Term often used to refer to scripts or programs that fix a specific issue in mods for a given version.

## Mod usage tutorials

- [Getting started with XXMI mods](./getting-started.md)
- [FAQ](./faq.md)
- [Getting Mods](./getting-mods.md)
- [Launchers](./launchers.md)
- [Mod Managers](./mod-managers.md)
- [Troubleshooting](./troubleshooting.md)

## Mod Making Sections
<!--
- [Modding 101](./basics/modding-101.md)
- [Textures 101](./basics/textures-101.md)
- [XXMI Tools](./xxmi/xxmi_tools.md)
- [Blender tips](./blender/blender-ui.md)
- [Weapon banana](./tutorials/weapon-banana.md)
- [Mona Hat tutorial](./tutorials/mona-hat.md)
- [Hunting & Dumping](./basics/hunting.md)
- [Shaders 101](./basics/shaders-101.md)
-->

<CardGrid :items="[
  { 
    title: 'Basics', 
    details: 'The Basics! Modding 101, Hunting 101, Textures 101, Shaders 101, 101 galore.', 
    link: './basics/basics' 
  },
  { 
    title: 'XXMI Guides', 
    details: 'Tutorials for the XXMI Blender plugin.', 
    link: './xxmi/xxmi' 
  },
  { 
    title: 'WWMI Guides', 
    details: 'Tutorials for the WWMI Blender plugin.', 
    link: './wwmi/wwmi' 
  },
    { 
    title: 'Blender', 
    details: 'Blender guides for beginners. Includes UI, Baking, Materials, Modifiers and Edit Mode tips.', 
    link: './blender/blender' 
  },
  { 
    title: 'Tutorials', 
    details: 'Various additional tutorials, from texturing guides all the way to modelling guides.', 
    link: './tutorials/tutorials' 
  }
]" />

## Game Specific Guides

<CardGrid :items="[
  { 
    title: 'Genshin Impact', 
    details: 'Modding guides about properties specific to Genshin Impact.', 
    link: './games/gi/gi-textures' 
  },
  { 
    title: 'Honkai Star Rail', 
    details: 'Modding guides about properties specific to Honkai Star Rail.', 
    link: './games/hsr/hsr-textures' 
  },
  { 
    title: 'Wuthering Waves', 
    details: 'Modding guides about properties specific to Wuthering Waves.', 
    link: './games/wuwa/ww-textures' 
  },
    { 
    title: 'Zenless Zone Zero', 
    details: 'Modding guides about properties specific to Zenlss Zone Zero.', 
    link: './games/zzz/zzz-textures' 
  }
]" />