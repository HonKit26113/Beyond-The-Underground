import { system, world, EquipmentSlot } from '@minecraft/server';
import { decrement_stack } from "../Functions";
const GrowGiantComponent = {
    onPlayerInteract({ block, player }, {}) {
        if (!player)
            return;
        const equipment = player.getComponent('equippable');
        const selectedItem = equipment?.getEquipment(EquipmentSlot.Mainhand);
        if (!selectedItem)
            return;
        const { x, y, z } = block.location;
        const dim = block.dimension;
        // giant mushrooms
        if ((block.typeId == "honkit26113:luminous_mushroom" || block.typeId == "honkit26113:gloomy_mushroom") && selectedItem.typeId == "minecraft:bone_meal") {
            dim.playSound('item.bone_meal.use', block.location);
            dim.spawnParticle("minecraft:crop_growth_emitter", block.location);
            decrement_stack(player, false, 1);
            const rand = Math.floor(Math.random() * 10) + 1; // generate number from 1 to 10 inclusive
            if (rand > 6) { // 40% chance
                switch (block.typeId) {
                    case "honkit26113:luminous_mushroom":
                        world.structureManager.place("mystructure:giant_luminous_mushroom", dim, { x: x - 2, y, z: z - 2 });
                        break;
                    case "honkit26113:gloomy_mushroom":
                        world.structureManager.place("mystructure:giant_gloomy_mushroom", dim, { x: x - 3, y, z: z - 3 });
                        break;
                }
            }
        }
        // giant crooked fungus
        if (block.typeId == "honkit26113:crooked_fungus" && block.below()?.typeId == "honkit26113:crooked_nylium" && selectedItem?.typeId == "minecraft:bone_meal") {
            dim.playSound('item.bone_meal.use', block.location);
            dim.spawnParticle("minecraft:crop_growth_emitter", block.location);
            decrement_stack(player, false, 1);
            const rand = Math.floor(Math.random() * 10) + 1; // generate number from 1 to 10 inclusive
            if (rand > 6) { // 40% chance
                block.below()?.setType("minecraft:netherrack");
                const typeRand = Math.floor(Math.random() * 6) + 1; // generate number from 1 to 6 inclusive
                switch (typeRand) {
                    case 1: // 1 in 6
                        world.structureManager.place("mystructure:crooked_fungus_big_1", dim, { x: x - 10, y, z: z - 3 });
                        break;
                    case 2: // 1 in 6
                        world.structureManager.place("mystructure:crooked_fungus_big_1_rotated_90", dim, { x: x - 3, y, z: z - 10 });
                        break;
                    default: // 4 in 6
                        world.structureManager.place("mystructure:crooked_fungus_small_1", dim, { x: x - 2, y, z: z - 2 });
                }
            }
        }
    }
};
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("honkit26113:grow_giant", GrowGiantComponent);
});
//# sourceMappingURL=GrowGiant.js.map