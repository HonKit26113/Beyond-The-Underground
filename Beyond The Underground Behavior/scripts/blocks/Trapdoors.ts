import { system, BlockPermutation, BlockCustomComponent, Block } from '@minecraft/server';

export function toggleOpenTrapdoor(block: Block) {
	// Get the current state of the 'kai:open' block trait
	const currentState = block.permutation.getState('kai:open' as any);

	// Determine the new state of the 'kai:open' block trait (toggle between true and false)
	const newOpenState = !currentState;

	// Resolve the new block permutation based on the current block type and updated states
	const newPermutation = BlockPermutation.resolve(block.typeId, {
		...block.permutation.getAllStates(),
		'kai:open': newOpenState
	});

	// Set the block permutation to the newly resolved permutation
	block.setPermutation(newPermutation);

	// Determine the sound effect to play based on the current state of the trapdoor
	const sound = currentState ? 'open.wooden_trapdoor' : 'close.wooden_trapdoor';

	// Play the corresponding sound effect for opening or closing the trapdoor
	block.dimension.playSound(sound, block.location);
}

const trapdoorComponent: BlockCustomComponent = {
    onPlayerInteract({block}, {}) {
		toggleOpenTrapdoor(block);
    },
	onRedstoneUpdate({block}, {}) {
		toggleOpenTrapdoor(block);
	}
}

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("honkit26113:trapdoor", trapdoorComponent);
});

