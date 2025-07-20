import { world, system } from '@minecraft/server';


world.beforeEvents.playerBreakBlock.subscribe((data) => {
	const block = data.block;
	const block_above = block.above();
	const block_below = block.below();
	if ((block.typeId === "honkit26113:dripping_icicle_small" && block_above?.typeId === "honkit26113:dripping_icicle_medium") || (block.typeId === "honkit26113:dripping_icicle_medium" && block_above?.typeId === "honkit26113:dripping_icicle_medium")) {
		system.run (() => {
			block.above().setType("honkit26113:dripping_icicle_small");
		});
	}
	if ((block.typeId === "honkit26113:dripping_slime_head" && block_above?.typeId === "honkit26113:dripping_slime_body") || (block.typeId === "honkit26113:dripping_slime_body" && block_above?.typeId === "honkit26113:dripping_slime_body")) {
		system.run (() => {
			block.above().setType("honkit26113:dripping_slime_head");
		});
	}
	if ((block.typeId === "honkit26113:sandy_roots_head" && block_above?.typeId === "honkit26113:sandy_roots_body") || (block.typeId === "honkit26113:sandy_roots_body" && block_above?.typeId === "honkit26113:sandy_roots_body")) {
		system.run (() => {
			block.above().setType("honkit26113:sandy_roots_head");
		});
	}
	if ((block.typeId === "honkit26113:radiant_vines_head" && block_below?.typeId === "honkit26113:radiant_vines_body") || (block.typeId === "honkit26113:radiant_vines_body" && block_below?.typeId === "honkit26113:radiant_vines_body")) {
		system.run (() => {
			block.below().setType("honkit26113:radiant_vines_head");
		});
	}

	return;
  });
  
  world.afterEvents.playerPlaceBlock.subscribe((data) => {
	const block = data.block;
	const block_above = block.above();
	const block_below = block.below();
	// dripping icicle
	if (block.typeId === "honkit26113:dripping_icicle_small" && block_above?.typeId === "honkit26113:dripping_icicle_small") {
		system.run (() => {
			block.above().setType("honkit26113:dripping_icicle_medium");
		});
	}
	if ((block.typeId === "honkit26113:dripping_icicle_small" && block_below?.typeId === "honkit26113:dripping_icicle_medium") || (data.block.typeId === "honkit26113:dripping_icicle_small" && block_below?.typeId === "honkit26113:dripping_icicle_small")) {
		system.run (() => {
			block.setType("honkit26113:dripping_icicle_medium");
		});
	}
	
	// dripping slime
	if (block.typeId === "honkit26113:dripping_slime_head" && block_above?.typeId === "honkit26113:dripping_slime_head") {
		system.run (() => {
			block.above().setType("honkit26113:dripping_slime_body");
		});
	}
	if ((block.typeId === "honkit26113:dripping_slime_head" && block_below?.typeId === "honkit26113:dripping_slime_body") || (block.typeId === "honkit26113:dripping_slime_head" && block_below?.typeId === "honkit26113:dripping_slime_head")) {
		system.run (() => {
			block.setType("honkit26113:dripping_slime_body");
		});
	}

	// sandy roots
	if (block.typeId === "honkit26113:sandy_roots_head" && block_above?.typeId === "honkit26113:sandy_roots_head") {
		system.run (() => {
			block.above().setType("honkit26113:sandy_roots_body");
		});
	}
	if ((block.typeId === "honkit26113:sandy_roots_head" && block_below?.typeId === "honkit26113:sandy_roots_body") || (block.typeId === "honkit26113:sandy_roots_head" && block_below?.typeId === "honkit26113:sandy_roots_head")) {
		system.run (() => {
			block.setType("honkit26113:sandy_roots_body");
		});
	}

	// radiant vines
	if (block.typeId === "honkit26113:radiant_vines_head" && block_below?.typeId === "honkit26113:radiant_vines_head") {
		system.run (() => {
			block.below().setType("honkit26113:radiant_vines_body");
		});
	}
	if ((block.typeId === "honkit26113:radiant_vines_head" && block_above?.typeId === "honkit26113:radiant_vines_body") || (block.typeId === "honkit26113:radiant_vines_head" && block_above?.typeId === "honkit26113:radiant_vines_head")) {
		system.run (() => {
			block.setType("honkit26113:radiant_vines_body");
		});
	}

	return;
  });

  /*world.beforeEvents.playerInteractWithBlock.subscribe((data) => {
	const player = data.player;
	const block = data.block;
	const block_above = block.above();
	const block_below = block.below();

	// activate lava tank
	if((block.typeId == "honkit26113:lava_tank_gold" || block.typeId == "honkit26113:lava_tank_diamond") && block.permutation.getState( "honkit26113:confirmation" ) == 0) {
		system.run(() => {
			if (block_below?.typeId != "minecraft:lava" && block_below?.typeId != "minecraft:flowing_lava") {
				player.onScreenDisplay.setActionBar({"rawtext":[{"translate":"lava_tank.message.error_not_above_lava"}]});
			} else {
				block.setPermutation(BlockPermutation.resolve(block.typeId, {"honkit26113:confirmation": 1}));
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
		/*});
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
  });*/