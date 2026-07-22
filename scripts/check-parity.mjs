import { readFileSync } from 'node:fs'

function flatten(obj, prefix = '') {
  let keys = []
  for (const k of Object.keys(obj)) {
    const p = prefix ? `${prefix}.${k}` : k
    if (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      keys = keys.concat(flatten(obj[k], p))
    } else {
      keys.push(p)
    }
  }
  return keys
}

const en = JSON.parse(readFileSync('src/i18n/locales/en.json', 'utf8'))
const enKeys = new Set(flatten(en).filter((k) => !k.startsWith('_meta')))

for (const lang of ['ur', 'ps', 'pa']) {
  const path = `src/i18n/locales/${lang}.json`
  let data
  try {
    data = JSON.parse(readFileSync(path, 'utf8'))
  } catch (e) {
    console.log(`${lang}: FILE MISSING OR INVALID (${e.message})`)
    continue
  }
  const langKeys = new Set(flatten(data).filter((k) => !k.startsWith('_meta')))
  const missing = [...enKeys].filter((k) => !langKeys.has(k))
  const extra = [...langKeys].filter((k) => !enKeys.has(k))
  console.log(`\n=== ${lang} ===`)
  console.log(`en keys: ${enKeys.size}, ${lang} keys: ${langKeys.size}`)
  console.log(`missing (${missing.length}):`, missing.slice(0, 40))
  console.log(`extra (${extra.length}):`, extra.slice(0, 40))
}
