import { system, EquipmentSlot, BlockPermutation } from '@minecraft/server';
import { use_durability } from "../Functions";
const StripLogComponent = {
    onPlayerInteract({ block, player }, {}) {
        if (!player)
            return;
        const equipment = player.getComponent('equippable');
        const selectedItem = equipment?.getEquipment(EquipmentSlot.Mainhand);
        if (!selectedItem?.hasTag('minecraft:is_axe'))
            return;
        if (block.typeId.includes("log") || block.typeId === "honkit26113:crooked_stem") {
            const blockState = block.permutation.getState("minecraft:block_face") ?? "up";
            block.setPermutation(BlockPermutation.resolve(block.typeId + '_stripped', { "minecraft:block_face": blockState }));
        }
        else {
            block.setType(block.typeId + '_stripped');
        }
        player.playSound('step.wood');
        use_durability(player, selectedItem, 1);
    }
};
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("honkit26113:strip_log", StripLogComponent);
});
//# sourceMappingURL=StripLog.js.map