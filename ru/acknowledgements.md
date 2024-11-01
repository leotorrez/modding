---
layout: page
sidebar: false
footer: false
---
<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
  VPTeamPageSection
} from 'vitepress/theme'

const authors = [
  {
    avatar: 'https://www.github.com/???.png',
    name: 'Chiri',
    title: 'Создатель 3dmigoto',
    links: [
      // { icon: 'github', link: 'https://github.com/Chiri' }
    ]
  },
  {
    avatar: 'https://github.com/bo3b.png',
    name: 'bo3b',
    title: 'Главный разработчик текущей 3DMigoto',
    links: [
      { icon: 'github', link: 'https://github.com/bo3b' }
    ]
  },
  {
    avatar: 'https://github.com/DarkStarSword.png',
    name: 'DarkStarSword',
    title: 'Главный разработчик текущей 3DMigoto',
    links: [
      { icon: 'github', link: 'https://github.com/DarkStarSword' }
    ]
  },
]
const devs = [
  {
    avatar: 'https://www.github.com/SilentNightSound.png',
    name: 'SilentNightSound',
    title: 'Создатель GIMI',
    links: [
      { icon: 'github', link: 'https://github.com/silentnightsound' },
      { icon: 'gamebanana', link: 'https://gamebanana.com/members/2176153'},
    ]
  },
  {
    avatar: 'https://www.github.com/SinsofSeven.png',
    name: 'SinsofSeven',
    title: 'Создатель TexFx',
    links: [
      { icon: 'github', link: 'https://github.com/sinsofseven' },
      { icon: 'gamebanana', link: 'https://gamebanana.com/members/2823441'},
    ]
  },
  {
    avatar: 'https://www.github.com/Petrascyll.png',
    name: 'Scyll',
    title: 'Создатель GUI Collect',
    links: [
      { icon: 'github', link: 'https://github.com/petrascyll' },
      { icon: 'gamebanana', link: 'https://gamebanana.com/members/2644630'},
    ]
  },
  {
    avatar: 'https://www.github.com/Seris0.png',
    name: 'Gustav0',
    title: 'Создатель XXMI advanced tooling',
    links: [
      { icon: 'github', link: 'https://github.com/Seris0' },
      { icon: 'gamebanana', link: 'https://gamebanana.com/members/2890460'},
    ]
  },
  {
    avatar: 'https://www.github.com/SpectrumQT.png',
    name: 'SpectrumQT',
    title: 'Создатель WWMI tooling и XXMI Launcher',
    links: [
      { icon: 'github', link: 'https://github.com/SpectrumQT' },
      { icon: 'gamebanana', link: 'https://gamebanana.com/members/2837527'},
    ]
  },
  {
    avatar: 'https://www.github.com/caverabbit.png',
    name: 'Caverabbit',
    title: 'Создатель RabbitFX',
    links: [
      { icon: 'github', link: 'https://github.com/caverabbit'},
      { icon: 'gamebanana', link: 'https://gamebanana.com/members/2987570'},
    ]
  },
  {
    avatar: 'https://www.github.com/leotorrez.png',
    name: 'leotorrez',
    title: 'Создатель LeoTools',
    links: [
      { icon: 'github', link: 'https://github.com/leotorrez' },
      { icon: 'x', link: 'https://bsky.app/profile/leomods.bsky.social' },
      { icon: 'gamebanana', link: 'https://gamebanana.com/members/2419201'},
    ]
  },
]
const writers = [
  {
    avatar: 'https://www.github.com/cybertron.png',
    name: 'Cybertron',
    title: 'Автор первого гайда по портированию модов в видеоформате',
    links: [
      // { icon: 'github', link: 'https://github.com/caverabbit'},
      { icon: 'x', link: 'https://x.com/cybertron231'},
      { icon: 'gamebanana', link: 'https://gamebanana.com/members/1994459'},
    ]
  },
  {
  avatar: 'https://www.github.com/rayvy.png',
  name: 'Rayvich',
  title: 'Переводил материалы на русский язык',
  links: [
    // { icon: 'github', link: 'https://github.com/rayvy'},
    { icon: 'gamebanana', link: 'https://gamebanana.com/members/2370640'},
  ]
  },
]
</script>
<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      Благодарности этим людям
    </template>
  </VPTeamPageTitle>
  <VPTeamPageSection>
    <template #title>Создатели 3dmigoto</template>
    <template #lead>
      Существование 3DMigoto сделала моддинг возможным. Если бы не эти люди, нас бы тут впринципе и не было бы :3 
    </template>
    <template #members>
      <VPTeamMembers :members="authors" />
    </template>
  </VPTeamPageSection>
  <VPTeamPageSection>
    <template #title>Разработчики инструментария для моддинга</template>
    <template #lead>Благодаря их работе, игры XXMI постоянно обновляются и исправляются.</template>
    <template #members>
      <VPTeamMembers size="small" :members="devs" />
    </template>
  </VPTeamPageSection>
  <VPTeamPageSection>
    <template #title>Руководства и переводы</template>
    <template #lead>Замечательные участники, которые предоставили свои знания в данный проект.</template>
    <template #members>
      <VPTeamMembers size="small" :members="writers" />
    </template>
  </VPTeamPageSection>
</VPTeamPage>
