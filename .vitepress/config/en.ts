import { defineConfig, type DefaultTheme } from "vitepress";

export const en = defineConfig({
  lang: "en-US",
  description:
    "Modding tutorials, guides and documentations for users and mod creators.",

  themeConfig: {
    nav: nav(),

    sidebar: {
      "/guides/": { base: "/guides/", items: sidebarGuide() },
      "/docs/": { base: "/docs/", items: sidebarReference() },
    },

    editLink: {
      pattern: "https://github.com/leotorrez/modding/edit/main/:path",
      text: "Edit this page on GitHub",
    },

    footer: {
      message:
        'Do you have a tool, guide or translation that you want to add to the site? Check <a href="/modding/contribute">How to contribute?</a>',
      copyright:
        'Developed by <a href="https://github.com/leotorrez">leotorrez</a>',
    },
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: "Home", link: "/" },
    { text: "Downloads", link: "/downloads" },
    { text: "Quick Start", link: "/guides/getting-started" },
    { text: "Modding Guides", link: "/guides" },
    { text: "INI Documentation", link: "/docs" },
    { text: "Acknowledgements", link: "/acknowledgements" },
  ];
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "Mod usage",
      items: [
        { text: "Quick start", link: "getting-started" },
        { text: "Where to get mods?", link: "getting-mods" },
        { text: "Launchers", link: "launchers" },
        { text: "Mod managers", link: "mod-managers" },
        { text: "Troubleshooting", link: "troubleshooting" },
        { text: "FAQ", link: "faq" },
      ],
    },
    {
      text: "Guides",
      items: [
        { text: "Modding 101", link: "modding-101" },
        { text: "Hunting & dumping", link: "hunting" },
        { text: "Textures 101", link: "textures-101" },
        { text: "Shaders 101", link: "shaders-101" },
        { text: "XXMI Tools", link: "xxmi_tools" },
        { text: "WWMI Tools", link: "wwmi_tools" },
        { text: "Mona Hat", link: "mona-hat" },
        { text: "Weapon banana", link: "weapon-banana" },
        { text: "ZZZ textures and properties", link: "zzz-textures" },
        { text: "Blender Tips", link: "blender-tips" },
      ],
    },
  ];
}

function sidebarReference(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "INI Documentation",
      items: [
        { text: "Introduction", link: "" },
        { text: "Glossary", link: "glossary" },
        { text: "3dm Statics", link: "3dm-statics" },
        {
          text: "Basic concepts",
          items: [
            { text: "Override", link: "override" },
            { text: "Resource", link: "resource" },
            { text: "Flags", link: "flags" },
            { text: "Shader Override", link: "shader-override" },
            { text: "Texture Override", link: "texture-override" },
          ],
        },
        {
          text: "Logic",
          items: [
            { text: "Operators", link: "operators" }, //move pre and post here
            { text: "Constants", link: "constants" },
            { text: "Present", link: "present" },
            { text: "Key", link: "key" },
            { text: "CommandList", link: "command-list" },
            { text: "Draws Calls", link: "draw-calls" },
            { text: "Debugging INIs", link: "debugging" },
          ],
        },
        {
          text: "Advanced concepts",
          items: [
            { text: "DirectX pipeline", link: "directx-pipeline" },
            { text: "Lifespan of a frame in 3dm", link: "lifespan-of-a-frame" },
            { text: "Advanced hunting & dumping", link: "advanced-hunting" },
            { text: "How to log", link: "logs" },

            { text: "Shader Regex", link: "shader-regex" },
            { text: "Fuzzy Matching", link: "fuzzy-matching" },
            { text: "CustomShader", link: "custom-shader" },
            { text: "System Values", link: "system-values" },
            { text: "Namespace", link: "namespace" },
          ],
        },
      ],
    },
  ];
}
