// This file was modified by HonKit26113 (@HonKit1103). Do not distribute without permission.
import { world, system } from '@minecraft/server';
import { decrement_stack } from './functions';

world.afterEvents.itemUse.subscribe(data => {
	if (data.itemStack.typeId == "honkit26113:soul_healer") {
	  system.run(() => {
		const player = data.source;
		player.playSound("random.glass");
		player.runCommandAsync("playanimation @s animation.soul_healer.using using 1.65");
		player.addEffect('instant_health', 20, {amplifier: 1})
		player.addEffect('regeneration', 300, {amplifier: 1})
		player.addEffect('fire_resistance', 30, {amplifier: 1})
		player.addEffect('resistance', 100, {amplifier: 1})
		player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "soul_healer.message.activated" }]});
		decrement_stack(player, data.itemStack, 1)
	  });
	}

	return;
  });