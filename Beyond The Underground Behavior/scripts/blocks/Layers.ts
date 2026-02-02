import { system, EquipmentSlot, BlockCustomComponent } from '@minecraft/server';
import { decrement_stack } from "../Functions";

const AddLayerComponent: BlockCustomComponent = {
    onPlayerInteract({block, player}, {}) {
		if (!player) return;
		const equipment = player.getComponent('equippable');
		const selectedItem = equipment?.getEquipment(EquipmentSlot.Mainhand);
		let sound: string;

		if (block.typeId == 'honkit26113:sand_layer' || block.typeId == 'honkit26113:slime_layer') {
			if (selectedItem?.typeId == 'honkit26113:sand_layer' || selectedItem?.typeId == 'honkit26113:slime_layer') {
				switch (block.typeId) {
					case "honkit26113:sand_layer":
						sound = 'dig.sand';
						break;
					case "honkit26113:slime_layer":
						sound = 'dig.slime';
						break;
				}
				const permutation = block.permutation;
				const currentLayerLevel = (permutation.getState('honkit26113:add_layer' as any) ?? 0) as number;

				if (currentLayerLevel < 7) {
					const newLayerLevel = currentLayerLevel + 1;
					const newPermutation = permutation.withState('honkit26113:add_layer' as any, newLayerLevel);
					block.setPermutation(newPermutation);
					block.dimension.playSound(sound, block.location);
					decrement_stack(player, false, 1);
				}
			}
		}
    }
};

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("honkit26113:add_layer", AddLayerComponent);
});

