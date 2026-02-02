import { world, ItemStack, system, GameMode } from '@minecraft/server';
import { use_durability } from 'Functions.js';

const special_vines = [
    "honkit26113:radiant_vines_body",
    "honkit26113:radiant_vines_head",
    "honkit26113:dripping_slime_body",
    "honkit26113:dripping_slime_head",
    "honkit26113:sandy_roots_body",
    "honkit26113:sandy_roots_head"
]

const dripping_icicles = [
    "honkit26113:dripping_icicles_medium",
    "honkit26113:dripping_icicles_small"
]

const slabs = [
    "honkit26113:frosted_stone_slab",
    "honkit26113:limestone_bricks_slab",
    "honkit26113:limestone_slab",
    "honkit26113:packed_ice_bricks_slab",
    "honkit26113:slimy_deepslate_bricks_slab",
    "honkit26113:slimy_deepslate_tiles_slab",
    "honkit26113:slimy_stone_bricks_slab",
    "honkit26113:soul_bricks_slab",
    "honkit26113:crooked_slab",
    "honkit26113:rainbow_gum_slab"
]

world.beforeEvents.playerBreakBlock.subscribe((data) => {
    const player = data.player;
    const block = data.block;
    const tool = player.getComponent("minecraft:inventory").container.getItem(player.selectedSlotIndex);
    let silkTouchLevel = 0;

    // Terminates if player is in creative mode
    if (player.getGameMode() === GameMode.Creative) return;

    try {
        silkTouchLevel = tool.getComponent("minecraft:enchantable").getEnchantment("silk_touch")?.level
    } catch (error) {
        return;
    }

    if (special_vines.includes(block.typeId)) { 
        system.run(() => {
            if (silkTouchLevel > 0) {
                data.cancel = true;
                use_durability(player, item, 1);
                block.setType("minecraft:air");
                const drop_item = new ItemStack(block.typeId.replace("_head", "_item").replace("_body", "_item"), 1);
                player.dimension.spawnItem(drop_item, block.location);
            }
        })
        return;
    }

    if (dripping_icicles.includes(block.typeId)) { 
        system.run(() => {
            if (silkTouchLevel > 0) {
                data.cancel = true;
                use_durability(player, item, 1);
                block.setType("minecraft:air");
                const drop_item = new ItemStack(block.typeId.replace("_small", "_item").replace("_medium", "_item"), 1);
                player.dimension.spawnItem(drop_item, block.location);
            }
        })
        return;
    }

    if (slabs.includes(block.typeId) && (block.permutation.getState( "honkit26113:placeontopside" ) == 6 || block.permutation.getState( "kai:double" ))) { 
        system.run(() => {
            if (silkTouchLevel > 0) {
                data.cancel = true;
                use_durability(player, item, 1);
                block.setType("minecraft:air");
                const drop_item = new ItemStack(block.typeId, 2);
                player.dimension.spawnItem(drop_item, block.location);
            }
        })
        return;
    }
});