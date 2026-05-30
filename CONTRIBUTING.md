# Eintrag hinzufügen

Quelle ist **nur** `entries/`. `wiki/` + `index.json` werden generiert — nie von Hand.

## Schritte

1. Passende Vorlage aus `entries/_templates/` kopieren (`crash.md` oder `guide.md`).
2. Ablegen als einer von beiden Formen — **frei wählbar**:
   - **Einzeldatei** (Default, keine Medien): `entries/<kategorie>/<slug>.md`
   - **Ordner** (mit Bildern/GIFs): `entries/<kategorie>/<slug>/index.md` + Medien
     **direkt daneben**, relativ referenziert: `![Demo](demo.gif)`
3. `<!--meta ... -->`-Block oben ausfüllen (siehe Schema unten).
4. Prosa darunter schreiben (`## Symptom`, `## Ursache`, `## Lösung`, …).
5. Committen & pushen → der Workflow baut das Wiki neu, der Eintrag erscheint
   **automatisch** in der passenden Index-Seite. Keine Liste pflegen.

`<slug>` = kurz, kebab-case, eindeutig (z.B. `sodiumdynamiclights-method18097`).
Kategorie = Ordnername. Neue Kategorie? Einfach neuen Ordner unter `entries/` anlegen.

## Meta-Schema

Der Block steht **ganz oben** in der Datei. GitHub Wiki rendert HTML-Kommentare nicht
→ im Wiki unsichtbar, aber für AI/grep/Generator lesbar.

```markdown
<!--meta
id: crash-sodiumdynamiclights-method18097
type: crash
title: InvalidInjectionException — sodiumdynamiclights mixin
mc: [1.21.11]
loader: [fabric]
mod: sodiumdynamiclights
tags: [mixin, crash, incompatible-mod, sodium]
signatures:
  - InvalidInjectionException
  - sodiumdynamiclights
  - method_18097
severity: crash
solution_summary: Mod entfernen oder auf 1.21.11-kompatible Version updaten.
-->
```

| Feld | Pflicht | Bedeutung |
|---|---|---|
| `id` | empfohlen | eindeutige ID (default `<kategorie>-<slug>`) |
| `type` | ✅ | `crash` \| `guide` \| `faq` |
| `title` | ✅ | Titel der Wiki-Seite (eine Zeile, keine Quotes nötig) |
| `mc` | crash | betroffene MC-Versionen, z.B. `[1.21.11]` (`[]` = alle) |
| `loader` | crash | `fabric` \| `forge` \| `neoforge` \| `quilt` (`[]` = alle) |
| `mod` | optional | betroffener Mod-Slug |
| `tags` | optional | freie Tags |
| `signatures` | crash | **exakte, kurze Substrings aus dem Log** → für Auto-Matching |
| `severity` | optional | `crash` \| `error` \| `warn` \| `info` |
| `keywords` | guide/faq | Suchbegriffe für semantisches Matching |
| `solution_summary` | ✅ | ein Satz Lösung — landet in der Index-Tabelle |

### `signatures` richtig wählen

Mehrere **kurze, eindeutige** Substrings, die fast nur in genau diesem Crash
vorkommen — **keine ganzen Logzeilen** (Pfade/Versionen/Zeitstempel variieren).
Gut: `InvalidInjectionException`, `sodiumdynamiclights`, `method_18097`.
Schlecht: `[12:34:56] [Render thread/ERROR] ...` (zu spezifisch, matcht nie wieder).

## Syntax des Meta-Parsers

Mini-YAML, bewusst simpel:
- `key: wert` — Skalar (Quotes optional).
- `key: [a, b, c]` — Inline-Liste.
- Block-Liste:
  ```
  key:
    - eintrag
    - eintrag
  ```
