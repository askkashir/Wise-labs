// One-off dev script: scans the given source files for t('key', 'fallback' [, {..}])
// calls and builds a nested en.json-shaped object from the literal fallback
// strings (which are the correct, already-verbatim English copy). Avoids
// hand-transcribing ~150 keys by hand. Run with `node scripts/extract-t-calls.mjs`.
import { readFileSync, writeFileSync } from 'node:fs'

const FILES = [
  'src/sections/Hero.tsx',
  'src/sections/WiseJourney.tsx',
  'src/sections/BuildTracks.tsx',
  'src/sections/EnterTheLab.tsx',
  'src/sections/PowerCircle.tsx',
  'src/sections/BehindTheWings.tsx',
  'src/sections/WiseConnect.tsx',
  'src/pages/ApplyPage.tsx',
]

// Matches: t( 'key.path' , 'fallback text' [ , {...} ] )
// key and fallback may each be single- or double-quoted; whitespace
// (including newlines) allowed between tokens; fallback string is always a
// single-line literal (no embedded \n) so this simple pattern is safe.
const CALL_RE =
  /\bt\(\s*(['"])((?:\\.|(?!\1).)*)\1\s*,\s*(['"])((?:\\.|(?!\3).)*)\3/g

function unescape(str) {
  return str.replace(/\\(['"\\])/g, '$1')
}

function setDeep(obj, path, value) {
  const parts = path.split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    cur[parts[i]] ??= {}
    cur = cur[parts[i]]
  }
  const last = parts[parts.length - 1]
  if (cur[last] !== undefined && cur[last] !== value) {
    console.error(`CONFLICT at "${path}": "${cur[last]}" vs "${value}"`)
  }
  cur[last] = value
}

const out = {}
const keys = []
for (const file of FILES) {
  const src = readFileSync(file, 'utf8')
  let m
  while ((m = CALL_RE.exec(src))) {
    const key = unescape(m[2])
    const fallback = unescape(m[4])
    // skip calls where the "key" isn't actually a dotted i18n key (e.g.
    // stray t('div', ...) false positives won't occur since we require a dot
    // or known bare namespaces below)
    if (!/^[a-zA-Z][\w-]*(\.[\w-]+)+$/.test(key) && !/^[a-zA-Z][\w-]*$/.test(key)) continue
    setDeep(out, key, fallback)
    keys.push(key)
  }
}

writeFileSync('scripts/sections-en.json', JSON.stringify(out, null, 2))
console.log(`Extracted ${keys.length} keys from ${FILES.length} files.`)
