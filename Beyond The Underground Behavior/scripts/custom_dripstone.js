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