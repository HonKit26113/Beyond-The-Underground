import { system, EquipmentSlot } from '@minecraft/server';
import { decrement_stack } from "../Functions";
function getAudioName(name) {
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
const doubleSlabComponent = {
    onPlayerInteract({ block, player, face }, { params }) {
        const equipment = player.getComponent('equippable');
        const selectedItem = equipment?.getEquipment(EquipmentSlot.Mainhand);
        if (block.typeId === selectedItem?.typeId && !block.permutation.getState('kai:double')) {
            // Check if the interaction is valid based on vertical half and face
            const verticalHalf = block.permutation.getState('minecraft:vertical_half');
            const isBottomUp = verticalHalf === 'bottom' && face === 'Up';
            const isTopDown = verticalHalf === 'top' && face === 'Down';
            if (isBottomUp || isTopDown) {
                decrement_stack(player, false, 1);
                // Set block to double and remove water if present
                block.setPermutation(block.permutation.withState('kai:double', true));
                player.playSound(`${getAudioName(params.sound)}`);
            }
        }
    }
};
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("honkit26113:make_double_slab", doubleSlabComponent);
});
//# sourceMappingURL=Slabs.js.map