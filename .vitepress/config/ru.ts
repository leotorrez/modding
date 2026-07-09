import { defineConfig, type DefaultTheme } from 'vitepress'

export const ru = defineConfig({
    lang: 'ru-RU',
    description: "Обучающие материалы, руководства и документация по моддингу для пользователей и модмэйкеров.",

    themeConfig: {
        nav: nav('/ru/'),

        sidebar: {
            '/ru/guides/': { base: '/ru/guides/', items: sidebarGuide() },
            '/ru/docs/': { base: '/ru/docs/', items: sidebarReference() }
        },

        editLink: {
            pattern: 'https://github.com/leotorrez/modding/edit/main/:path',
            text: 'Редактировать эту страницу на GitHub'
        },

        footer: {
            message: 'У вас есть инструмент, руководство или перевод, которые вы хотите добавить на сайт? Перейдите в <a href="/modding/contribute">Как помочь проекту?</a>',
            copyright: 'Разработан <a href="https://github.com/leotorrez">leotorrez</a>'
        },
    }
})

function nav(base:string): DefaultTheme.NavItem[] {
    return [
        { text: 'Главная', link: base},
        { text: 'Скачивания', link: base + 'downloads' },
        { text: 'С чего начать?', link: base + 'guides/getting-started' },
        { text: 'Руководства', link: base + 'guides' },
        { text: 'INI документация', link: base + 'docs' },
        { text: 'Благодарности', link: base + 'acknowledgements' },
    ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "Как пользоваться?",
      items: [
        { text: "С чего начать", link: "getting-started" },
        { text: "Где достать моды?", link: "getting-mods" },
        { text: "Лаунчеры", link: "launchers" },
        { text: "Мод мэнеджеры", link: "mod-managers" },
        { text: "Исправление ошибок", link: "troubleshooting" },
        { text: "FAQ (Часто задаваемые вопросы)", link: "faq" },
      ],
    },
    {
      text: "Руководства по созданию модов",
      items: [
        {
          text: "Основы",
          items: [
            { text: "Моддинг 101", link: "basics/modding-101" },
            { text: "Хантинг и дампинг 101", link: "basics/hunting" },
            { text: "Текстурирование 101", link: "basics/textures-101" },
            { text: "Шейдеры 101", link: "basics/shaders-101" },
          ],
        },
        {
          text: "Руководства XXMI",
          items: [
            { text: "XXMI инструменты", link: "xxmi/xxmi_tools" },
          ],
        },
        {
          text: "Руководства WWMI",
          items: [
            { text: "WWMI инструменты", link: "wwmi/wwmi_tools" },
            { text: "WWMI извлечение", link: "wwmi/wwmi_extract" },
            { text: "WWMI импорт", link: "wwmi/wwmi_import" },
            { text: "WWMI экспорт", link: "wwmi/wwmi_export" },
            { text: "WWMI Toolbox", link: "wwmi/wwmi_toolbox" },
          ],
        },
        {
          text: "Руководства GI",
          items: [
            { text: "GI текстуры и параметры", link: "games/gi/gi-textures" },
          ],
        },
        {
          text: "Руководства HSR",
          items: [
            { text: "HSR текстуры и параметры", link: "games/hsr/hsr-textures" },
          ],
        },
        {
          text: "Руководства WW",
          items: [
            { text: "WW текстуры и параметры", link: "games/wuwa/ww-textures" },
          ],
        },
        {
          text: "Руководства ZZZ",
          items: [
            { text: "ZZZ текстуры и параметры", link: "games/zzz/zzz-textures" },
          ],
        },
        {
          text: "Руководства Blender",
          items: [
            { text: "Blender Edit Mode", link: "blender/blender-edit" },
            { text: "Blender UI", link: "blender/blender-ui" },
            { text: "Blender Modifiers", link: "blender/blender-modifiers" },
            { text: "Blender материалы и запекание", link: "blender/blender-baking" },
          ],
        },
        {
          text: "Туториалы",
          items: [
            { text: "Шляпка Моны", link: "tutorials/mona-hat" },
            { text: "Банановое оружие", link: "tutorials/weapon-banana" },
          ],
        },
      ],
    },
  ];
}

function sidebarReference(): DefaultTheme.SidebarItem[] {
    return [{
        text: 'INI Документация',
        items: [
            { text: 'Введение', link: '' },
            { text: 'Терминология', link: 'glossary' },
            { text: '3dm статика', link: '3dm-statics' },
            {
                text: "Базовые понятия",
                items: [
                    { text: 'Что такое Override', link: 'override' },
                    { text: 'Ресурсы', link: 'resource' },
                    { text: 'Флаги', link: 'flags' },
                    { text: 'Замена шейдеров', link: 'shader-override' },
                    { text: 'Замена текстур', link: 'texture-override' },
                ]
            },
            {
                text: "Логика",
                items: [
                    { text: 'Операторы', link: 'operators' }, //move pre and post here
                    { text: 'Константы', link: 'constants' },
                    { text: 'Оператор Present', link: 'present' },
                    { text: 'Ключи | Key', link: 'key' },
                    { text: 'Лист команд', link: 'command-list' },
                    { text: 'Вызовы отрисовок', link: 'draw-calls' },
                    { text: 'Как дебажить INI', link: 'debugging' },
                ]
            },
            {
                text: "Продвинутые понятия",
                items: [
                    { text: 'Пайплан DirectX', link: 'directx-pipeline' },
                    { text: 'Графический конвеер в 3dm', link: 'lifespan-of-a-frame' },
                    { text: 'Продвинутый дампинг и поиск', link: 'advanced-hunting' },
                    { text: 'Как логировать', link: 'logs' },

                    { text: 'Шейдер Regex', link: 'shader-regex' },
                    { text: 'Нечеткое сопоставление', link: 'fuzzy-matching' },
                    { text: 'Кастомные Шейдеры', link: 'custom-shader' },
                    { text: 'Системные значения', link: 'system-values' },
                    { text: 'Пространство имен', link: 'namespace' },
                ]
            }
        ]
    }]
}
