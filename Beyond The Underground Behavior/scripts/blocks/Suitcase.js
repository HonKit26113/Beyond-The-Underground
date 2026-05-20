import { system, BlockPermutation } from '@minecraft/server';
const SuitcaseComponent = {
    onPlayerInteract({ block, player }, {}) {
        if (!player)
            return;
        const { x, y, z } = block.location;
        const equipment = player.getComponent('equippable');
        //const selectedItem = equipment?.getEquipment(EquipmentSlot.Mainhand);
        //if(selectedItem?.typeId == "minecraft:emerald") {
        //decrement_stack(player, false, 1);
        if (block.permutation.getState("honkit26113:direction") == 0 || block.permutation.getState("minecraft:cardinal_direction") === 'north' || block.permutation.getState("minecraft:cardinal_direction") === 'south') {
            block.setType("honkit26113:suitcase_used");
        }
        else {
            block.setPermutation(BlockPermutation.resolve('honkit26113:suitcase_used', { "minecraft:cardinal_direction": 'east' }));
        }
        player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "suitcase.message.summoned" }] });
        player.dimension.spawnEntity("honkit26113:lost_explorer", { x: x, y: y + 1, z: z });
        //} else {
        //player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "suitcase.message.interact_with_emerald" }]});	
        //};
    }
};
const UsedSuitcaseComponent = {
    onPlayerInteract({ player }, {}) {
        player?.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "suitcase.message.used" }] });
    }
};
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("honkit26113:interact_suitcase", SuitcaseComponent);
    blockComponentRegistry.registerCustomComponent("honkit26113:interact_used_suitcase", UsedSuitcaseComponent);
});
//# sourceMappingURL=Suitcase.js.map