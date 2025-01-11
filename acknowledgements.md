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
    title: 'Creator of 3dmigoto',
    links: [
      // { icon: 'github', link: 'https://github.com/Chiri' }
    ]
  },
  {
    avatar: 'https://github.com/bo3b.png',
    name: 'bo3b',
    title: 'Main mantainer of 3dmigoto',
    links: [
      { icon: 'github', link: 'https://github.com/bo3b' }
    ]
  },
  {
    avatar: 'https://github.com/DarkStarSword.png',
    name: 'DarkStarSword',
    title: 'Main mantainer of 3dmigoto',
    links: [
      { icon: 'github', link: 'https://github.com/DarkStarSword' }
    ]
  },
]
const devs = [
  {
    avatar: 'https://www.github.com/SilentNightSound.png',
    name: 'SilentNightSound',
    title: 'Author of GIMI',
    links: [
      { icon: 'github', link: 'https://github.com/silentnightsound' },
      { icon: 'gamebanana', link: 'https://gamebanana.com/members/2176153'},
    ]
  },
  {
    avatar: 'https://www.github.com/SinsofSeven.png',
    name: 'SinsofSeven',
    title: 'Author of TexFx',
    links: [
      { icon: 'github', link: 'https://github.com/sinsofseven' },
      { icon: 'gamebanana', link: 'https://gamebanana.com/members/2823441'},
    ]
  },
  {
    avatar: 'https://www.github.com/Petrascyll.png',
    name: 'Scyll',
    title: 'Author of GUI Collect',
    links: [
      { icon: 'github', link: 'https://github.com/petrascyll' },
      { icon: 'gamebanana', link: 'https://gamebanana.com/members/2644630'},
    ]
  },
  {
    avatar: 'https://www.github.com/Seris0.png',
    name: 'Gustav0',
    title: 'Author of XXMI advanced tooling',
    links: [
      { icon: 'github', link: 'https://github.com/Seris0' },
      { icon: 'gamebanana', link: 'https://gamebanana.com/members/2890460'},
    ]
  },
  {
    avatar: 'https://www.github.com/SpectrumQT.png',
    name: 'SpectrumQT',
    title: 'Author of WWMI tooling and XXMI Launcher',
    links: [
      { icon: 'github', link: 'https://github.com/SpectrumQT' },
      { icon: 'gamebanana', link: 'https://gamebanana.com/members/2837527'},
    ]
  },
  {
    avatar: 'https://www.github.com/caverabbit.png',
    name: 'Caverabbit',
    title: 'Author of RabbitFX',
    links: [
      { icon: 'github', link: 'https://github.com/caverabbit'},
      { icon: 'gamebanana', link: 'https://gamebanana.com/members/2987570'},
    ]
  },
  {
    avatar: 'https://www.github.com/leotorrez.png',
    name: 'leotorrez',
    title: 'Author of LeoTools',
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
    title: 'Author of the 1st porting guide in video format',
    links: [
      // { icon: 'github', link: 'https://github.com/caverabbit'},
      { icon: 'x', link: 'https://x.com/cybertron231'},
      { icon: 'gamebanana', link: 'https://gamebanana.com/members/1994459'},
    ]
  },
  {
  avatar: 'https://www.github.com/rayvich.png',
  name: 'Rayvich',
  title: 'Russian Translator',
  links: [
    // { icon: 'github', link: 'https://github.com/rayvich'},
    { icon: 'gamebanana', link: 'https://gamebanana.com/members/2370640'},
  ]
  },
  {
  avatar: 'https://anilyan.carrd.co/assets/images/image03.jpg?v=50db0d5a',
  name: 'Anilyan',
  title: 'Guide writer',
  links: [
    { icon: 'instagram', link: 'https://anilyan.carrd.co'},
    { icon: 'discord', link: 'https://discord.com/invite/HcgvjWFCaG'},
  ]
  },
  {
  avatar: 'https://github.com/Satan1c.png',
  name: 'Satan1c',
  title: 'Guide writer',
  links: [
    { icon: 'github', link: 'https://github.com/Satan1c'},
  ]
  },
]
</script>
<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      Acknowledgements
    </template>
  </VPTeamPageTitle>
  <VPTeamPageSection>
    <template #title>3dmigoto Author's</template>
    <template #lead>
      The development of 3dmigoto made modding possible without the help of these people we wouldn't be here.
    </template>
    <template #members>
      <VPTeamMembers :members="authors" />
    </template>
  </VPTeamPageSection>
  <VPTeamPageSection>
    <template #title>Tool devs</template>
    <template #lead>Their work keeps the XXMI games with constant updates and fixes.</template>
    <template #members>
      <VPTeamMembers size="small" :members="devs" />
    </template>
  </VPTeamPageSection>
  <VPTeamPageSection>
    <template #title>Tutorial writers</template>
    <template #lead>Wonderful contributors that granted their knowledge to be added to this repository</template>
    <template #members>
      <VPTeamMembers size="small" :members="writers" />
    </template>
  </VPTeamPageSection>
</VPTeamPage>
