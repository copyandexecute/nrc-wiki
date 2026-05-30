<!--meta
id: crash-nrcclient-xaero-compat
type: crash
title: Absturz beim Start — NRC Xaero-Compat passt nicht zur Xaero-Version
mc: [1.21.10, 1.21.11]
loader: [fabric]
mod: nrcclient
status: investigating
tags: [crash, nrc-own, mixin, xaero, compat]
signatures:
  - nrc$xaeroRemoveAll
  - GuiAddWaypointMixin
severity: crash
solution_summary: Bekannter NRC-Bug — unser Xaero-Compat-Mixin passt nicht zur installierten Xaero-Version. Fix kommt.
workaround: Xaero (Minimap/Worldmap/XaeroPlus) auf die von NRC unterstützte Version bringen, oder vorerst entfernen.
-->

## Was ist los?

Spiel crasht beim Start. Im Log: `@WrapOperation … nrc$xaeroRemoveAll could not find any
targets matching … xaero/common/gui/GuiAddWaypoint` — unser **Xaero-Compat-Mixin**
(`GuiAddWaypointMixin`) zielt auf eine Methode, die in deiner Xaero-Version anders heißt.

Das ist **unser Bug** (NRC) — der Header „XaeroPlus has crashed" täuscht.

## 🩹 Solange — Workaround

Xaero (Minimap / Worldmap / XaeroPlus) auf die von NRC erwartete Version bringen, oder
vorübergehend entfernen.

<details>
<summary>📄 Log-Details (für Nerds)</summary>

```
MixinApplyError: Mixin [mixins.nrc-client.json:compat.xaero.GuiAddWaypointMixin
   from mod nrc-client] FAILED during APPLY
InvalidInjectionException: @WrapOperation on nrc$xaeroRemoveAll could not find any targets
   matching 'Lxaero/common/gui/GuiAddWaypoint;lambda$init$3(…)V'
```
</details>

<details>
<summary>🔧 Intern (NRC)</summary>

Unser Compat-Mixin gegen geänderte Xaero-Klasse/Methode. Fix: Target an aktuelle Xaero-Version
anpassen oder Injection robuster/optional machen.

</details>
