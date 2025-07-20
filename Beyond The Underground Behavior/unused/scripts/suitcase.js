import { world, system, BlockPermutation, ItemStack, Player } from '@minecraft/server';


  world.afterEvents.playerPlaceBlock.subscribe((data) => {
	const player = data.player;
	const block = data.block;
	//const block_above = block.above();
	const block_below = block.below();
	
	
	if(block.typeId == "honkit26113:suitcase") { 
		system.run(() => {
			player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "suitcase.message.interact_with_emerald" }]});
		})
	}


	
	return;
  });

world.beforeEvents.itemUseOn.subscribe((data) => {
	const player = data.source;
	const block = data.block;
	const item = player.getComponent('minecraft:equippable').getEquipment('Mainhand') ?? "none";
	const { x, y, z } = block.location;
	let time = Date.now();
	

	// activate suitcase
	if(block.typeId == "honkit26113:suitcase") { 
		system.run(() => player.runCommand(`say ${time} / ${Date.now()}`))
		if ((time) < Date.now()) {
			system.run(() => {
				if(item.typeId == "minecraft:emerald") {
					player.runCommandAsync("clear @p emerald 0 1");
					if (block.permutation.getState( "honkit26113:direction" ) == 0) {
						block.setType("honkit26113:suitcase_used");
					} else {
						player.runCommand(`structure load mystructure:suitcase_used_rotated_270 ${x} ${y} ${z}`);
					}
					player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "suitcase.message.summoned" }]});
					player.runCommand(`summon honkit26113:lost_explorer ${x} ${y+1} ${z}`);
				} else {
					player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "suitcase.message.interact_with_emerald" }]});	
				};
			})
			time = Date.now() + 500; // 0.5 second cooldown
		}
	};
	

	// used suitcase error
	if(block.typeId == "honkit26113:suitcase_used") { 
		system.run(() => {
			player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "suitcase.message.used" }]});
		})
	}

	return;
  });