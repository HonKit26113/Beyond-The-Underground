import { system, EquipmentSlot, BlockCustomComponent } from '@minecraft/server';
import { decrement_stack } from "../Functions";

interface sound {
	"sound": ("wood" | "stone");
}

function getAudioName(name: string) {
	switch (name) {
		case "deepslate":
		case "nether_wood": 
			return `place.${name}`;
		case "glass": 
		case "stone":
		case "wood":
		default:
			return `use.${name}`;
	}
}

const doubleSlabComponent: BlockCustomComponent = {
    onPlayerInteract({block, player, face}, {params}) {
		const equipment = player.getComponent('equippable');
		const selectedItem = equipment?.getEquipment(EquipmentSlot.Mainhand);
		if (block.typeId === selectedItem?.typeId && !block.permutation.getState('kai:double' as any)) {
			// Check if the interaction is valid based on vertical half and face
			const verticalHalf = block.permutation.getState('minecraft:vertical_half');
			const isBottomUp = verticalHalf === 'bottom' && face === 'Up';
			const isTopDown = verticalHalf === 'top' && face === 'Down';
			if (isBottomUp || isTopDown) {
				decrement_stack(player, false, 1);
				// Set block to double and remove water if present
				block.setPermutation(block.permutation.withState('kai:double' as any, true));
				player.playSound(`${getAudioName((params as sound).sound)}`);
			}
		}
    }
};

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("honkit26113:make_double_slab", doubleSlabComponent);
});

