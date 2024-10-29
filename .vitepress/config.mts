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
    // ru: {
    //   label: 'Russian',
    //   lang: 'ru'
    // },
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
          { text: 'Hunting', link: '/guides/weapon-banana' },
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
          { text: 'Glossary', link: '/docs/glossary' },
          { text: '3dm Statics', link: '/docs/3dm-statics' },
          {
            text:"Basic concepts", 
            items:[
              { text: 'Override', link: '/docs/override' },
              { text: 'Resource', link: '/docs/resource' },
              { text: 'Flags', link: '/docs/flags' },
              { text: 'Shader Override', link: '/docs/shader-override' },
              { text: 'Texture Override', link: '/docs/texture-override' },
            ]
          },
          {
            text:"Logic", 
            items:[
              { text: 'Operators', link: '/docs/operators' }, //move pre and post here
              { text: 'Constants', link: '/docs/constants' },
              { text: 'Present', link: '/docs/present' },
              { text: 'Key', link: '/docs/key' },
              { text: 'CommandList', link: '/docs/command-list' },
              { text: 'Draws Calls', link: '/docs/draw-calls' },
              { text: 'Debugging INIs', link: '/docs/debugging' },
            ]
          },
          {
            text:"Advanced concepts",
            items:[
              { text: 'DirectX pipeline', link: '/docs/directx-pipeline' },
              { text: 'Lifespan of a frame in 3dm', link: '/docs/lifespan-of-a-frame' },
              { text: 'Advanced hunting & dumping', link: '/docs/advanced-hunting' },
              { text: 'How to log', link: '/docs/logs' },

              { text: 'Shader Regex', link: '/docs/shader-regex' },
              { text: 'Fuzzy Matching', link: '/docs/fuzzy-matching' },
              { text: 'CustomShader', link: '/docs/custom-shader' },
              { text: 'System Values', link: '/docs/system-values' },
              { text: 'Namespace', link: '/docs/namespace' },
            ]
          },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/leotorrez' },
      { icon: 'discord', link: 'https://discord.gg/agmg' },
    ],

    footer: {      
      message: 'Do you have a tool, guide or translation that you want to add to the site? Check <a href="/modding/contribute">How to contribute?</a>',
      copyright: 'Developed by <a href="https://github.com/leotorrez">leotorrez</a>'
    },

    // https://vitepress.dev/reference/default-theme-carbon-ads
    // carbonAds: {
    //   code: 'your-carbon-code',
    //   placement: 'your-carbon-placement'
    // }
  }
})
