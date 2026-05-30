#!/usr/bin/env node
// CLI: match a crash log / question against the wiki index.
//
//   node scripts/match.mjs https://mclo.gs/ZV4rbba      # mclo.gs paste link
//   node scripts/match.mjs ./crash.txt                  # local log file
//   node scripts/match.mjs "wie öffne ich das rshift menü"
//   cat crash.log | node scripts/match.mjs              # piped stdin
//
// Pure retrieval, $0, no AI. Reads index.json (run build-wiki.mjs first).

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { runMatch, mcloRawUrl } from './matcher.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const WIKI_URL = 'https://github.com/NoRiskClient/nrc-wiki/wiki'

async function readInput(arg) {
  if (!arg) {
    return fs.readFileSync(0, 'utf8') // stdin
  }
  const raw = mcloRawUrl(arg)
  if (raw) {
    const res = await fetch(raw)
    if (!res.ok) throw new Error(`mclo.gs fetch failed: ${res.status}`)
    return res.text()
  }
  if (fs.existsSync(arg)) return fs.readFileSync(arg, 'utf8')
  return arg // treat as literal question/text
}

function loadIndex() {
  const p = path.join(ROOT, 'index.json')
  if (!fs.existsSync(p)) {
    console.error('index.json missing — run: node scripts/build-wiki.mjs')
    process.exit(1)
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

const arg = process.argv[2]
const text = await readInput(arg)
const index = loadIndex()
const { kind, results } = runMatch(text, index)

if (process.env.JSON) {
  console.log(JSON.stringify({ kind, results }, null, 2))
} else if (!results.length) {
  console.log(`\n[${kind}] Kein bekannter Eintrag gefunden.\n`)
} else {
  console.log(`\n[${kind}] ${results.length} Treffer:\n`)
  for (const r of results.slice(0, 5)) {
    const e = r.entry
    console.log(`  ● ${e.title}  (score ${r.score.toFixed(2)})`)
    console.log(`    → ${WIKI_URL}/${e.page}`)
    if (e.solution_summary) console.log(`    Lösung: ${e.solution_summary}`)
    console.log(`    matched: ${r.matched.join(', ')}\n`)
  }
}
