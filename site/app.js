// Browser side of the crash checker. Level 1 only: deterministic signature
// matching, no AI. Shares matcher.mjs with the CLI (single source of truth).
import { matchCrash, mcloRawUrl } from './matcher.mjs'

// Wiki base — change owner here when the repo moves to the NoRiskClient org.
const WIKI_BASE = 'https://github.com/copyandexecute/nrc-wiki/wiki'

const out = document.getElementById('out')
const input = document.getElementById('url')
const btn = document.getElementById('go')

let index = []
const ready = fetch('./index.json')
  .then((r) => r.json())
  .then((d) => { index = d })
  .catch(() => { out.innerHTML = `<p class="err">index.json konnte nicht geladen werden.</p>` })

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))

function render(hits) {
  if (!hits.length) {
    out.innerHTML = `<p class="none">Kein bekannter Eintrag gefunden. Wenn der Crash öfter auftritt, bitte melden.</p>`
    return
  }
  out.innerHTML = hits.slice(0, 5).map((r) => {
    const e = r.entry
    return `<div class="card">
      <h2><a href="${WIKI_BASE}/${esc(e.page)}" target="_blank" rel="noopener">${esc(e.title)}</a></h2>
      ${e.solution_summary ? `<div class="sol">${esc(e.solution_summary)}</div>` : ''}
      <div class="meta">match: ${esc(r.matched.join(', '))}</div>
    </div>`
  }).join('')
}

document.getElementById('f').addEventListener('submit', async (ev) => {
  ev.preventDefault()
  const raw = mcloRawUrl(input.value.trim())
  if (!raw) {
    out.innerHTML = `<p class="err">Bitte einen gültigen mclo.gs-Link einfügen.</p>`
    return
  }
  btn.disabled = true
  out.innerHTML = `<p class="none">Lade Log…</p>`
  try {
    await ready
    const log = await fetch(raw).then((r) => r.text())
    render(matchCrash(log, index))
  } catch (e) {
    out.innerHTML = `<p class="err">Log konnte nicht geladen werden.</p>`
  } finally {
    btn.disabled = false
  }
})
