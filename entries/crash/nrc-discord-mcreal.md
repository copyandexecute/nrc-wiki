<!--meta
id: crash-nrc-discord-mcreal
type: crash
title: Absturz beim Start — Discord-Modul vermisst McReal-Screen (NRC)
mc: [1.21.11]
loader: [fabric]
mod: nrcclient
status: investigating
tags: [crash, nrc-own, mcreal, discord, noclassdeffound]
signatures:
  - gg.norisk.mcreal.ui.McRealScreen
  - DiscordIntegrationModule.resolveScreenState
severity: crash
solution_summary: Bekannter NRC-Bug — unser Discord-Modul greift auf den McReal-Screen zu, der nicht geladen ist. Fix kommt.
workaround: Aktiviere nrc-mcreal im NoRisk-Pack, dann startet das Spiel wieder.
actions: [enable_norisk_mod:nrc-mcreal]
-->

## Was ist los?

Beim Start crasht das Spiel. Unser **Discord-Modul** (`DiscordIntegrationModule`) will den
**McReal-Screen** anzeigen, aber das **McReal**-Modul ist nicht geladen, also fehlt die Klasse.

Das ist **unser Bug** (NRC), nicht deiner. Wir arbeiten an einem Fix.

## 🩹 Solange — so startest du wieder

1. NoRisk-Pack öffnen.
2. **nrc-mcreal** aktivieren.
3. Spiel neu starten. ✅

<details>
<summary>📄 Log-Details (für Nerds)</summary>

```
java.lang.NoClassDefFoundError: gg/norisk/mcreal/ui/McRealScreen
  at gg.norisk.client.v2.modules.discord.DiscordIntegrationModule.resolveScreenState(DiscordIntegrationModule.kt:152)
Caused by: java.lang.ClassNotFoundException: gg.norisk.mcreal.ui.McRealScreen
```
</details>

<details>
<summary>🔧 Intern (NRC)</summary>

Root cause: `DiscordIntegrationModule.resolveScreenState` referenziert `McRealScreen` hart, ohne
zu prüfen ob das McReal-Modul aktiv ist. Fix-Richtung: Guard/optionale Referenz, oder McReal als
harte Abhängigkeit des Discord-Moduls. Quelle: `DiscordIntegrationModule.kt:152`.

</details>
