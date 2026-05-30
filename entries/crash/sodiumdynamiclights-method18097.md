<!--meta
id: crash-sodiumdynamiclights-method18097
type: crash
title: Absturz beim Start — Mod „sodiumdynamiclights" passt nicht
mc: [1.21.11]
loader: [fabric]
mod: sodiumdynamiclights
tags: [mixin, crash, incompatible-mod, sodium, dynamic-lights]
signatures:
  - InvalidInjectionException
  - sodiumdynamiclights
  - method_18097
  - net.minecraft.class_310
  - onUpdateLevelInEngines
severity: crash
solution_summary: Lösche die Mod „sodiumdynamiclights" aus deinem Mods-Ordner.
-->

## 🛠️ So reparierst du es

1. Mods-Ordner öffnen.
2. Datei **`sodiumdynamiclights`** löschen. 🗑️
3. Spiel neu starten. ✅

<details>
<summary>❓ Warum ist das passiert?</summary>

Die Mod **sodiumdynamiclights** wurde für eine **ältere** Minecraft-Version gemacht
und passt nicht zu **1.21.11**. Darum stürzt das Spiel beim Start ab.

Du willst die Mod trotzdem? Dann brauchst du eine **neue Version**, die **1.21.11**
unterstützt. Gibt's keine, lass sie weg.

</details>

<details>
<summary>📄 Log-Details (für Nerds)</summary>

```
[Render thread/ERROR]: Mixin apply for mod sodiumdynamiclights failed
mixins.sodiumdynamiclights.json:MinecraftClientMixin from mod sodiumdynamiclights

InvalidInjectionException: Critical injection failure: @Inject annotation on
onUpdateLevelInEngines could not find any targets matching
'Lnet/minecraft/class_310;method_18097(Lnet/minecraft/class_638;)V'
in net/minecraft/class_310. Using refmap
sodiumdynamiclights-fabric-1.21.5-fabric-refmap.json

Caused by: java.lang.RuntimeException: Mixin transformation of
net.minecraft.class_310 failed
```
</details>
