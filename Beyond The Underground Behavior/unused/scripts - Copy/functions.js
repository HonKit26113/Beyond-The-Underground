// This file demonstrates that the code is working by
// Spamming the chat with "Hello World"

// Import world component from "@minecraft/server"
import { world, system, ItemType, BlockPermutation, EffectTypes, ScreenDisplay } from '@minecraft/server';



world.beforeEvents.playerBreakBlock.subscribe((data) => {
	const player = data.player;
	const { block } = data;
	const block_above = block.above();
	const block_below = block.below();
	if ((data.block.typeId === "honkit26113:dripping_icicle_small" && block_above?.typeId === "honkit26113:dripping_icicle_medium") || (data.block.typeId === "honkit26113:dripping_icicle_medium" && block_above?.typeId === "honkit26113:dripping_icicle_medium")) {
		system.run (() => {
			data.block.above().setType("honkit26113:dripping_icicle_small");
		});
	}
	if ((data.block.typeId === "honkit26113:dripping_slime_head" && block_above?.typeId === "honkit26113:dripping_slime_body") || (data.block.typeId === "honkit26113:dripping_slime_body" && block_above?.typeId === "honkit26113:dripping_slime_body")) {
		system.run (() => {
			data.block.above().setType("honkit26113:dripping_slime_head");
		});
	}
	if ((data.block.typeId === "honkit26113:sandy_roots_head" && block_above?.typeId === "honkit26113:sandy_roots_body") || (data.block.typeId === "honkit26113:sandy_roots_body" && block_above?.typeId === "honkit26113:sandy_roots_body")) {
		system.run (() => {
			data.block.above().setType("honkit26113:sandy_roots_head");
		});
	}
	if ((data.block.typeId === "honkit26113:radiant_vines_head" && block_below?.typeId === "honkit26113:radiant_vines_body") || (data.block.typeId === "honkit26113:radiant_vines_body" && block_below?.typeId === "honkit26113:radiant_vines_body")) {
		system.run (() => {
			data.block.below().setType("honkit26113:radiant_vines_head");
		});
	}

	

	return;
  });
  
  world.afterEvents.playerPlaceBlock.subscribe((data) => {
	const player = data.player;
	const { block } = data;
	const block_above = block.above();
	const block_below = block.below();
	// dripping icicle
	if (data.block.typeId === "honkit26113:dripping_icicle_small" && block_above?.typeId === "honkit26113:dripping_icicle_small") {
		system.run (() => {
			data.block.above().setType("honkit26113:dripping_icicle_medium");
		});
	}
	if ((data.block.typeId === "honkit26113:dripping_icicle_small" && block_below?.typeId === "honkit26113:dripping_icicle_medium") || (data.block.typeId === "honkit26113:dripping_icicle_small" && block_below?.typeId === "honkit26113:dripping_icicle_small")) {
		system.run (() => {
			data.block.setType("honkit26113:dripping_icicle_medium");
		});
	}
	
	// dripping slime
	if (data.block.typeId === "honkit26113:dripping_slime_head" && block_above?.typeId === "honkit26113:dripping_slime_head") {
		system.run (() => {
			data.block.above().setType("honkit26113:dripping_slime_body");
		});
	}
	if ((data.block.typeId === "honkit26113:dripping_slime_head" && block_below?.typeId === "honkit26113:dripping_slime_body") || (data.block.typeId === "honkit26113:dripping_slime_head" && block_below?.typeId === "honkit26113:dripping_slime_head")) {
		system.run (() => {
			data.block.setType("honkit26113:dripping_slime_body");
		});
	}

	// sandy roots
	if (data.block.typeId === "honkit26113:sandy_roots_head" && block_above?.typeId === "honkit26113:sandy_roots_head") {
		system.run (() => {
			data.block.above().setType("honkit26113:sandy_roots_body");
		});
	}
	if ((data.block.typeId === "honkit26113:sandy_roots_head" && block_below?.typeId === "honkit26113:sandy_roots_body") || (data.block.typeId === "honkit26113:sandy_roots_head" && block_below?.typeId === "honkit26113:sandy_roots_head")) {
		system.run (() => {
			data.block.setType("honkit26113:sandy_roots_body");
		});
	}

	// radiant vines
	if (data.block.typeId === "honkit26113:radiant_vines_head" && block_below?.typeId === "honkit26113:radiant_vines_head") {
		system.run (() => {
			data.block.below().setType("honkit26113:radiant_vines_body");
		});
	}
	if ((data.block.typeId === "honkit26113:radiant_vines_head" && block_above?.typeId === "honkit26113:radiant_vines_body") || (data.block.typeId === "honkit26113:radiant_vines_head" && block_above?.typeId === "honkit26113:radiant_vines_head")) {
		system.run (() => {
			data.block.setType("honkit26113:radiant_vines_body");
		});
	}

	/*if (data.block.typeId === 'minecraft:bedrock') {
	  data.cancel = true;
	  system.run(() => {
		player.sendMessage('You cannot place Bedrock');
	  });
	}*/
	return;
  });

  world.beforeEvents.playerInteractWithBlock.subscribe((data) => {
	const player = data.player;
	const block = data.block;
	const block_above = block.above();
	const block_below = block.below();

	/*// suitcase: summon lost explorer
	if(block.typeId == "honkit26113:suitcase" && block.permutation.getState("honkit26113:trader_spawned") == 0) {
		system.run(() => {
			player.onScreenDisplay.setActionbar("suitcase.message.summoned", {
			  stayDuration: 3.5,
			  fadeInDuration: 0.5,
			  fadeOutDuration: 1
			});
			player.sendMessage('You cannot pcsalace Bedrock');
		})
	}*/

	

	// activate lava tank
	if((block.typeId == "honkit26113:lava_tank_gold" || block.typeId == "honkit26113:lava_tank_diamond") && block.permutation.getState( "honkit26113:confirmation" ) == 0) {
		system.run(() => {
			if (block_below?.typeId != "minecraft:lava" && block_below?.typeId != "minecraft:flowing_lava") {
				player.onScreenDisplay.setActionBar({"rawtext":[{"translate":"lava_tank.message.error_not_above_lava"}]});
			} else {
				var permutation = BlockPermutation.resolve(block.typeId);
				permutation = permutation.withState("honkit26113:confirmation", 1);
				player.onScreenDisplay.setActionBar({"rawtext":[{"translate":"lava_tank.message.confirmation"}]});
			};

			//const gold_tank_radius = 5;
			//const diamond_tank_radius = 7;
			/*const tank_x = block.location.x;
			const tank_y = block.location.y;
			const tank_z = block.location.z;
			/*const dim_id = block.dimension.id;
			//while (let found_lava == false) {
				for ( let i = 0; i < gold_tank_radius; i++ ) {
					for ( let j = 0; j < gold_tank_radius; j++ ) {
						for ( let k = 0; k < gold_tank_radius; k++ ) {
							player.sendMessage({ "rawtext": [
								{ 
									"text": block.dimension.getBlock(
										{
											x: tank_x - Math.round( gold_tank_radius / 2) + 1 + i,
											y: tank_y - j - 1,
											z: tank_z - Math.round( gold_tank_radius / 2) + 1 + k,
										}
									)
								}
							]})
						}
					}
				}
			//}*/
			//player.sendMessage({ "rawtext": [{ "text": tank_x.toString() }, { "text": ", " }, { "text": tank_y.toString() }, { "text": ", " }, { "text": tank_z.toString() }] });
		});
	}

	// full lava tank: empty obsidian lava tank using pickaxe
	const pickaxe_types = [
		"minecraft:diamond_pickaxe",
		"minecraft:netherite_pickaxe",
		"honkit26113:luminite_pickaxe"
	];

	if((block.typeId == "honkit26113:lava_tank_gold_full" || block.typeId == "honkit26113:lava_tank_diamond_full") && block.permutation.getState( "honkit26113:obsidian" ) == 1) { 
		system.run(() => {
			if (pickaxe_types.includes(data.itemStack.typeId)) {
				player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.emptied" }]});
				switch (block.typeId) {
					case "honkit26113:lava_tank_gold_full": 
						block.setType("honkit26113:lava_tank_gold_cooldown");
						break;
					case "honkit26113:lava_tank_diamond_full": 
						block.setType("honkit26113:lava_tank_diamond_cooldown");
						break;
				}
				var count_secs = 5;
				const countdown = system.runInterval(() => {
					player.onScreenDisplay.setActionBar([{ "rawtext": [{ "translate":"lava_tank.message.cooldown" }]}, { "text": " [0:0" }, { "text": count_secs.toString() }, { "text": "]" }]);
					count_secs--;
				}, 20);
				
				system.runTimeout(() => {
					system.clearRun(countdown);
					player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.cooldown_end" }]});
					switch (block.typeId) {
						case "honkit26113:lava_tank_gold_cooldown": 
							block.setType("honkit26113:lava_tank_gold");
							break;
						case "honkit26113:lava_tank_diamond_cooldown": 
							block.setType("honkit26113:lava_tank_diamond");
							break;
					}
				}, 140);
			}
		})
	}

	return;
  });

  world.afterEvents.itemUse.subscribe(data => {
	if (data.itemStack.typeId == "honkit26113:soul_healer") {
	  system.run(() => {
		const player = data.source;
		player.playSound("random.glass");
		player.runCommandAsync("playanimation @s animation.soul_healer.using using 1.65");
		player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "soul_healer.message.activated" }]});
		player.addEffect(EffectTypes.get('instant_health'), 20, { amplifier: 1 });
		player.addEffect(EffectTypes.get('regeneration'), 300, { amplifier: 1 });
		player.addEffect(EffectTypes.get('fire_resistance'), 300, { amplifier: 1 });
		player.addEffect(EffectTypes.get('resistance'), 100, { amplifier: 1 });
	  });
	}

	return;
  });