# 🛟 NRC Wiki

Öffentliche Knowledge-Base für **NoRiskClient** — Crashes, Anleitungen und häufige Fragen.
Jedes gelöste Problem wird **einmal** dokumentiert: menschenlesbar im Wiki **und**
maschinenlesbar, damit eine AI bei einem gemeldeten Log/Frage automatisch Problem +
Lösung findet.

## 📖 → [Zum Wiki](https://github.com/NoRiskClient/nrc-wiki/wiki)

## So funktioniert's

```
nrc-wiki/
├── entries/              ← QUELLE — hier werden Einträge geschrieben
│   ├── crash/            ← Crash-Logs + Lösungen
│   ├── guide/            ← Anleitungen / How-To
│   ├── faq/              ← häufige Fragen
│   └── _templates/       ← Vorlagen zum Kopieren
├── scripts/
│   └── build-wiki.mjs    ← Generator: entries/ → wiki/ + index.json
├── wiki/                 ← GENERIERT (nicht editieren, gitignored)
├── index.json            ← GENERIERT — Maschinen-Index für AI-Lookup
└── .github/workflows/
    └── publish.yml       ← baut wiki/ + spiegelt es ins GitHub Wiki
```

- **Quelle ist allein `entries/`.** `wiki/` und `index.json` werden vom Generator
  erzeugt — niemals von Hand bearbeiten.
- Bei jedem Push auf `main` läuft `publish.yml`: baut `wiki/` neu und pusht es ins
  `<repo>.wiki.git`. Index-Seiten (Crashes/Guides/FAQ) entstehen **automatisch** aus
  den Einträgen — keine Liste pflegen.

## Eintrag hinzufügen

Siehe **[CONTRIBUTING.md](CONTRIBUTING.md)**. Kurz:

1. Vorlage aus `entries/_templates/` kopieren.
2. Als `entries/<kategorie>/<slug>.md` ablegen (oder `entries/<kategorie>/<slug>/index.md`
   + Medien daneben, wenn Bilder/GIFs dazu).
3. Meta-Block ausfüllen, committen → erscheint automatisch im Wiki.

## Lokal bauen

```bash
node scripts/build-wiki.mjs   # erzeugt wiki/ + index.json
```

## Einmaliges Setup (GitHub)

Damit `publish.yml` pushen kann, muss das **Wiki im Repo aktiviert** und mit einer
ersten Seite initialisiert sein (Repo → Settings → Features → Wikis, dann eine
beliebige Wiki-Seite anlegen/speichern). Danach übernimmt der Workflow.
