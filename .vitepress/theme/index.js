import DefaultTheme from 'vitepress/theme'
import CardGrid from './components/CardGrid.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('CardGrid', CardGrid)
  }
}