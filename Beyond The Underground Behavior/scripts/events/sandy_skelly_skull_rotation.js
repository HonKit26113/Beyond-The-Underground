import { system, BlockPermutation, world } from "@minecraft/server";

function getPreciseRotation(playerYRotation) {
	// Transform player's head Y rotation to a positive
	if (playerYRotation < 0) {
        playerYRotation += 360;
    }
	// How many 16ths of 360 is the head rotation? - rounded
	const rotation = Math.round(playerYRotation / 22.5);
  
	// 0 and 16 represent duplicate rotations (0 degrees and 360 degrees), so 0 is returned if the value of `rotation` is 16
	return rotation !== 16 ? rotation : 0;
}

world.afterEvents.playerPlaceBlock.subscribe(data => {
    const player  = data.player;
    const block = data.block;

    if (block.typeId == "honkit26113:sandy_skelly_skull") {
        system.run(() => {
            if (!player) return; // Exit if the player is undefined

            const blockFace = block.permutation.getState("minecraft:block_face");
            if (blockFace != "up") return; // Exit if the block hasn't been placed on the top of another block

            // Get the rotation using the function from earlier
            const playerYRotation = player.getRotation().y;
            const rotation = getPreciseRotation(playerYRotation);
            // Tell Minecraft to place the correct `wiki:rotation` value
            block.setPermutation(BlockPermutation.resolve("honkit26113:sandy_skelly_skull", {"honkit26113:rotation": rotation, "minecraft:block_face": blockFace}));
        })
    }
})

/*world.beforeEvents.worldInitialize.subscribe(({ blockComponentRegistry }) => {
	blockComponentRegistry.registerCustomComponent("honkit26113:set_sandy_skelly_skull_rotation", {
		beforeOnPlayerPlace(event) {
			const { player } = event;
			if (!player) return; // Exit if the player is undefined
	
			const blockFace = event.permutationToPlace.getState("minecraft:block_face");
			if (blockFace !== "up") return; // Exit if the block hasn't been placed on the top of another block
	
			// Get the rotation using the function from earlier
			const playerYRotation = player.getRotation().y;
			const rotation = getPreciseRotation(playerYRotation);
	
			// Tell Minecraft to place the correct `wiki:rotation` value
			event.permutationToPlace = event.permutationToPlace.withState("honkit26113:rotation", rotation);
		}
	});
});*/