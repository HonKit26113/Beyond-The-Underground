import { world, system, BlockPermutation, ItemStack, Player } from '@minecraft/server';


  world.afterEvents.playerPlaceBlock.subscribe((data) => {
	const player = data.player;
	const block = data.block;
	//const block_above = block.above();
	const block_below = block.below();
	const { x, y, z } = block.location;
	
	// check for lava under the tank
	if(block.typeId == "honkit26113:lava_tank_gold" || block.typeId == "honkit26113:lava_tank_diamond") {
		system.run(() => {
			if (block_below?.typeId != "minecraft:lava" && block_below?.typeId != "minecraft:flowing_lava") {
				player.onScreenDisplay.setActionBar({"rawtext":[{"translate":"lava_tank.message.error_not_above_lava"}]});
			} else {
				//block.setPermutation(BlockPermutation.resolve(block.typeId, {"honkit26113:confirmation": 1}));
				player.runCommand(`fill ${x-5} ${y-5} ${z-5} ${x+5} ${y} ${z+5} air replace lava`);
				player.runCommand(`fill ${x-5} ${y-5} ${z-5} ${x+5} ${y} ${z+5} air replace flowing_lava`);
				player.runCommandAsync("playsound bucket.fill_lava @a[r=10]");
				switch (block.typeId) {
					case "honkit26113:lava_tank_gold": 
						block.setType("honkit26113:lava_tank_gold_full");
						break;
					case "honkit26113:lava_tank_diamond": 
						block.setType("honkit26113:lava_tank_diamond_full");
						break;
				}
				//player.onScreenDisplay.setActionBar({"rawtext":[{"translate":"lava_tank.message.confirmation"}]});

			};

		});
	}



	return;
  });