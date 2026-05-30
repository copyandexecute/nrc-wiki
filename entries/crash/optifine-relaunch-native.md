<!--meta
id: crash-optifine-relaunch-native
type: crash
title: Absturz beim Start (1.8.9) — OptiFine + Relaunch (lwjgl already loaded)
mc: [1.8.9]
loader: [forge]
mod: nrcclient
status: investigating
tags: [crash, nrc-own, optifine, native, lwjgl, legacy]
signatures:
  - lwjgl64.dll already loaded in another classloader
  - optifine.reflect.Reflector
severity: crash
solution_summary: Bekannter NRC-Bug — unser Relaunch verträgt sich mit OptiFine nicht. Fix kommt.
workaround: OptiFine rausnehmen, dann startet das Spiel wieder.
-->

## Was ist los?

Spiel crasht beim Start auf **1.8.9** mit OptiFine. Fehler `UnsatisfiedLinkError: Native
Library …lwjgl64.dll already loaded in another classloader` (+ OptiFine `Reflector`).

Unser **Relaunch** (nrc-mixin-bootstrap) startet in einem zweiten Classloader — die
LWJGL-Native ist da schon geladen → Crash. Das ist **unser Bug** (NRC).

## 🩹 Solange — Workaround

**OptiFine** aus dem Mods-Ordner nehmen → Spiel startet wieder. (Auf Fix warten wenn du
OptiFine brauchst.)

<details>
<summary>📄 Log-Details (für Nerds)</summary>

```
Caused by: java.lang.NoClassDefFoundError: Could not initialize class net.optifine.reflect.Reflector
Caused by: java.lang.UnsatisfiedLinkError: Native Library …\natives\1.8.9\lwjgl64.dll
   already loaded in another classloader
relaunch failed – falling back to in-process bootstrap
```
</details>

<details>
<summary>🔧 Intern (NRC)</summary>

Relaunch → 2. Classloader lädt LWJGL-Native erneut → `UnsatisfiedLinkError`. Fix: Relaunch
überspringen wenn Natives/OptiFine bereits geladen, oder Native-Reuse.

</details>
