import { defineConfig } from 'vitepress'

export const shared = defineConfig({
  title: "Modding Guides",
  lastUpdated: true,
  base: '/modding/',
  cleanUrls: true,
  themeConfig: {
    logo: '/SVGcrose.svg',
    i18nRouting: true,
    search: { provider: 'local' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/leotorrez' },
      { icon: 'discord', link: 'https://discord.gg/agmg' },
    ],

    // https://vitepress.dev/reference/default-theme-carbon-ads
    // carbonAds: {
    //   code: 'your-carbon-code',
    //   placement: 'your-carbon-placement'
    // }
  }
})