import { system } from '@minecraft/server';
import { decrement_stack } from "../Functions";

/** @type {import("@minecraft/server").ItemCustomComponent} */
const SoulHealerComponent: import("@minecraft/server").ItemCustomComponent = {
    onUse({ source }, {}) {
		source.playSound("random.glass");
        source.playAnimation("animation.soul_healer.using");
		source.addEffect('instant_health', 20, {amplifier: 1});
		source.addEffect('regeneration', 300, {amplifier: 1});
		source.addEffect('fire_resistance', 40, {amplifier: 1});
		source.addEffect('resistance', 100, {amplifier: 1});
		source.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "soul_healer.message.activated" }]});
		decrement_stack(source, false, 1);
    }
};

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("honkit26113:use_soul_healer", SoulHealerComponent);
});

