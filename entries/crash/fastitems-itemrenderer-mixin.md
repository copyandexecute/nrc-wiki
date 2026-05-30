<!--meta
id: crash-fastitems-itemrenderer-mixin
type: crash
title: Absturz beim Start — Mod „fastitems" passt nicht zu 1.21.11
mc: [1.21.11]
loader: [fabric]
mod: fastitems
tags: [crash, incompatible-mod, mixin, fabric]
signatures:
  - fastitems
  - ItemRendererMixin
  - method_23179
severity: crash
solution_summary: Lösche oder update die Mod „fastitems".
-->

## 🛠️ So reparierst du es

1. Mods-Ordner öffnen.
2. **`fastitems`** löschen (oder auf eine 1.21.11-Version updaten). 🗑️
3. Spiel neu starten. ✅

<details>
<summary>❓ Warum ist das passiert?</summary>

**fastitems** wurde für eine ältere Minecraft-Version gebaut. Sein Mixin
`ItemRendererMixin` will eine Methode anfassen (`getRenderType` →
`class_918::method_23179`), die es in **1.21.11** so nicht mehr gibt → Crash.

</details>

<details>
<summary>📄 Log-Details (für Nerds)</summary>

```
The mod 'fastitems' has a fatal error.
InvalidInjectionException: @Inject on getRenderType could not find any targets matching
   'Lnet/minecraft/class_918;method_23179(…)' — fastitems.mixins.json:ItemRendererMixin
```
</details>
