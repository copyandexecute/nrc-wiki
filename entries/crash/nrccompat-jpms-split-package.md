<!--meta
id: crash-nrccompat-jpms-split-package
type: crash
title: Absturz beim Start — nrccompat Paket-Konflikt (ResolutionException)
mc: [1.20.1]
loader: [forge]
mod: nrccompat
status: investigating
tags: [crash, nrc-own, jpms, module, mixinextras, kotlinforforge, packaging]
signatures:
  - ResolutionException
  - nrccompat
  - exports package
severity: crash
solution_summary: Bekannter NRC-Bug — unser nrccompat-Modul kollidiert mit anderen Modulen. Fix kommt, du musst nichts tun.
workaround: Tritt v.a. mit KotlinForForge oder einer extra MixinExtras-Mod auf — diese Mod testweise entfernen. Sonst auf Fix warten.
-->

## Was ist los?

Das Spiel startet nicht, Fehler `java.lang.module.ResolutionException: Modules nrccompat
and … export package …`. Unser **nrccompat**-Modul bringt Pakete mit, die ein anderes
Modul (meist **MixinExtras** oder **KotlinForForge**) auch hat → die JVM verweigert den Start.

Das ist **unser Packaging-Bug** (NRC), nicht deiner. Fix ist in Arbeit.

## 🩹 Solange — Workaround

Der Konflikt entsteht zusammen mit einer Mod die dieselben Pakete liefert (oft
**KotlinForForge** oder eine separate **MixinExtras**-Mod). Diese Mod testweise raus →
oft startet's dann. Ansonsten auf den Fix warten.

<details>
<summary>📄 Log-Details (für Nerds)</summary>

```
java.lang.module.ResolutionException: Modules nrccompat and MixinExtras export
package com.llamalad7.mixinextras.ap to module …
# oder:
Modules nrccompat and thedarkcolour.kotlinforforge export package kotlinx.coroutines.* …
```
</details>

<details>
<summary>🔧 Intern (NRC)</summary>

`nrccompat`-Jar exportiert/relocatet `com.llamalad7.mixinextras.*`, `kotlinx.coroutines.*`,
`brigadier`, Kotlin-Coroutines (`_CORO…`) un-isoliert → Split-Package auf dem JPMS-Modulpfad
(Forge ModLauncher). Fix-Richtung: diese Pakete im Jar **nicht** exportieren / sauber
relocaten. Häufigster Crash im Log-Sample (~140 Reports, v.a. Forge 1.20.1).

</details>
