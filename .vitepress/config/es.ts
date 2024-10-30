import { defineConfig, type DefaultTheme } from 'vitepress'

export const es = defineConfig({
    lang: 'es-ES',
    description: "Modding tutorials, guides and documentations for users and mod creators.",

    themeConfig: {
        nav: nav('/es/'),

        sidebar: {
            '/es/guides/': { base: '/es/guides/', items: sidebarGuide() },
            '/es/docs/': { base: '/es/docs/', items: sidebarReference() }
        },

        editLink: {
            pattern: 'https://github.com/leotorrez/modding/edit/main/:path',
            text: 'Edit this page on GitHub'
        },

        footer: {
            message: 'Do you have a tool, guide or translation that you want to add to the site? Check <a href="/modding/contribute">How to contribute?</a>',
            copyright: 'Developed by <a href="https://github.com/leotorrez">leotorrez</a>'
        },
    }
})

function nav(base:string): DefaultTheme.NavItem[] {
    return [
        { text: 'Inicio', link: base},
        { text: 'Descargas', link: base + 'downloads' },
        { text: 'Inicio Rápido', link: base + 'guides/getting-started' },
        { text: 'Guias de modding', link: base + 'guides' },
        { text: 'Documentación INI', link: base + 'docs' },
        { text: 'Reconocimientos', link: base + 'acknowledgements' },
    ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: 'Mod usage',
            items: [
                { text: 'Quick start', link: 'getting-started' },
                { text: 'Where to get mods?', link: 'getting-mods' },
                { text: 'Launchers', link: 'launchers' },
                { text: 'Mod managers', link: 'mod-managers' },
                { text: 'Troubleshooting', link: 'troubleshooting' },
                { text: 'FAQ', link: 'faq' },
            ]
        },
        {
            text: 'Guides',
            items: [
                { text: 'Modding 101', link: 'modding-101' },
                { text: 'Hunting', link: 'weapon-banana' },
                { text: 'Textures 101', link: 'textures-101' },
                { text: 'Shaders 101', link: 'shaders-101' },
                { text: 'XXMI Tools', link: 'xxmi' },
                { text: 'WWMI Tools', link: 'wwmi' },
                { text: 'Mona Hat', link: 'mona-hat' },
                { text: 'Weapon banana', link: 'weapon-banana' },
                { text: 'ZZZ textures and properties', link: 'zzz-textures' },
            ]
        },
    ]
}

function sidebarReference(): DefaultTheme.SidebarItem[] {
    return [{
        text: 'INI Documentation',
        items: [
            { text: 'Introduction', link: '' },
            { text: 'Glossary', link: 'glossary' },
            { text: '3dm Statics', link: '3dm-statics' },
            {
                text: "Basic concepts",
                items: [
                    { text: 'Override', link: 'override' },
                    { text: 'Resource', link: 'resource' },
                    { text: 'Flags', link: 'flags' },
                    { text: 'Shader Override', link: 'shader-override' },
                    { text: 'Texture Override', link: 'texture-override' },
                ]
            },
            {
                text: "Logic",
                items: [
                    { text: 'Operators', link: 'operators' }, //move pre and post here
                    { text: 'Constants', link: 'constants' },
                    { text: 'Present', link: 'present' },
                    { text: 'Key', link: 'key' },
                    { text: 'CommandList', link: 'command-list' },
                    { text: 'Draws Calls', link: 'draw-calls' },
                    { text: 'Debugging INIs', link: 'debugging' },
                ]
            },
            {
                text: "Advanced concepts",
                items: [
                    { text: 'DirectX pipeline', link: 'directx-pipeline' },
                    { text: 'Lifespan of a frame in 3dm', link: 'lifespan-of-a-frame' },
                    { text: 'Advanced hunting & dumping', link: 'advanced-hunting' },
                    { text: 'How to log', link: 'logs' },

                    { text: 'Shader Regex', link: 'shader-regex' },
                    { text: 'Fuzzy Matching', link: 'fuzzy-matching' },
                    { text: 'CustomShader', link: 'custom-shader' },
                    { text: 'System Values', link: 'system-values' },
                    { text: 'Namespace', link: 'namespace' },
                ]
            }
        ]
    }]
}
