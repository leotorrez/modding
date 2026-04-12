import DefaultTheme from 'vitepress/theme'
import CardGrid from './components/CardGrid.vue'
import Layout from './Layout.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('CardGrid', CardGrid)
  }
}