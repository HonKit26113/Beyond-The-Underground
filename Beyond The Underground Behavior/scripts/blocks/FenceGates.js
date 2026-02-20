import { system, BlockPermutation } from '@minecraft/server';
// Function to calculate the new cardinal direction based on the player's rotation
function getNewCardinalDirection(currentDirection, angle) {
    const direction = directionDisplay(angle);
    if (['north', 'south'].includes(currentDirection)) {
        return direction.includes('south') ? 'south' : 'north';
    }
    else {
        return direction.includes('west') ? 'west' : 'east';
    }
}
// Function to calculate the direction a player is looking at
function directionDisplay(angle) {
    if (Math.abs(angle) > 112.5)
        return 'north';
    if (Math.abs(angle) < 67.5)
        return 'south';
    if (angle < 157.5 && angle > 22.5)
        return 'west';
    if (angle > -157.5 && angle < -22.5)
        return 'east';
    return '';
}
export function toggleOpenGate(block, player) {
    const currentState = block.permutation.getState('kai:open');
    const newOpenState = !currentState;
    const sound = newOpenState ? 'open.fence_gate' : 'close.fence_gate';
    if (player) {
        // Determine the new cardinal direction based on the player's rotation
        const rotationAngle = player.getRotation().y;
        const newCardinalDirection = getNewCardinalDirection(block.permutation.getState('minecraft:cardinal_direction'), rotationAngle);
        // Update the block's permutation with the new states
        const newPermutation = BlockPermutation.resolve(block.typeId, {
            ...block.permutation.getAllStates(),
            'kai:open': newOpenState,
            'minecraft:cardinal_direction': newCardinalDirection
        });
        block.setPermutation(newPermutation);
    }
    else {
        const newPermutation = BlockPermutation.resolve(block.typeId, {
            ...block.permutation.getAllStates(),
            'kai:open': newOpenState
        });
        block.setPermutation(newPermutation);
    }
    // Apply the new permutation and play the sound
    block.dimension.playSound(sound, block.location);
}
const FenceGateComponent = {
    onPlayerInteract({ block, player }, {}) {
        toggleOpenGate(block, player);
    },
    onRedstoneUpdate({ block }, {}) {
        if (block.permutation.getState('kai:open') === true)
            return; // if the gate is already open, powering it with redstone does nothing
        toggleOpenGate(block);
    },
};
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("honkit26113:fence_gate", FenceGateComponent);
});
//# sourceMappingURL=FenceGates.js.map