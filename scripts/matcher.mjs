// Pure matching logic — NO node-only imports, so it runs in Node (CLI) AND in the
// browser (GitHub Pages). Retrieval is deterministic: $0, no AI, no embeddings.

const STOPWORDS = new Set([
  'how', 'do', 'i', 'is', 'the', 'a', 'an', 'my', 'to', 'of', 'in', 'on', 'and', 'or',
  'wie', 'ich', 'das', 'die', 'der', 'ein', 'eine', 'und', 'oder', 'zu', 'im', 'man',
  'mein', 'meine', 'ist', 'es', 'bei', 'mit', 'kann', 'was', 'wo',
])

export function tokenize(s) {
  return (s || '')
    .toLowerCase()
    .split(/[^a-z0-9äöüß]+/i)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
}

// Is this blob a crash log (vs a freeform question)?
export function detectKind(text) {
  const t = text || ''
  const looksCrash =
    /\b(exception|caused by|crash(ed)?|stacktrace|mixin|at [\w.$]+\()/i.test(t)
  return looksCrash && t.length > 120 ? 'crash' : 'query'
}

// Tier 0 — crash: count how many of an entry's signatures appear in the log.
export function matchCrash(logText, index) {
  const log = (logText || '').toLowerCase()
  const hits = []
  for (const e of index) {
    const sigs = e.signatures || []
    if (!sigs.length) continue
    const matched = sigs.filter((s) => log.includes(String(s).toLowerCase()))
    if (!matched.length) continue
    const score = matched.length / sigs.length
    if (matched.length >= 2 || score >= 0.6) hits.push({ entry: e, score, matched })
  }
  return hits.sort((a, b) => b.matched.length - a.matched.length || b.score - a.score)
}

// Tier 1 — question: lexical overlap against keywords / title / tags.
export function matchQuery(query, index) {
  const qTokens = tokenize(query)
  if (!qTokens.length) return []
  const hits = []
  for (const e of index) {
    const kw = new Set((e.keywords || []).flatMap(tokenize))
    const ti = new Set(tokenize(e.title))
    const tg = new Set((e.tags || []).flatMap(tokenize))
    let score = 0
    const matched = []
    for (const q of qTokens) {
      if (kw.has(q)) { score += 2; matched.push(q) }
      else if (ti.has(q)) { score += 1.5; matched.push(q) }
      else if (tg.has(q)) { score += 1; matched.push(q) }
    }
    if (score > 0) hits.push({ entry: e, score: score / qTokens.length, matched })
  }
  return hits.sort((a, b) => b.score - a.score)
}

// Unified entry point. Returns ranked results either way.
export function runMatch(text, index) {
  const kind = detectKind(text)
  const results = kind === 'crash' ? matchCrash(text, index) : matchQuery(text, index)
  return { kind, results }
}

// mclo.gs URL -> raw-log API url. Returns null if not a paste link.
export function mcloRawUrl(input) {
  const m = String(input).match(/(?:mclo\.gs|paste\.mclo\.gs|api\.mclo\.gs\/1\/raw)\/([\w-]+)/)
  return m ? `https://api.mclo.gs/1/raw/${m[1]}` : null
}
