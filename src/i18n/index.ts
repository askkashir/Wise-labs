import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ur from './locales/ur.json'
import ps from './locales/ps.json'
import pa from './locales/pa.json'

export const SUPPORTED_LANGUAGES = ['en', 'ur', 'ps', 'pa'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const RTL_LANGUAGES: SupportedLanguage[] = ['ur', 'ps', 'pa']

export function isRtl(lang: string): boolean {
  return RTL_LANGUAGES.includes(lang as SupportedLanguage)
}

const STORAGE_KEY = 'wiselab:lang'

function detectInitialLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored && (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)) {
    return stored as SupportedLanguage
  }
  return 'en'
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ur: { translation: ur },
    ps: { translation: ps },
    pa: { translation: pa },
  },
  lng: detectInitialLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

/** Keeps <html lang>/<html dir> and localStorage in sync with the active i18n language. */
export function applyLanguageToDocument(lang: string) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = lang
  document.documentElement.dir = isRtl(lang) ? 'rtl' : 'ltr'
  window.localStorage.setItem(STORAGE_KEY, lang)
}

applyLanguageToDocument(i18n.language)
i18n.on('languageChanged', applyLanguageToDocument)

export default i18n
