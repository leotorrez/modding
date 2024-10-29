
# Fixing mods

As time goes on and games update, there are times where mods break due to resource updates and all kinds of technical shortcommings. Usually, toolsmaker will converge to craft easy to use fixes that update mods to the current version of the game. At least for the more popular elements of the game.

::: danger
Do not rush to download the first file you find online, malicious actors tend to take advantage of the situation and upload fake fixes that will harm your computer. Always make sure to download from trusted sources.
:::

Here is a list of trusted developers that provide fixes for mods:

- [SilentNightSound](https://gamebanana.com/members/2176153)
- [Petrascyll](https://gamebanana.com/members/2644630)
- [Gustav0](https://gamebanana.com/members/2890460)
- [SpectrumQT](https://gamebanana.com/members/2837527) - Specializes in WW fixes
- [sora_](https://gamebanana.com/members/1367828) - Specializes in HSR fixes
- [Thoronium](https://gamebanana.com/members/3210319) - Specializes in "reverse" fixes for private servers

## The halves method

When you have an issue and you don't know which mod is causing it, you can use the "halves method" to track down the problematic mod. Here's how it works:

    1. Move half of your mods to a different folder
    2. Start the game
    3. If it works, move half of the remaining mods back
    4. If it doesn't work, move the other half of the mods back
    5. Repeat until you find the problematic mod

Mathematically speaking, this method is the most efficient way to find a problematic mod(no more than 7 iterations).
Some times there are no mods breaking things and instead the conflict is caused by some file in `/ShaderFixes`. If removing all mods from your `/Mods` folder doesn't fix the issue, then using this method in `/ShaderFixes` is the way to go.

## Game crashes when I try to start it

Make sure you have the latest version of the launcher, game and mods installed. If all else fails you can try the "halves method" to track down the problematic mod. Once identified you can diagnose its issue or ask for help in the [Discord server's #mod-help channel](https://discord.com/channels/971945032552697897/995556765179596890), more advanced users will be glad to lend a hand. Alternatively you can simply get rid of the mod and wait for an update or fix to be released.

## Mod renders partially or collapses into itself

Due to technical limitations when a mod is first loaded, is best to avoid having the character on screen.

This is a known issue and we are working on a more sofisticated fix.

To fix it you simply need to reload your character/object in memory, the safest way to achieve this to restart the game. Alternatively you can try hiding the character/object in question from the camera and teleport away or load a new stage. It should clear enough of your memory to force your character/object to reload.

## Private servers and game versions

If you are using a private server, chances are that the mod you downloaded was not made for an old version like the one you are using. Therefore you will need to "unfix"/downgrade the mod to the version you are in. There are "reverse fixes" that achieve this, but they are not as common as the regular fixes. You can ask for help in the [Discord server's #mod-help channel](https://discord.com/channels/971945032552697897/995556765179596890) for specifics.

## [GI] Mod renders like a mess of geometry

In version 4.1 DCR (Dynamic Character Resolution) was introduced and it breaks the rendering of mods when enabled. To fix the issue simply disable it in the graphic configuration of your game. Some video card driver updates or software like Nvidia Geforce Experience might force-enable it, so make sure to check it every time you see this issue happening.
![DCR](./img/dcr.png)

## [GI] Mesh should be transparent but the mesh is still opaque

The modern method to make a mesh transparent consist of using a library called `TexFX`, it comes installed by default with XXMI launcher. If you are using a traditional 3dmigoto install you might need to manually install `TexFX` as well. For an updated guide on the subject [read about it here](https://gamebanana.com/mods/485763)

## [GI] Character's reflection/outline has the wrong coloring

This is caused by the game rendering pipeline. Thankfully there is an universal solution. If you are using XXMI Launcher to mod the game, said solution comes installed by default. If you are using 3dmigoto, you can [download the fix from here](https://github.com/leotorrez/LeoTools/blob/main/releases/ORFix.ini) and [read more about it here](https://github.com/leotorrez/LeoTools/blob/main/guides/ORFixGuide.md).
After installation press F10 to reload the mods.

## [GI] Character or their outline is sunk into the floor

Similar to the last issue, this is solved by installing some required files into your 3dmigoto folder. You can [download the fix from here](https://github.com/leotorrez/LeoTools/releases/tag/offset-scaleChangerV3). To install it uncompress the files into your 3dmigoto folder and press F10 to reload the mods.

## [HSR] When my character stops running their model breaks

<!-- TODO: Find good resources about this xD -->

## [ZZZ] V-Sync activated delays user input up to a second or more

This one is new for me and is the least researched of the bunch. I will be investigating and trying to replicate it, for the time being you can try setting fps to 60 or turning off vsync to overcome it.

## [ZZZ] Models disappear when I walk a bit away from them

That is LOD triggering and there is not thing modding tools can do to stop it from happening. What it does is to load a lower quality version of the model and its textures as you get further away. In order to combat this you "could" get the hashes of the LOD model and make a new ini for your mod to also apply over that model, however this process is very tedious to do manually and tedious to automatize.

## [ZZZ] Mod texutures/model doesn't load

 Devices under 6GB VRAM are forced to use 1K textures and mods are designed to work on 2k textures hence some mod textures look broken. Current fix scripts patch mods to solve this issue for you as well as updating them to the current version.

## [ZZZ] Jane Doe's face is broken

This issue is caused with a conflict with Lucy's mods. To fix it the author of the mod will have to update it to avoid said conflict. However if you are comfortable editing ini files you can update it yourself.

Track down the `LucyHairPosition` texture override in the mod's ini file. It should look something like this:
```ini
...

[TextureOverrideLucyHairPosition]
hash = ...
handling = skip
vb0 = ResourceLucyHairPosition
vb2 = ResourceLucyHairBlend
draw = 3079,0

...
```
You must replace it for a `LucyHairBlend` texture override, keep in mind its hash will be updated in the process to `5315f036`

```ini
...

[TextureOverrideLucyHairPosition]
hash = 5315f036
handling = skip
if DRAW_TYPE == 1
    vb0 = ResourceLucyHairPosition
    vb2 = ResourceLucyHairBlend
    draw = 3079,0
endif

...
```
