#!/usr/bin/env node
// Generator: entries/ -> wiki/ (GitHub Wiki pages) + index.json (machine lookup).
// Zero dependencies. Run: node scripts/build-wiki.mjs
//
// Source of truth = entries/<category>/...   (NEVER edit wiki/ by hand)
//   - single file : entries/<cat>/<slug>.md
//   - folder       : entries/<cat>/<slug>/index.md  (+ media files next to it)
// Each entry starts with a hidden metadata block:  <!--meta ... -->
// GitHub Wiki does not render HTML comments, so the block is invisible to humans
// but readable for grep / AI / this generator.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ENTRIES = path.join(ROOT, 'entries')
const WIKI = path.join(ROOT, 'wiki')
const INDEX_JSON = path.join(ROOT, 'index.json')

const REPO_URL = 'https://github.com/NoRiskClient/nrc-wiki'
const DISCORD_URL = 'https://discord.gg/noriskclient'

// --- category presentation (unknown categories degrade gracefully) ---------
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const CAT_META = {
  crash: { index: 'Crashes', prefix: 'Crash', label: 'Crashes', emoji: '💥' },
  guide: { index: 'Guides', prefix: 'Guide', label: 'Guides', emoji: '📖' },
  faq: { index: 'FAQ', prefix: 'FAQ', label: 'FAQ', emoji: '❓' },
}
const catMeta = (cat) =>
  CAT_META[cat] ?? { index: cap(cat) + 's', prefix: cap(cat), label: cap(cat) + 's', emoji: '📄' }

// --- tiny YAML-ish parser for the meta block --------------------------------
// Supports: `key: scalar`, `key: [a, b]`, and block lists:
//   key:
//     - item
//     - item
function parseMeta(raw) {
  const meta = {}
  let curKey = null
  const unquote = (v) => v.replace(/^["']|["']$/g, '').trim()
  for (const rawLine of raw.split('\n')) {
    const line = rawLine.replace(/\s+$/, '')
    if (!line.trim()) continue
    const listItem = line.match(/^\s*-\s+(.*)$/)
    if (listItem && curKey) {
      if (!Array.isArray(meta[curKey])) meta[curKey] = []
      meta[curKey].push(unquote(listItem[1]))
      continue
    }
    const kv = line.match(/^([A-Za-z_][\w]*):\s*(.*)$/)
    if (!kv) continue
    const key = kv[1]
    const rest = kv[2].trim()
    curKey = key
    if (rest === '') {
      meta[key] = [] // expect block list to follow
    } else if (rest.startsWith('[')) {
      meta[key] = rest
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((s) => unquote(s))
        .filter((s) => s !== '')
    } else {
      meta[key] = unquote(rest)
    }
  }
  return meta
}

function extractMeta(md) {
  const m = md.match(/<!--meta\s*([\s\S]*?)-->/)
  return m ? parseMeta(m[1]) : {}
}

// --- fs helpers -------------------------------------------------------------
const rmrf = (p) => fs.rmSync(p, { recursive: true, force: true })
const mkdirp = (p) => fs.mkdirSync(p, { recursive: true })
const MEDIA_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'])

// --- collect entries --------------------------------------------------------
function collectEntries() {
  const out = []
  if (!fs.existsSync(ENTRIES)) return out
  for (const cat of fs.readdirSync(ENTRIES)) {
    if (cat.startsWith('_') || cat.startsWith('.')) continue
    const catDir = path.join(ENTRIES, cat)
    if (!fs.statSync(catDir).isDirectory()) continue
    for (const child of fs.readdirSync(catDir)) {
      if (child.startsWith('_') || child.startsWith('.')) continue
      const childPath = path.join(catDir, child)
      const stat = fs.statSync(childPath)
      let slug, mdPath, mediaFiles = []
      if (stat.isDirectory()) {
        slug = child
        mdPath = path.join(childPath, 'index.md')
        if (!fs.existsSync(mdPath)) {
          console.warn(`! skip ${cat}/${child}: no index.md`)
          continue
        }
        mediaFiles = fs
          .readdirSync(childPath)
          .filter((f) => MEDIA_EXT.has(path.extname(f).toLowerCase()))
          .map((f) => ({ name: f, abs: path.join(childPath, f) }))
      } else if (child.endsWith('.md')) {
        slug = child.replace(/\.md$/, '')
        mdPath = childPath
      } else {
        continue
      }
      const md = fs.readFileSync(mdPath, 'utf8')
      const meta = extractMeta(md)
      const cm = catMeta(cat)
      out.push({
        category: cat,
        slug,
        meta,
        body: md,
        mediaFiles,
        page: `${cm.prefix}-${slug}`,
        source: path.relative(ROOT, mdPath).replace(/\\/g, '/'),
      })
    }
  }
  return out
}

// --- render one wiki page ---------------------------------------------------
function renderPage(e) {
  const cm = catMeta(e.category)
  let body = e.body

  // rewrite relative media links -> wiki/media/<slug>/<file>
  for (const mf of e.mediaFiles) {
    const safe = mf.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    body = body.replace(
      new RegExp(`\\]\\(\\.?/?${safe}\\)`, 'g'),
      `](media/${e.slug}/${mf.name})`,
    )
  }

  const title = e.meta.title || e.slug
  const breadcrumb = `[🏠 Home](Home) · [${cm.emoji} ${cm.label}](${cm.index})`
  const footer = [
    '',
    '---',
    `${breadcrumb} · [✏️ Quelle](${REPO_URL}/blob/main/${e.source})`,
  ].join('\n')

  // meta block stays at the very top (invisible in rendered wiki),
  // breadcrumb + title heading follow.
  const metaMatch = body.match(/<!--meta[\s\S]*?-->/)
  const metaBlock = metaMatch ? metaMatch[0] : ''
  const rest = metaMatch ? body.slice(metaMatch.index + metaBlock.length).trimStart() : body.trimStart()
  const hasH1 = /^#\s/.test(rest)

  // Crash pages lead with a big, kid-proof banner. Solved → green fix; known/
  // in-progress → "we're on it" + optional workaround. Auto from meta.
  let fix = ''
  if (e.category === 'crash') {
    const status = e.meta.status || 'solved'
    if (status === 'investigating' || status === 'known') {
      fix = `> ## 🔧 Bekanntes Problem — wir arbeiten an einem Fix\n> **${e.meta.solution_summary || 'Wir kennen den Bug. Du musst nichts tun.'}**\n`
      if (e.meta.workaround) fix += `>\n> 🩹 **Solange als Workaround:** ${e.meta.workaround}\n`
    } else if (e.meta.solution_summary) {
      fix = `> ## ✅ Lösung\n> **${e.meta.solution_summary}**\n`
    }
  }

  return [
    metaBlock,
    breadcrumb,
    '',
    hasH1 ? '' : `# ${title}`,
    '',
    fix,
    rest,
    footer,
    '',
  ].join('\n')
}

// --- render index page per category -----------------------------------------
function renderIndex(cat, items) {
  const cm = catMeta(cat)
  const lines = [`# ${cm.emoji} ${cm.label}`, '', `[🏠 Home](Home)`, '']
  if (!items.length) {
    lines.push('_Noch keine Einträge._', '')
    return lines.join('\n')
  }
  const fmtArr = (v) => (Array.isArray(v) ? v.join(', ') : v || '–')
  if (cat === 'crash') {
    lines.push('| Status | Problem | MC | Loader | Lösung / Hinweis |', '|---|---|---|---|---|')
    for (const e of items) {
      const st = (e.meta.status || 'solved') === 'solved' ? '✅' : '🔧'
      lines.push(
        `| ${st} | [${e.meta.title || e.slug}](${e.page}) | ${fmtArr(e.meta.mc)} | ${fmtArr(e.meta.loader)} | ${e.meta.solution_summary || '–'} |`,
      )
    }
  } else {
    lines.push('| Thema | Beschreibung |', '|---|---|')
    for (const e of items) {
      lines.push(`| [${e.meta.title || e.slug}](${e.page}) | ${e.meta.solution_summary || ''} |`)
    }
  }
  lines.push('')
  return lines.join('\n')
}

// --- main -------------------------------------------------------------------
function build() {
  const entries = collectEntries()
  rmrf(WIKI)
  mkdirp(WIKI)
  mkdirp(path.join(WIKI, 'media'))

  // group by category
  const byCat = {}
  for (const e of entries) (byCat[e.category] ??= []).push(e)
  for (const cat of Object.keys(byCat))
    byCat[cat].sort((a, b) => (a.meta.title || a.slug).localeCompare(b.meta.title || b.slug))

  // entry pages + media
  for (const e of entries) {
    fs.writeFileSync(path.join(WIKI, `${e.page}.md`), renderPage(e), 'utf8')
    if (e.mediaFiles.length) {
      const dst = path.join(WIKI, 'media', e.slug)
      mkdirp(dst)
      for (const mf of e.mediaFiles) fs.copyFileSync(mf.abs, path.join(dst, mf.name))
    }
  }

  // category index pages
  const cats = Object.keys(byCat).sort()
  for (const cat of cats)
    fs.writeFileSync(path.join(WIKI, `${catMeta(cat).index}.md`), renderIndex(cat, byCat[cat]), 'utf8')

  // Home
  const homeLines = [
    '# 🛟 NoRiskClient — Wiki & Troubleshooting',
    '',
    'Lösungen für Crashes, Anleitungen und häufige Fragen rund um **NoRiskClient**.',
    '',
    '> 🔎 **Suchen:** Volltextsuche oben rechts, oder eine Kategorie unten wählen.',
    '',
    '## Kategorien',
    '',
  ]
  for (const cat of cats) {
    const cm = catMeta(cat)
    homeLines.push(`- ${cm.emoji} **[${cm.label}](${cm.index})** — ${byCat[cat].length} Einträge`)
  }
  homeLines.push(
    '',
    '---',
    '',
    `Eintrag hinzufügen? → [CONTRIBUTING](${REPO_URL}/blob/main/CONTRIBUTING.md)`,
    '',
  )
  fs.writeFileSync(path.join(WIKI, 'Home.md'), homeLines.join('\n'), 'utf8')

  // _Sidebar
  const sidebar = ['### 🛟 NRC Wiki', '', '**[🏠 Home](Home)**', '']
  for (const cat of cats) {
    const cm = catMeta(cat)
    sidebar.push(`**[${cm.emoji} ${cm.label}](${cm.index})**`)
  }
  sidebar.push('', '---', '', `[📦 Repo](${REPO_URL})`, `[💬 Discord](${DISCORD_URL})`, '')
  fs.writeFileSync(path.join(WIKI, '_Sidebar.md'), sidebar.join('\n'), 'utf8')

  // _Footer
  fs.writeFileSync(
    path.join(WIKI, '_Footer.md'),
    `[🏠 Home](Home) · [📦 Repo](${REPO_URL}) · [💬 Discord](${DISCORD_URL})\n`,
    'utf8',
  )

  // index.json (machine lookup for future AI search)
  const index = entries.map((e) => ({
    id: e.meta.id || `${e.category}-${e.slug}`,
    type: e.meta.type || e.category,
    category: e.category,
    slug: e.slug,
    title: e.meta.title || e.slug,
    page: e.page,
    source: e.source,
    mc: e.meta.mc ?? [],
    loader: e.meta.loader ?? [],
    mod: e.meta.mod ?? null,
    tags: e.meta.tags ?? [],
    status: e.meta.status ?? 'solved',
    severity: e.meta.severity ?? null,
    keywords: e.meta.keywords ?? [],
    signatures: e.meta.signatures ?? [],
    solution_summary: e.meta.solution_summary ?? '',
  }))
  fs.writeFileSync(INDEX_JSON, JSON.stringify(index, null, 2) + '\n', 'utf8')

  console.log(
    `✓ built ${entries.length} entries → wiki/ (${cats.length} categories) + index.json`,
  )
}

build()
