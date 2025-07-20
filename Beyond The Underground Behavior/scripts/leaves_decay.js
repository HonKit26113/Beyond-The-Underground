// This code is from a template made by xxpoggylitxx. Thank you!


import { world, BlockPermutation } from "@minecraft/server";

world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent('honkit26113:leaves_decay', {
        beforeOnPlayerPlace: e => {
            e.permutationToPlace = e.permutationToPlace.withState('pog:playerPlaced', true);
        },
        onTick: e => {
            const validLogBlocks = ["honkit26113:rainbow_gum_log"]
            const loc = e.block.location;
            const radius = 10; // Change this value to adjust the radius

            function isWithinSphere(blockLoc, center, radius) {
                const dx = blockLoc.x - center.x;
                const dy = blockLoc.y - center.y;
                const dz = blockLoc.z - center.z;
                const distanceSquared = dx * dx + dy * dy + dz * dz;
                return distanceSquared <= radius * radius;
            }

            let foundLog = false; // Flag to track if a log is found
            // Iterate through blocks within a spheric area
            for (let xOffset = -radius; xOffset <= radius; xOffset++) {
                for (let yOffset = -radius; yOffset <= radius; yOffset++) {
                    for (let zOffset = -radius; zOffset <= radius; zOffset++) {
                        const blockLoc = {
                            x: loc.x + xOffset,
                            y: loc.y + yOffset,
                            z: loc.z + zOffset,
                        };
                        // Check if the block is within the sphere radius
                        if (isWithinSphere(blockLoc, loc, radius)) {
                            const block = e.block.dimension.getBlock(getMaterial(blockLoc)); // Get block using getMaterial
                            const foundValidLog = validLogBlocks.find(logType => logType === block?.typeId);
                            // Check for any log type (modify as needed)
                            if (foundValidLog) {
                                foundLog = true; // Set flag if a log is found
                                break; // Exit the inner loop if a log is found within this layer
                            }
                        }
                    }
                }
                // Check the flag after processing a layer
                if (foundLog) {
                    break; // Exit the outermost loop if a log is found in any layer
                }
            }
            // Set block to air and spawn loot table only if no log was found
            if (!foundLog) {
                if (e.block.permutation.getState('pog:playerPlaced') === false) {
                    e.block.setType('air');
                    //e.block.dimension.runCommand(`loot spawn ${loc.x} ${loc.y} ${loc.z} loot "blocks/peach"`);
                }
            }

            // Helper function to potentially avoid unnecessary block lookups
            function getMaterial(blockLoc) {
                return blockLoc;
            }
        }

    });
})


