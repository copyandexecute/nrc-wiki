<!--meta
id: crash-nrcclient-glintcolor-vulkanmod
type: crash
title: Absturz beim Start — Glint-Farben (NRC) vs. VulkanMod
mc: [1.21.11]
loader: [fabric]
mod: nrcclient
status: investigating
tags: [mixin, crash, nrc-own, vulkanmod, glint, incompatible-mod]
signatures:
  - glintcolorizer.GlintColorMixin
  - nrc$modifyGlintColor
  - net.vulkanmod.mixin.render.RenderTypeM
  - nrcclient
severity: crash
solution_summary: Bekannter NRC-Bug — unser Glint-Farben-Feature kollidiert mit VulkanMod. Fix kommt, du musst nichts tun.
workaround: VulkanMod (oder ImmediatelyFast) aus dem Mods-Ordner nehmen, dann startet das Spiel wieder.
-->

## Was ist los?

Beim Start crasht das Spiel. Unser **Glint-Farben-Feature** (`GlintColorMixin`) und
**VulkanMod** wollen dieselbe Render-Methode anfassen — das geht schief, das Spiel
startet nicht.

Das ist **unser Bug** (NRC), nicht deiner. Wir arbeiten an einem Fix.

## 🩹 Solange — so startest du wieder

1. Mods-Ordner öffnen.
2. **VulkanMod** rausnehmen (alternativ **ImmediatelyFast**).
3. Spiel neu starten. ✅

<details>
<summary>📄 Log-Details (für Nerds)</summary>

```
Caused by: org.spongepowered.asm.mixin.throwables.MixinApplyError: Mixin
[nrcclient.mixins.json:glintcolorizer.GlintColorMixin from mod nrcclient] FAILED during APPLY
Caused by: InvalidInjectionException: @At("INVOKE") on
net/minecraft/class_1921::nrc$modifyGlintColor ... cannot inject into
net/minecraft/class_1921::method_60895(...) merged by
net.vulkanmod.mixin.render.RenderTypeM with priority 1000
```
</details>

<details>
<summary>🔧 Intern (NRC)</summary>

Root cause: unser `wrapOperation` auf `RenderType.method_60895` kollidiert mit VulkanMods
`RenderTypeM` (gleiche Priority, gemergte Methode). Fix-Richtung: Injection-Priority/Target
anpassen oder gegen VulkanMod-Merge robust machen. Quelle: `glintcolorizer/GlintColorMixin`.

</details>
