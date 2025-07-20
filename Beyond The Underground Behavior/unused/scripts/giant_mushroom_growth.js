import { world, system, BlockPermutation, ItemStack, Player } from '@minecraft/server';


world.beforeEvents.itemUseOn.subscribe((data) => {
    const player = data.source;
    const block = data.block;
    const item = data.itemStack;
    const { x, y, z } = block.location;
	const block_below = block.below();

    if((block.typeId == "honkit26113:luminous_mushroom" || block.typeId == "honkit26113:gloomy_mushroom" ) && item.typeId == "minecraft:bone_meal") { 
        system.runTimeout(() => {
                player.runCommand("playsound item.bone_meal.use @a[r=7]");
                player.runCommand(`particle minecraft:crop_growth_emitter ${x} ${y} ${z}`);
                player.runCommand("clear @s bone_meal 0 1");
                const rand = Math.floor(Math.random() * 10) + 1; // generate number from 1 to 10 inclusive
                if (rand > 6) { // 40% chance
                    switch (block.typeId) {
                        case "honkit26113:luminous_mushroom": 
                            player.runCommand(`structure load mystructure:giant_luminous_mushroom ${x-2} ${y} ${z-2}`);
                            break;
                        case "honkit26113:gloomy_mushroom": 
                            player.runCommand(`structure load mystructure:giant_gloomy_mushroom ${x-3} ${y} ${z-3}`);
                            break;
                    }
                }
            }
        , 1);
    }

	if(block.typeId == "honkit26113:crooked_fungus" && block_below?.typeId == "honkit26113:crooked_nylium" && item.typeId == "minecraft:bone_meal") { 
        system.runTimeout(() => {
                player.runCommand("playsound item.bone_meal.use @a[r=7]");
                player.runCommand(`particle minecraft:crop_growth_emitter ${x} ${y} ${z}`);
                player.runCommand("clear @s bone_meal 0 1");
                const rand = Math.floor(Math.random() * 10) + 1; // generate number from 1 to 10 inclusive
                if (rand > 6) { // 40% chance
					block_below?.setType("minecraft:netherrack");
					const type_rand = Math.floor(Math.random() * 6) + 1; // generate number from 1 to 6 inclusive
					if (type_rand <= 4) { // 4 in 6 chance
						player.runCommand(`structure load mystructure:crooked_fungus_small_1 ${x-2} ${y} ${z-2}`);
					} else if (type_rand == 5) { // 1 in 6 chance
						player.runCommand(`structure load mystructure:crooked_fungus_big_1 ${x-10} ${y} ${z-3}`);
					} else player.runCommand(`structure load mystructure:crooked_fungus_big_1_rotated_90 ${x-3} ${y} ${z-10}`);
                }
            }
        , 1);
    }

    return;
});