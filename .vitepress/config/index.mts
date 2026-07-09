import { defineConfig } from 'vitepress'
import { shared } from './shared'
import { en } from './en'
import { zh } from './zh'
import { ru } from './ru'
import { es } from './es'

export default defineConfig({
  ...shared,
  locales: {
    root: { label: 'English', ...en }
  }
})