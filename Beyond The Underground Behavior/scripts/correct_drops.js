// This file was modified by HonKit26113 (@HonKit1103). Do not distribute without permission.
import { world, system, BlockPermutation, ItemStack, Player } from '@minecraft/server';
import { use_durability } from './Functions.js';

world.beforeEvents.playerBreakBlock.subscribe((data) => {
	const player = data.player;
	const block = data.block;
    const item = player.getComponent("minecraft:inventory").container.getItem(player.selectedSlotIndex);
	
	const wood_tier_blocks = [
		"honkit26113:cobbled_limestone",
		"honkit26113:crystallized_ice",
		"honkit26113:deepslate_glow_mycelium",
		"honkit26113:frosted_deepslate",
		"honkit26113:frosted_stone",
		"honkit26113:glow_mycelium",
		"honkit26113:limestone",
		"honkit26113:limestone_bricks",
		"honkit26113:limestone_bricks_chiseled",
		"honkit26113:limestone_bricks_cracked",
		"honkit26113:limestone_bricks_mossy",
		"honkit26113:polished_limestone",
		"honkit26113:slimy_deepslate",
		"honkit26113:slimy_deepslate_bricks",
		"honkit26113:slimy_deepslate_bricks_cracked",
		"honkit26113:slimy_deepslate_tiles",
		"honkit26113:slimy_deepslate_tiles_cracked",
		"honkit26113:slimy_stone",
		"honkit26113:slimy_stone_bricks",
		"honkit26113:slimy_stone_bricks_cracked",
		"honkit26113:soul_bricks",
		"honkit26113:soul_bricks_chiseled",
		"honkit26113:soul_bricks_cracked",
		"honkit26113:soul_bricks_fence",
		"honkit26113:soul_geyser",
		"honkit26113:soul_magma",
		"honkit26113:soul_stone",
		"honkit26113:cave_turf",
		"honkit26113:deepslate_cave_turf"
	]

	const iron_tier_blocks = [
		"honkit26113:glowing_obsidian",
		"honkit26113:luminite_block",
		"honkit26113:lava_tank_broken",
		"honkit26113:lava_tank_gold",
		"honkit26113:lava_tank_gold_full",
		"honkit26113:lava_tank_gold_cooldown",
		"honkit26113:lava_tank_gold_locked",
		"honkit26113:lava_tank_diamond",
		"honkit26113:lava_tank_diamond_full",
		"honkit26113:lava_tank_diamond_cooldown",
		"honkit26113:lava_tank_diamond_locked"
	]

	const diamond_tier_blocks = [ // empty for now
	]

	const slabs = [
		"honkit26113:frosted_stone_slab",
		"honkit26113:limestone_bricks_slab",
		"honkit26113:limestone_slab",
		"honkit26113:packed_ice_bricks_slab",
		"honkit26113:slimy_deepslate_bricks_slab",
		"honkit26113:slimy_deepslate_tiles_slab",
		"honkit26113:slimy_stone_bricks_slab",
		"honkit26113:soul_bricks_slab"
	]

	const slabs_no_tools = [
		"honkit26113:crooked_slab",
        "honkit26113:rainbow_gum_slab"
	]

	const luminite_ore = [ // special loot table
		"honkit26113:deepslate_luminite_ore",
		"honkit26113:luminite_ore"
	]

	const prevent_silk_touch = [
		"honkit26113:cobbled_deepslate_pebbles",
		"honkit26113:cobbled_limestone_pebbles",
		"honkit26113:cobblestone_pebbles",
		"honkit26113:deepslate_pebbles",
		"honkit26113:frosted_deepslate_pebbles",
		"honkit26113:frosted_pebbles",
		"honkit26113:gloomy_mushroom",
		"honkit26113:ice_crystal",
		"honkit26113:limestone_pebbles",
		"honkit26113:luminous_mushroom",
		"honkit26113:mysterious_fungus",
		"honkit26113:pebbles",
		//"honkit26113:sand_layer", // special loot_table
		"honkit26113:sandy_skelly_skull",
		//"honkit26113:slime_layer", // special loot table
		"honkit26113:slimy_pebbles"
	]

	const prevent_silk_touch_no_lt = [
		"honkit26113:gloomy_mushroom_block",
		"honkit26113:glow_lichen_block",
		"honkit26113:lava_tank_broken",
		"honkit26113:lava_tank_diamond",
		"honkit26113:lava_tank_diamond_cooldown",
		"honkit26113:lava_tank_diamond_full",
		"honkit26113:lava_tank_diamond_locked",
		"honkit26113:lava_tank_gold",
		"honkit26113:lava_tank_gold_cooldown",
		"honkit26113:lava_tank_gold_full",
		"honkit26113:lava_tank_gold_locked",
		"honkit26113:luminous_mushroom_block",
		"honkit26113:luminous_mushroom_stem",
		"honkit26113:quicksand",
		"honkit26113:slime_lantern",
		"honkit26113:soul_shroomlight",
		"honkit26113:suitcase",
		"honkit26113:suitcase_used"
	]

	const require_shears = [
		"honkit26113:slimy_blossom",
		"honkit26113:slimy_sprouts",
		"honkit26113:sticky_spikes",
		"honkit26113:crooked_roots",
        "honkit26113:chromatic_petals",
        "honkit26113:twilight_spores",
        "honkit26113:rainbow_gum_leaves"
	]

    const no_drops = [
        "honkit26113:arena_trigger",
        "honkit26113:arena_limestone_pillar"
    ]

	const dripping_icicle = [
		"honkit26113:dripping_icicle_medium",
		"honkit26113:dripping_icicle_small"
	]

	const dripping_slime = [
		"honkit26113:dripping_slime_body",
		"honkit26113:dripping_slime_head"
	]

	const radiant_vines = [ // require shears
		"honkit26113:radiant_vines_body",
		"honkit26113:radiant_vines_head"
	]

	const sandy_roots = [ // require shears
		"honkit26113:sandy_roots_body",
		"honkit26113:sandy_roots_head"
	]

	const wood_tier_tools = [
		"minecraft:wooden_pickaxe",
		"minecraft:stone_pickaxe",
		"minecraft:iron_pickaxe",
		"minecraft:golden_pickaxe",
		"minecraft:diamond_pickaxe",
		"minecraft:netherite_pickaxe",
		"honkit26113:luminite_pickaxe"
	]

	const iron_tier_tools = [
		"minecraft:iron_pickaxe",
		"minecraft:diamond_pickaxe",
		"minecraft:netherite_pickaxe",
		"honkit26113:luminite_pickaxe"
	]

	const diamond_tier_tools = [ // unused for now
		"minecraft:diamond_pickaxe",
		"minecraft:netherite_pickaxe",
		"honkit26113:luminite_pickaxe"
	]

	//const durability = (item?.getComponent("minecraft:durability").maxDurability - item?.getComponent("minecraft:durability").damage) ?? 1
	//const unbreaking = item.getComponent("enchantable")?.getEnchantment("unbreaking")?.level
	const drop_item = new ItemStack(block.typeId, 1);

	/*// wood tier
	if(wood_tier_blocks.includes(block.typeId) && !player.matches({gameMode:'creative'})) { 
		if (wood_tier_tools.includes(item.typeId)) {
			if ((item.getComponent("minecraft:enchantable").getEnchantment("silk_touch")?.level ?? 0) > 0) { // detect silk touch
				data.cancel = true;
				system.run(() => {
					block.setType("minecraft:air");
					player.dimension.spawnItem(drop_item, {x: block.x, y: block.y, z: block.z});
					use_durability(player, item, 1);
				})
			}
		} else {
			// dont drop the block
			data.cancel = true;
			system.run(() => {
				block.setType("minecraft:air");
			})
		}
	}

	


	// iron tier
	if(iron_tier_blocks.includes(block.typeId) && !player.matches({gameMode:'creative'})) { 
		if (iron_tier_tools.includes(item.typeId)) {
			if ((item.getComponent("minecraft:enchantable").getEnchantment("silk_touch")?.level ?? 0) > 0) {
				data.cancel = true;
				system.run(() => {
					block.setType("minecraft:air");
					player.dimension.spawnItem(drop_item, {x: block.x, y: block.y, z: block.z});
					use_durability(player, item, 1);
				})
			}
		} else {
			// dont drop the block
			data.cancel = true;
			system.run(() => {
				block.setType("minecraft:air");
			})
		}
		
	}


	// luminite ores
	if(luminite_ore.includes(block.typeId) && !player.matches({gameMode:'creative'})) { 
		if (iron_tier_tools.includes(item.typeId)) {
			use_durability(player, item, 1);
			if ((item.getComponent("minecraft:enchantable").getEnchantment("silk_touch")?.level ?? 0) > 0) {
				data.cancel = true;
				system.run(() => {
					block.setType("minecraft:air");
					player.dimension.spawnItem(drop_item, {x: block.x, y: block.y, z: block.z});
				})
			}
		} else {
			// dont drop the block
			data.cancel = true;
			system.run(() => {
				block.setType("minecraft:air");
			})
		}
		
	}

	// remove the namespace from block identifer 
	let block_identifier = block.typeId;
	let block_name = block_identifier.replace('honkit26113:', '')

	// prevent silk touch, block name is same as loot table name
	if(prevent_silk_touch.includes(block.typeId) && !player.matches({gameMode:'creative'})) { 
		if ((item.getComponent("minecraft:enchantable").getEnchantment("silk_touch")?.level ?? 0) > 0) {
			data.cancel = true;
			system.run(() => {
				block.setType("minecraft:air");
				player.runCommand(`loot spawn ${block.x} ${block.y} ${block.z} loot \"blocks/${block_name}\"`);
				use_durability(player, item, 1);
			})
		}
	}

	// prevent silk touch, no separate loot table
	if(prevent_silk_touch_no_lt.includes(block.typeId) && !player.matches({gameMode:'creative'})) { 
		if ((item.getComponent("minecraft:enchantable").getEnchantment("silk_touch")?.level ?? 0) > 0) {
			data.cancel = true;
			system.run(() => {
				block.setType("minecraft:air");
				player.dimension.spawnItem(drop_item, {x: block.x, y: block.y, z: block.z});
				use_durability(player, item, 1);
			})
		}
	}

    // blocks with no drops
	if(no_drops.includes(block.typeId) && !player.matches({gameMode:'creative'})) { 
        data.cancel = true;
        system.run(() => {
            block.setType("minecraft:air");
            use_durability(player, item, 1);
        })
	}

	// special: dripping icicles
	if(dripping_icicle.includes(block.typeId) && !player.matches({gameMode:'creative'})) { 
		if ((item.getComponent("minecraft:enchantable").getEnchantment("silk_touch")?.level ?? 0) > 0) {
			data.cancel = true;
			system.run(() => {
				block.setType("minecraft:air");
				player.runCommand(`loot spawn ${block.x} ${block.y} ${block.z} loot \"blocks/dripping_icicle\"`);
				use_durability(player, item, 1);
			})
		}
	}

	// special: dripping slime
	if(dripping_slime.includes(block.typeId) && !player.matches({gameMode:'creative'})) { 
		if ((item.getComponent("minecraft:enchantable").getEnchantment("silk_touch")?.level ?? 0) > 0) {
			data.cancel = true;
			system.run(() => {
				block.setType("minecraft:air");
				player.runCommand(`loot spawn ${block.x} ${block.y} ${block.z} loot \"blocks/dripping_slime\"`);
				use_durability(player, item, 1);
			})
		}
	}

	// special: radiant vines
	if(radiant_vines.includes(block.typeId) && !player.matches({gameMode:'creative'})) { 
		if (item.typeId == "minecraft:shears") {
			if ((item.getComponent("minecraft:enchantable").getEnchantment("silk_touch")?.level ?? 0) > 0) {
				data.cancel = true;
				system.run(() => {
					player.runCommand(`say silk touch!!!!!!!!`);
					block.setType("minecraft:air");
					player.runCommand(`loot spawn ${block.x} ${block.y} ${block.z} loot \"blocks/radiant_vines\"`);
					use_durability(player, item, 1);
				})
			} else {
				system.run(() => {
					player.runCommand(`loot spawn ${block.x} ${block.y} ${block.z} loot \"blocks/radiant_vines\"`);
				})
			}
		}
	}

	// special: sandy roots
	if(sandy_roots.includes(block.typeId) && !player.matches({gameMode:'creative'})) { 
		if (item.typeId == "minecraft:shears") {
			if ((item.getComponent("minecraft:enchantable").getEnchantment("silk_touch")?.level ?? 0) > 0) {
				data.cancel = true;
				system.run(() => {
					block.setType("minecraft:air");
					player.runCommand(`loot spawn ${block.x} ${block.y} ${block.z} loot \"blocks/sandy_roots\"`);
					use_durability(player, item, 1);
				})
			} else {
				system.run(() => {
					player.runCommand(`loot spawn ${block.x} ${block.y} ${block.z} loot \"blocks/sandy_roots\"`);
				})
			}
		}
	}
	// special: slabs (no tools required)
	if(slabs_no_tools.includes(block.typeId) && !player.matches({gameMode:'creative'})) { 
		if ((item.getComponent("minecraft:enchantable").getEnchantment("silk_touch")?.level ?? 0) > 0) {
			data.cancel = true;
			system.run(() => {
				use_durability(player, item, 1);
				block.setType("minecraft:air");
				if (block.permutation.getState( "honkit26113:placeontopside" ) == 6 || block.permutation.getState( "kai:double" )) {
					player.dimension.spawnItem(drop_item, {x: block.x, y: block.y, z: block.z});
					player.dimension.spawnItem(drop_item, {x: block.x, y: block.y, z: block.z});
				} else {
					player.dimension.spawnItem(drop_item, {x: block.x, y: block.y, z: block.z});
				}
			})
		}
	}

	// special: slabs (tools are required)
	if(slabs.includes(block.typeId) && !player.matches({gameMode:'creative'})) { 
		if (wood_tier_tools.includes(item.typeId)) {
			if ((item.getComponent("minecraft:enchantable").getEnchantment("silk_touch")?.level ?? 0) > 0) {
				data.cancel = true;
				system.run(() => {
					use_durability(player, item, 1);
					block.setType("minecraft:air");
					if (block.permutation.getState( "honkit26113:placeontopside" ) == 6 || block.permutation.getState( "kai:double" )) {
                        player.dimension.spawnItem(drop_item, {x: block.x, y: block.y, z: block.z});
                        player.dimension.spawnItem(drop_item, {x: block.x, y: block.y, z: block.z});
					} else {
						player.dimension.spawnItem(drop_item, {x: block.x, y: block.y, z: block.z});
					}
				})
			}
		} else {
			// dont drop the block
			data.cancel = true;
			system.run(() => {
				block.setType("minecraft:air");
			})
		}
	}*/

	
	// shears
	if (require_shears.includes(block.typeId) && !player.matches({gameMode:'creative'})) { 
        system.run(() => {
            if ((item.getComponent("minecraft:enchantable").getEnchantment("silk_touch")?.level ?? 0) > 0) {
                data.cancel = true;
                use_durability(player, item, 1);
                block.setType("minecraft:air");
            }
            if (block.hasTag("honkit26113:four_count")) {
                for (let i = 0; i <= block.permutation.getState("honkit26113:count"); i++) {
                    player.dimension.spawnItem(drop_item, block.location);
                }
            } else {
                player.dimension.spawnItem(drop_item, block.location);
            }
        })
    }

	// sand and slime layers
	if(require_shears.includes(block.typeId) && !player.matches({gameMode:'creative'})) { 
		if ((item.getComponent("minecraft:enchantable").getEnchantment("silk_touch")?.level ?? 0) > 0) {
			data.cancel = true;
			system.run(() => {
				use_durability(player, item, 1);
				block.setType("minecraft:air");
				player.runCommand(`loot spawn ${block.location} loot \"blocks/${block_name}${math.round(block.permutation.getState( "honkit26113:add_layer" ) / 2)}\"`);
			})
		}
	}

	
	return;
  });
