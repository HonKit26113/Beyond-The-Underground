// This code is from a template made by xxpoggylitxx. Thank you!


import { BlockCustomComponent, Vector3, system } from "@minecraft/server";

const LeavesDecay: BlockCustomComponent = {
    beforeOnPlayerPlace({permutationToPlace}) {
        permutationToPlace = permutationToPlace.withState('pog:playerPlaced' as any, true);
    },

    onTick({block}, {}) {
        const validLogBlocks = ["honkit26113:rainbow_gum_log"]
        const loc = block.location;
        const radius = 10; // Change this value to adjust the radius

        function isWithinSphere(blockLoc: Vector3, center: Vector3, radius: number) {
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
                        const b = block.dimension.getBlock(getMaterial(blockLoc)); // Get block using getMaterial
                        const foundValidLog = validLogBlocks.find(logType => logType === b?.typeId);
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
            if (block.permutation.getState('pog:playerPlaced' as any) === false) {
                block.setType('air');
                //e.block.dimension.runCommand(`loot spawn ${loc.x} ${loc.y} ${loc.z} loot "blocks/peach"`);
            }
        }

        // Helper function to potentially avoid unnecessary block lookups
        function getMaterial(blockLoc: Vector3) {
            return blockLoc;
        }
    }
}

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("honkit26113:leaves_decay", LeavesDecay);
});
