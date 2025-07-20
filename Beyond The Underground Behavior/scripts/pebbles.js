// This file was modified by HonKit26113 (@HonKit1103). Do not distribute without permission.
import { world, system, BlockPermutation } from '@minecraft/server';

world.afterEvents.playerPlaceBlock.subscribe((data) => {
	const block = data.block;
	
	const pebbles = [
		"honkit26113:slimy_pebbles_item",
		"honkit26113:slimy_deepslate_pebbles_item",
		"honkit26113:cobbled_deepslate_pebbles_item",
		"honkit26113:deepslate_pebbles_item",
		"honkit26113:cobbled_limestone_pebbles_item",
		"honkit26113:limestone_pebbles_item",
		"honkit26113:frosted_deepslate_pebbles_item",
		"honkit26113:pebbles_item",
		"honkit26113:cobblestone_pebbles_item",
		"honkit26113:frosted_pebbles_item",
		"honkit26113:slimy_pebbles",
		"honkit26113:slimy_deepslate_pebbles",
		"honkit26113:cobbled_deepslate_pebbles",
		"honkit26113:deepslate_pebbles",
		"honkit26113:cobbled_limestone_pebbles",
		"honkit26113:limestone_pebbles",
		"honkit26113:frosted_deepslate_pebbles",
		"honkit26113:pebbles",
		"honkit26113:cobblestone_pebbles",
		"honkit26113:frosted_pebbles"
	];

	let rand = Math.floor(Math.random() * 12) + 1;
	if (pebbles.includes(block.typeId)) { 
		system.run(() => {
			block.setPermutation(BlockPermutation.resolve(block.typeId, {"honkit26113:variation": rand}));
		})
	}
	return;
  });