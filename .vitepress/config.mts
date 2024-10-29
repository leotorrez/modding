import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Modding Guides",
  description: "Modding tutorials, guides and documentations for users and mod creators.",
  lastUpdated: true,
  base: '/modding/',
  locales: {
    root: {
      label: 'English',
      lang: 'en'
    },
    // es: {
    //   label: 'Spanish',
    //   lang: 'es',
    // },
    // zh: {
    //   label: 'Chinese',
    //   lang: 'zh-CN'
    // },
    ru: {
      label: 'Russian',
      lang: 'ru'
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: './modding/public/SVGcrose.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Downloads', link: '/downloads' },
      { text: 'Quick Start', link: '/guides/getting-started' },
      { text: 'Modding Guides', link: '/guides' },
      { text: 'INI Documentation', link: '/docs' },
      { text: 'Acknowledgements', link: '/acknowledgements' },
    ],

    sidebar: [
      {
        text: 'Mod usage',
        items: [
          { text: 'Quick start', link: '/guides/getting-started' },
          { text: 'Where to get mods?', link: '/guides/getting-mods' },
          { text: 'Launchers', link: '/guides/launchers' },
          { text: 'Mod managers', link: '/guides/mod-managers' },
          { text: 'Troubleshooting', link: '/guides/troubleshooting' },
          { text: 'FAQ', link: '/guides/faq' },
        ]
      },
      {
        text: 'Guides',
        items: [
          { text: 'Modding 101', link: '/guides/modding-101' },
          { text: 'Textures 101', link: '/guides/textures-101' },
          { text: 'Shaders 101', link: '/guides/shaders-101' },
          { text: 'XXMI Tools', link: '/guides/xxmi' },
          { text: 'WWMI Tools', link: '/guides/wwmi' },
          { text: 'Mona Hat', link: '/guides/mona-hat' },
          { text: 'Weapon banana', link: '/guides/weapon-banana' },
          { text: 'ZZZ textures and properties', link: '/guides/zzz-textures' },
        ]
      },
      {
        text: 'INI Documentation',
        items: [
          { text: 'Introduction', link: '/docs' },
          { text: 'CommandList', link: '/docs/command-list' },
          { text: 'Constants', link: '/docs/constants' },
          { text: 'CustomShader', link: '/docs/custom-shader' },
          { text: 'Key', link: '/docs/key' },
          { text: 'Modifiers', link: '/docs/modifiers' },
          { text: 'Namespace', link: '/docs/namespace' },
          { text: 'Operators', link: '/docs/operators' },
          { text: 'Override', link: '/docs/override' },
          { text: 'Present', link: '/docs/present' },
          { text: 'Properties', link: '/docs/properties' },
          { text: 'Resource', link: '/docs/resource' },
          { text: 'Shader Override', link: '/docs/shader-override' },
          { text: 'Troubeshoothing', link: '/docs/troubleshooting' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/leotorrez' },
      { icon: 'discord', link: 'https://discord.gg/agmg' },
    ],

    footer: {      
      message: 'Do you have a tool, guide or translation that you want to add to the site? Check <a href="/contribute">How to contribute?</a>',
      copyright: 'Developed by <a href="https://github.com/leotorrez">leotorrez</a>'
    },

    // https://vitepress.dev/reference/default-theme-carbon-ads
    // carbonAds: {
    //   code: 'your-carbon-code',
    //   placement: 'your-carbon-placement'
    // }
  }
})
