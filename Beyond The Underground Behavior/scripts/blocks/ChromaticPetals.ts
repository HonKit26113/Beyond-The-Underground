import { system, EquipmentSlot, BlockCustomComponent } from '@minecraft/server';
import { decrement_stack } from "../Functions";

const AddCountComponent: BlockCustomComponent = {
    onPlayerInteract({block, player}, {}) {
		if (!block || !player) return;
		const equipment = player.getComponent('equippable');
		const selectedItem = equipment?.getEquipment(EquipmentSlot.Mainhand);

		if (selectedItem?.typeId === block.typeId && block.permutation.getState('honkit26113:count' as any) < 3) {
			decrement_stack(player, false, 1);
			
			const newState = (block.permutation.getState('honkit26113:count' as any)) + 1;
			block.setPermutation(block.permutation.withState('honkit26113:count' as any, newState));
			player.playSound('dig.grass', player);
		}
    }
};

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("honkit26113:add_count", AddCountComponent);
});

