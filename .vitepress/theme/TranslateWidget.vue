<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Language {
  code: string
  label: string
}

const LANGUAGES: Language[] = [
  { code: 'en',    label: 'English'    },
  { code: 'zh-CN', label: '简体中文'   },
  { code: 'ja',    label: '日本語'     },
  { code: 'ko',    label: '한국어'     },
  { code: 'ru',    label: 'Русский'   },
  { code: 'es',    label: 'Español'   },
  { code: 'fr',    label: 'Français'  },
  { code: 'de',    label: 'Deutsch'   },
]

const PAGE_LANGUAGE = 'en'

const currentLang = ref(PAGE_LANGUAGE)

function setGoogTransCookie(lang: string) {
  const value = `/auto/${lang}`
  const base = `googtrans=${value}; path=/`
  document.cookie = base
  document.cookie = `${base}; domain=${window.location.hostname}`
}

function getGoogTransCookie(): string | null {
  const match = document.cookie
    .split(';')
    .find(c => c.trim().startsWith('googtrans='))
  if (!match) return null
  return match.split('/').pop() ?? null
}

function handleLanguageChange(event: Event) {
  const lang = (event.target as HTMLSelectElement).value
  setGoogTransCookie(lang)
  window.location.reload()
}

function removeGoogleTranslateBanner() {
  document.querySelector('.goog-te-banner-frame')?.remove()

  if (document.body.style.top) {
    document.body.style.top = '0px'
  }

  document.querySelectorAll<HTMLElement>('iframe[id*=":1.container"]')
    .forEach(el => { el.style.display = 'none' })
}

function initGoogleTranslate() {
  window.googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: PAGE_LANGUAGE,
        includedLanguages: LANGUAGES.map(l => l.code).join(','),
        autoDisplay: false,
      },
      'google_translate_element'
    )
  }

  const script = document.createElement('script')
  script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
  script.async = true
  document.body.appendChild(script)
}

function observeBannerRemoval() {
  const observer = new MutationObserver(removeGoogleTranslateBanner)
  observer.observe(document.body, {
    childList: true,
    attributes: true,
    attributeFilter: ['style', 'class'],
  })
}

onMounted(() => {
  const saved = getGoogTransCookie()
  if (saved && LANGUAGES.some(l => l.code === saved)) {
    currentLang.value = saved
  }

  initGoogleTranslate()
  observeBannerRemoval()
})
</script>

<template>
  <div class="translate-wrapper">
    <div class="icon-container">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
      >
        <path d="m5 8 6 6"/>
        <path d="m4 14 6-8 2-2"/>
        <path d="M2 5h12"/>
        <path d="M7 2h1"/>
        <path d="m22 22-5-10-5 10"/>
        <path d="M14 18h6"/>
      </svg>
    </div>

    <select
      class="custom-select notranslate"
      translate="no"
      :value="currentLang"
      @change="handleLanguageChange"
    >
      <option v-for="lang in LANGUAGES" :key="lang.code" :value="lang.code">
        {{ lang.label }}
      </option>
    </select>

    <div id="google_translate_element" style="display: none;" />
  </div>
</template>

<style>
.translate-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
}

.icon-container {
  display: flex;
  align-items: center;
  color: var(--vp-c-text-1);
}

.custom-select {
  appearance: none;
  background-color: transparent;
  border: none;
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
  padding-right: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right center;
}

.custom-select:focus {
  outline: none;
}

.custom-select option {
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.goog-te-banner-frame.skiptranslate {
  display: none !important;
}

body {
  top: 0px !important;
}

.goog-tooltip,
#goog-gt-tt,
.goog-te-balloon-frame {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

.goog-text-highlight,
.goog-text-highlight:hover {
  background: transparent !important;
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  margin: 0 !important;
  padding: 0 !important;
  position: static !important;
  color: inherit !important;
}

font,
font[style] {
  background: transparent !important;
  background-color: transparent !important;
  box-shadow: none !important;
  color: inherit !important;
  font-family: inherit !important;
  font-size: inherit !important;
  font-weight: inherit !important;
}

#goog-gt-tt {
  display: none !important;
  visibility: hidden !important;
}

@media (max-width: 768px) {
  .translate-wrapper {
    display: none;
  }
}
</style>