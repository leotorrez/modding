<script setup>
import DefaultTheme from 'vitepress/theme'
import TranslateWidget from './TranslateWidget.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <TranslateWidget />
    </template>
  </Layout>
</template>