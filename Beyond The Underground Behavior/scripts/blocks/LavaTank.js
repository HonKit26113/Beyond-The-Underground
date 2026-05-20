import { system, EquipmentSlot, BlockPermutation, ItemStack, GameMode, BlockVolume } from '@minecraft/server';
import { decrement_stack } from "../Functions";
// The key must match the typeId of lava tanks
const LAVA_TANK_RADII = {
    "honkit26113:lava_tank_gold": 3,
    "honkit26113:lava_tank_diamond": 5
};
const PlaceLavaTankComponent = {
    onPlace({ block }, {}) {
        const blockBelow = block.below();
        const dim = block.dimension;
        const { x, y, z } = block.location;
        // Return if the block placed is not a lava tank (this should never happen)
        if (block.typeId !== "honkit26113:lava_tank_gold" && block.typeId !== "honkit26113:lava_tank_diamond")
            return;
        // Return if the block below the tank is not lava or flowing lava
        if (blockBelow?.typeId != "minecraft:lava" && blockBelow?.typeId != "minecraft:flowing_lava") {
            const players = dim.getPlayers({ location: block.location, maxDistance: 10 });
            for (const p of players) {
                p.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.error_not_above_lava" }] });
            }
            return;
        }
        const radius = LAVA_TANK_RADII[block.typeId];
        const volume = new BlockVolume({ x: x - radius, y: y - radius, z: z - radius }, { x: x + radius, y: y + radius, z: z + radius });
        const blocks = block.dimension.getBlocks(volume, { includeTypes: ["lava", "flowing_lava"] }).getBlockLocationIterator();
        for (const b of blocks) {
            dim.setBlockType(b, "minecraft:air");
        }
        dim.playSound("bucket.fill_lava", block.location);
        switch (block.typeId) {
            case "honkit26113:lava_tank_gold":
                block.setType("honkit26113:lava_tank_gold_full");
                break;
            case "honkit26113:lava_tank_diamond":
                block.setType("honkit26113:lava_tank_diamond_full");
                break;
        }
    }
};
const LavaTankErrorComponent = {
    onPlayerInteract({ block, player }, { params }) {
        if (!player)
            return;
        const state = params.type;
        const { x, y, z } = block.location;
        const spawnPos = { x: x + 0.5, y, z: z + 0.5 };
        switch (state) {
            case "locked":
                player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.locked" }] });
                block.dimension.spawnParticle("minecraft:critical_hit_emitter", spawnPos);
                block.dimension.playSound('block.false_permissions', block.location);
                break;
            case "broken":
                player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.broken" }] });
                block.dimension.spawnParticle("minecraft:cauldron_explosion_emitter", spawnPos);
                block.dimension.playSound('random.fizz', block.location);
                break;
            case "cooldown":
                player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.cooldown" }] });
                block.dimension.spawnParticle("minecraft:critical_hit_emitter", spawnPos);
                block.dimension.playSound('block.false_permissions', block.location);
                break;
            default:
                return console.error("invalid lava tank type");
        }
    }
};
const EmptyLavaTank = {
    onPlayerInteract({ block, player }, {}) {
        if (!player)
            return;
        const pickaxe_types = [
            "minecraft:diamond_pickaxe",
            "minecraft:netherite_pickaxe",
            "honkit26113:luminite_pickaxe"
        ];
        // Return if lava tank does not need emptying
        if (block.permutation.getState("honkit26113:obsidian") !== 1)
            return;
        const equipment = player.getComponent('equippable');
        const selectedItem = equipment?.getEquipment(EquipmentSlot.Mainhand);
        const drop_item = new ItemStack("minecraft:obsidian", 1);
        // Return if not holding correct pickaxe
        if (!pickaxe_types.includes(selectedItem?.typeId)) {
            player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.interact_with_pickaxe" }] });
            return;
        }
        player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.emptied" }] });
        block.dimension.playSound('dig.stone', block.location);
        player.dimension.spawnItem(drop_item, block.location);
        switch (block.typeId) {
            case "honkit26113:lava_tank_gold_full":
                block.setType("honkit26113:lava_tank_gold_cooldown");
                break;
            case "honkit26113:lava_tank_diamond_full":
                block.setType("honkit26113:lava_tank_diamond_cooldown");
                break;
        }
        // cooldown countdown
        let countdownSeconds = 5;
        const countdown = system.runInterval(() => {
            countdownSeconds--;
        }, 20);
        system.runTimeout(() => {
            system.clearRun(countdown);
            player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.cooldown_end" }] });
            switch (block.typeId) {
                case "honkit26113:lava_tank_gold_cooldown":
                    block.setType("honkit26113:lava_tank_gold");
                    break;
                case "honkit26113:lava_tank_diamond_cooldown":
                    block.setType("honkit26113:lava_tank_diamond");
                    break;
            }
        }, 140);
    }
};
const cooldownTank = {
    onPlayerInteract({ block, player }, {}) {
        if (!player)
            return;
        const equipment = player.getComponent('equippable');
        const selectedItem = equipment?.getEquipment(EquipmentSlot.Mainhand);
        if (block.permutation.getState("honkit26113:obsidian") === 0) {
            if (selectedItem?.typeId != "minecraft:water_bucket") {
                player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.interact_with_water" }] });
            }
            else {
                player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.cooling_down" }] });
                block.dimension.playSound('random.fizz', block.location);
                block.dimension.spawnParticle("minecraft:ice_evaporation_emitter", block.location);
                decrement_stack(player, false, 1);
                if (player.getGameMode() !== GameMode.Creative) {
                    const inventory = player.getComponent("minecraft:inventory")?.container;
                    inventory?.addItem(new ItemStack("minecraft:bucket", 1));
                }
                block.setPermutation(BlockPermutation.resolve(block.typeId, { "honkit26113:obsidian": 1 }));
            }
        }
    }
};
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("honkit26113:lava_tank_on_place", PlaceLavaTankComponent);
    blockComponentRegistry.registerCustomComponent("honkit26113:lava_tank_error", LavaTankErrorComponent);
    blockComponentRegistry.registerCustomComponent("honkit26113:empty_full_tank", EmptyLavaTank);
    blockComponentRegistry.registerCustomComponent("honkit26113:cool_down_tank", cooldownTank);
});
//# sourceMappingURL=LavaTank.js.map