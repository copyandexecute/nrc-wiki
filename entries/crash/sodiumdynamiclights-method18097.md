<!--meta
id: crash-sodiumdynamiclights-method18097
type: crash
title: InvalidInjectionException — sodiumdynamiclights Mixin (method_18097)
mc: [1.21.11]
loader: [fabric]
mod: sodiumdynamiclights
tags: [mixin, crash, incompatible-mod, sodium, dynamic-lights]
signatures:
  - InvalidInjectionException
  - sodiumdynamiclights
  - method_18097
  - net.minecraft.class_310
severity: crash
solution_summary: Mod entfernen oder auf eine 1.21.11-kompatible Version updaten.
-->

## Symptom

Der Client crasht direkt beim Start. Im Log steht eine `InvalidInjectionException`,
die `sodiumdynamiclights` und einen Mixin auf `method_18097` in
`net.minecraft.class_310` nennt:

```
org.spongepowered.asm.mixin.injection.throwables.InvalidInjectionException:
  ... sodiumdynamiclights ... method_18097 ... net.minecraft.class_310
```

## Ursache

Die Mod **sodiumdynamiclights 1.0.10** wurde für eine ältere Minecraft-Version
gebaut (Refmap zeigt auf 1.21.5). Ihr Mixin injiziert in die Methode `method_18097`,
die es in **1.21.11** nicht mehr gibt. Damit schlägt das Laden der Mod fehl und der
Client crasht.

## Lösung

1. **sodiumdynamiclights** aus dem Mods-Ordner entfernen, **oder**
2. eine **1.21.11-kompatible** Version der Mod installieren (sofern verfügbar).

Danach startet der Client wieder normal. Andere Dynamic-Lights-Mods, die explizit
1.21.11 unterstützen, sind eine Alternative.
