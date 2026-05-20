import { world, ItemStack, system } from '@minecraft/server';
import { use_durability } from 'Functions.js';

const stoneTierTools = [
    "minecraft:stone_tier",
    "minecraft:iron_tier",
    "minecraft:gold_tier",
    "minecraft:diamond_tier"
]

const ironTierTools = [
    "minecraft:stone_tier",
    "minecraft:iron_tier"
]

const goldTierTools = [
    "minecraft:iron_tier",
    "minecraft:diamond_tier"
]

const diamondTierTools = [
    "minecraft:diamond_tier"
]

world.beforeEvents.playerBreakBlock.subscribe((data) => {
    const player = data.player;
    const block = data.block;
    const tool = player.getComponent("minecraft:inventory").container.getItem(player.selectedSlotIndex);

    // Terminates if player is in creative mode
    if (player.matches({gameMode:'creative'})) return;

    /*if (tool == undefined) {
        player.sendMessage(`undefined`);
    } else {
        player.sendMessage(`${tool.typeId}`);
    }*/

    /*// Terminates if not using right pickaxe
    // TODO: THIS FUNCTION NEEDS TO BE FIXED
    if ((block.hasTag("minecraft:stone_tier_destructible") && (!tool.getTags().includes(stoneTierTools)))
            || (block.hasTag("minecraft:iron_tier_destructible") && (!tool.getTags().includes(ironTierTools)))
            || (block.hasTag("minecraft:gold_tier_destructible") && (!tool.getTags().includes(goldTierTools)))
            || (block.hasTag("minecraft:diamond_tier_destructible") && (!tool.getTags().includes(diamondTierTools)))
            || (block.hasTag("minecraft:is_pickaxe_item_destructible") && tool == undefined)) {
        return;
    }*/

    detectSilkTouch(data, player, block, tool);

    doFortune(player, block, tool);
});

// Cancels out double-drop effect when using silk touch and returns custom set item
function detectSilkTouch(data, player, block, tool) {
    if (block.typeId.includes("honkit26113:")) {
        let silkTouchLevel = 0;
        // Get silk touch level of tool used to mine block
        try {
            silkTouchLevel = tool.getComponent("minecraft:enchantable").getEnchantment("silk_touch")?.level
        } catch (error) {
            return;
        }
        if (!block.hasTag("honkit26113:special_silk_touch_drop")) {
            if ((silkTouchLevel) > 0) {
                data.cancel = true;
                system.run(() => {
                    const drop_item = new ItemStack(block.typeId, 1);
                    player.dimension.spawnItem(drop_item, block.location);
                    block.setType("minecraft:air");
                    use_durability(player, tool, 1);
                })
            }
        } else {
            let tags = block.getTags();
            tags.forEach(tag => dropSilkTouchLoot(tag));

            function dropSilkTouchLoot(tag) {
                if (tag.includes("honkit26113:silk_touch_drop.")) {
                    let dotIndex = tag.indexOf(".");
                    let dashIndex = tag.indexOf("-");
                    
                    // Returns string starting from "." as the item's type ID
                    let dropId = tag.substring(dotIndex + 1, dashIndex);
                    // Returns string starting from "-" as amount to drop
                    let dropAmount = tag.substring(dashIndex + 1);
                    const drop_item = new ItemStack(dropId, dropAmount);
                    system.run(() => {
					    player.dimension.spawnItem(drop_item, block.location);
                    })
                }
            }
        }
    }
}

// Returns different amount of drops depending on fortune level
// MUST SET BLOCK TAG FOR THIS FUNCTION TO WORK!
function doFortune(player, block, tool) {
    let fortuneLevel = 0;
    try {
        fortuneLevel = tool.getComponent("minecraft:enchantable").getEnchantment("fortune")?.level
    } catch (error) {
        return;
    }
    let dropId = "";
    let baseAmount = 0;

    let tags = block.getTags();
    tags.forEach(tag => dropFortuneLoot(tag));

    function dropFortuneLoot(tag) {
        if (tag.includes("honkit26113:base_drop.")) {
            let dotIndex = tag.indexOf(".");
            let dashIndex = tag.indexOf("-");
            
            // Returns string starting from "&" as the item's type ID
            dropId = tag.substring(dotIndex + 1, dashIndex);
            // Returns string starting from "$" as base amount to drop
            baseAmount = tag.substring(dashIndex + 1);
        }
    }

    function spawnLoot(multiplier) {
        const drop_item = new ItemStack(dropId, baseAmount * multiplier);
        system.run(() => {
            player.dimension.spawnItem(drop_item, block.location);
        })
    }

    if (block.hasTag("honkit26113:use_fortune")) {
        const rand = Math.random() * 100;
        switch (fortuneLevel) {
            case 0: 
            default:
                spawnLoot(1);
                break;
            case 1:
                if (rand <= 67) {
                    spawnLoot(1);
                } else {
                    spawnLoot(2);
                }
                break;
            case 2:
                if (rand <= 50) {
                    spawnLoot(1);
                } else if (rand > 75) {
                    spawnLoot(2);
                } else {
                    spawnLoot(3);
                }
                break;
            case 3:
                if (rand <= 40) {
                    spawnLoot(1);
                } else if (rand >= 41 && rand <= 60) {
                    spawnLoot(2);
                } else if (rand >= 61 && rand <= 80) {
                    spawnLoot(3);
                } else {
                    spawnLoot(4);
                }
                break;
        }
    } else {
        spawnLoot(1);
    }
}