import { readFileSync, writeFileSync } from 'node:fs'

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      target[key] = deepMerge(target[key] && typeof target[key] === 'object' ? target[key] : {}, source[key])
    } else {
      if (target[key] !== undefined && target[key] !== source[key]) {
        console.error(`CONFLICT merging "${key}": existing="${target[key]}" incoming="${source[key]}"`)
      }
      target[key] = source[key]
    }
  }
  return target
}

const en = JSON.parse(readFileSync('src/i18n/locales/en.json', 'utf8'))
const sections = JSON.parse(readFileSync('scripts/sections-en.json', 'utf8'))
const forms = JSON.parse(readFileSync('scripts/forms-en.json', 'utf8'))

deepMerge(en, sections)
en.forms = deepMerge(en.forms ?? {}, forms)

// stable key order: keep insertion order as merged (good enough; JSON.stringify preserves it)
writeFileSync('src/i18n/locales/en.json', JSON.stringify(en, null, 2) + '\n')
console.log('Merged. Top-level keys:', Object.keys(en))
