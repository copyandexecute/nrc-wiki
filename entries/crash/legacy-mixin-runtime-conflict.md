<!--meta
id: crash-legacy-mixin-runtime-conflict
type: crash
title: Absturz beim Start (1.8.9/1.7.10) — Mixin-Runtime-Konflikt, NRC-Mixins greifen nicht
mc: [1.8.9, 1.7.10]
loader: [forge]
mod: nrcclient
status: investigating
tags: [crash, nrc-own, mixin, legacy, forge]
signatures:
  - Scanned 0 target(s)
  - IMixinService.getLogger
severity: crash
solution_summary: Bekannter NRC-Bug auf Legacy (1.8.9/1.7.10) — eine ältere Mixin-Lib stört. Fix kommt.
workaround: Mod entfernen die eine alte Mixin-Version mitbringt (oft alte Sk1er/Essential-artige Mods).
-->

## Was ist los?

Spiel crasht beim Start auf **1.8.9 / 1.7.10**. Unsere Mixins (`NameTagRenderMixin`,
`HitBoxEntityRenderDispatcherMixin`) melden `Scanned 0 target(s)` und eine
`NoSuchMethodError: …IMixinService.getLogger`.

Ursache: eine **andere, ältere Mixin-Lib** auf dem Classpath gewinnt → unsere Mixins
finden ihre Ziele nicht mehr. Unser Bootstrap soll das verhindern, schafft's hier nicht.
Das ist **unser Bug** (NRC).

## 🩹 Solange — Workaround

Die Mod finden+entfernen, die eine veraltete Mixin-Version mitbringt (oft ältere
1.8.9-Mods). Dann greifen unsere Mixins wieder.

<details>
<summary>📄 Log-Details (für Nerds)</summary>

```
… failed injection check, (0/1) succeeded. Scanned 0 target(s).
   Using refmap nrccompat.refmap.json / nrcclient.refmap.json
Caused by: java.lang.NoSuchMethodError:
   org.spongepowered.asm.service.IMixinService.getLogger(...)
```
</details>

<details>
<summary>🔧 Intern (NRC)</summary>

Fremde alte Mixin-Runtime (kein `getLogger`) gewinnt auf dem Classpath → ALLE unsere
Mixins scannen 0 Targets. `NrcRelaunch` (nrc-mixin-bootstrap) dedupliziert die Runtime
nicht zuverlässig (`already relaunched – skipping`, crasht dann trotzdem). Fix: Mixin-Runtime
erzwingen / korrekt relaunchen.

</details>
