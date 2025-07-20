// This code is adapted from Kaioga's Block Templates. Thank you!

import { world, system, BlockPermutation, BlockTypes, ItemStack } from '@minecraft/server';
import { decrement_stack, use_durability } from '../functions.js';


// Function to calculate the new cardinal direction based on the player's rotation
function getNewCardinalDirection(currentDirection, angle) {
    const direction = directionDisplay(angle);
    if (['north', 'south'].includes(currentDirection)) {
        return direction.includes('south') ? 'south' : 'north';
    } else {
        return direction.includes('west') ? 'west' : 'east';
    }
}

// Function to calculate the direction a player is looking at
function directionDisplay(angle) {
    if (Math.abs(angle) > 112.5) return 'north';
    if (Math.abs(angle) < 67.5) return 'south';
    if (angle < 157.5 && angle > 22.5) return 'west';
    if (angle > -157.5 && angle < -22.5) return 'east';
    return '';
}


world.beforeEvents.worldInitialize.subscribe(eventData => {
    eventData.blockComponentRegistry.registerCustomComponent('kai:door_on_interact', {
        // Define the behavior when a player interacts with the door block
        onPlayerInteract(e) {
            // Destructure event data for easier access
            const { block, player } = e;
            const isUpperBlock = block.permutation.getState('kai:upper_block_bit');

            // Get the equipment component for the player
            const equipment = player.getComponent('equippable');

            // Get the selected item from the player's mainhand
            const selectedItem = equipment.getEquipment('Mainhand');
            
            // Determine the target block to update
            const targetBlock = isUpperBlock ? block.below() : block.above();

            // Get the current state of the 'kai:open_bit' block trait for both the interacted block and the target block
            const currentOpenState = block.permutation.getState('kai:open_bit');
            const targetOpenState = targetBlock.permutation.getState('kai:open_bit');

            // Determine the new state of the 'kai:open_bit' block trait (toggle between true and false)
            const newOpenState = !currentOpenState;
            const newTargetOpenState = !targetOpenState;

            // Resolve the new block permutation based on the current block type and updated states
            const newBlockPermutation = BlockPermutation.resolve(block.typeId, {
                ...block.permutation.getAllStates(),
                'kai:open_bit': newOpenState
            });

            const newTargetBlockPermutation = BlockPermutation.resolve(targetBlock.typeId, {
                ...targetBlock.permutation.getAllStates(),
                'kai:open_bit': newTargetOpenState
            });

            // Set the block permutations to the newly resolved permutations
            block.setPermutation(newBlockPermutation);
            targetBlock.setPermutation(newTargetBlockPermutation);

            // Determine the sound effect to play based on the current state of the door
            const sound = currentOpenState ? 'close.wooden_door' : 'open.wooden_door';

            // Play the corresponding sound effect for opening or closing the door
            player.playSound(sound);
        }
    });

    // Register a custom component named kai:on_interact for trapdoor interaction
    eventData.blockComponentRegistry.registerCustomComponent('kai:trapdoor_on_interact', {
        // Define the behavior when a player interacts with the trapdoor block
        onPlayerInteract(e) {
            // Destructure event data for easier access
            const { block, player } = e;

            // Get the current state of the 'kai:open' block trait
            const currentState = block.permutation.getState('kai:open');

            // Determine the new state of the 'kai:open' block trait (toggle between true and false)
            const newOpenState = !currentState;

            // Resolve the new block permutation based on the current block type and updated states
            const newPermutation = BlockPermutation.resolve(block.typeId, {
                ...block.permutation.getAllStates(),
                'kai:open': newOpenState
            });

            // Set the block permutation to the newly resolved permutation
            block.setPermutation(newPermutation);

            // Determine the sound effect to play based on the current state of the trapdoor
            const sound = currentState ? 'open.wooden_trapdoor' : 'close.wooden_trapdoor';

            // Play the corresponding sound effect for opening or closing the trapdoor
            player.playSound(sound);
        }
    });

    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:fence_gate_on_interact', {
        // Define the behavior when a player interacts with the fence gate
        onPlayerInteract(e) {
            // Destructure event data for easier access
            const { block, player, face } = e;

            // Get the equipment component for the player
            const equipment = player.getComponent('equippable');
            // Get the selected item from the player's mainhand
            const selectedItem = equipment.getEquipment('Mainhand');

            // Check if a player tried to place a block on top of the fence gate
            if (selectedItem && face === 'Up' && BlockTypes.get(selectedItem.typeId)) {
                // Calculate the position above the current block
                const aboveBlock = block.above();

                // If the block above is a kai:fence_gate (an equivalent of air)...
                if (aboveBlock.typeId === 'honkit26113:crooked_fence_gate' || aboveBlock.typeId === 'honkit26113:rainbow_gum_fence_gate') {
                    // ...place the selected block above the current block
                    aboveBlock.setType(selectedItem.typeId);
                    
                    // Reduce item count if not in creative mode
                    if (player.getGameMode() !== "creative") {
                        if (selectedItem.amount > 1) {
                            selectedItem.amount -= 1;
                            equipment.setEquipment('Mainhand', selectedItem);
                        } else {
                            equipment.setEquipment('Mainhand', undefined); // Clear the slot if only 1 item left
                        }
                    }
                    return; // Exit the function after placing the block
                }
            }

            // Toggle the 'kai:open' state between false and true and determine the sound effect to play
            const currentState = block.permutation.getState('kai:open');
            const newOpenState = !currentState;
            const sound = newOpenState ? 'open.fence_gate' : 'close.fence_gate';

            // Determine the new cardinal direction based on the player's rotation
            const rotationAngle = player.getRotation().y;
            const newCardinalDirection = getNewCardinalDirection(block.permutation.getState('minecraft:cardinal_direction'), rotationAngle);

            // Update the block's permutation with the new states
            const newPermutation = BlockPermutation.resolve(block.typeId, {
                ...block.permutation.getAllStates(),
                'kai:open': newOpenState,
                'minecraft:cardinal_direction': newCardinalDirection
            });

            // Apply the new permutation and play the sound
            block.setPermutation(newPermutation);
            block.dimension.playSound(sound, block.location);

            // Corrected: Remove redeclaration of aboveBlock
            const aboveBlock = block.above();
            // Checks if the block above our fence gate is an invisible fence gate (equivalent to air)
            if (aboveBlock.typeId === 'kai:fence_gate' && aboveBlock.permutation.getState('kai:invisible')) {
                const aboveCurrentState = aboveBlock.permutation.getState('kai:open');
                // Update kai:open state of the invisible fence gate above our fence gate
                if (aboveCurrentState !== newOpenState) {
                    const newAbovePermutation = BlockPermutation.resolve(aboveBlock.typeId, {
                        ...aboveBlock.permutation.getAllStates(),
                        'kai:open': newOpenState
                    });
                    aboveBlock.setPermutation(newAbovePermutation);
                }
            }
        }
    });

    // sand and slime layers
    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:add_layer', {
        onPlayerInteract(e) {
            const { block, player } = e;

            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment('Mainhand');
            let sound;

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
                    const currentLayerLevel = permutation.getState('honkit26113:add_layer');

                    if (currentLayerLevel <= 6) {
                        e.cancel = true;
                        const newLayerLevel = currentLayerLevel + 1;
                        const newPermutation = permutation.withState('honkit26113:add_layer', newLayerLevel);
                        block.setPermutation(newPermutation);
                        block.dimension.playSound(sound, block.location);
                        decrement_stack(player, false, 1);
                    }
                }

                if (selectedItem?.typeId == 'minecraft:torch' || selectedItem?.typeId == 'minecraft:soul_torch' || selectedItem?.typeId == 'minecraft:redstone_torch') {
                    block.setType(selectedItem?.typeId)
                    decrement_stack(player, false, 1);
                }
            }
        }
    });

    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:spawn_explorer', {
        onPlayerInteract(e) {
            const { block, player } = e;
            const {x, y, z} = block.location;
            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment('Mainhand');
            
            if(selectedItem?.typeId == "minecraft:emerald") {
                decrement_stack(player, false, 1)
                if (block.permutation.getState( "honkit26113:direction" ) == 0 || block.permutation.getState( "minecraft:cardinal_direction" ) === 'north' || block.permutation.getState( "minecraft:cardinal_direction" ) === 'south') {
                    block.setType("honkit26113:suitcase_used");
                } else {
                    block.setPermutation(BlockPermutation.resolve('honkit26113:suitcase_used', {"minecraft:cardinal_direction": 'east'}))
                }
                player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "suitcase.message.summoned" }]});
                player.dimension.spawnEntity("honkit26113:lost_explorer", {x: x, y: y + 1, z: z});
            } else {
                player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "suitcase.message.interact_with_emerald" }]});	
            };
        }
    });

    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:used_suitcase_error', {
        onPlayerInteract(e) {
            const { player } = e;
            player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "suitcase.message.used" }]});
        }
    });

    // strip logs / wood
    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:strip_log', {
        onPlayerInteract(e) {
            const { block, player } = e;

            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment('Mainhand');

            if (!selectedItem?.hasTag('minecraft:is_axe')) return;

            if (block.typeId.includes("log")) {
                const blockState = block.permutation.getState("minecraft:block_face");
                block.setPermutation(BlockPermutation.resolve(block.typeId + '_stripped', {"minecraft:block_face": blockState}));
            } else {
                block.setType(block.typeId + '_stripped');
            }
            player.playSound('step.wood');
            use_durability(player, selectedItem, 1);
        }
    });

    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:grow_giant', {
        onPlayerInteract(e) {
            
            const { block, player } = e;
            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment('Mainhand');
            const { x, y, z } = block.location;

            // giant mushrooms
            if((block.typeId == "honkit26113:luminous_mushroom" || block.typeId == "honkit26113:gloomy_mushroom" ) && selectedItem?.typeId == "minecraft:bone_meal") { 
                block.dimension.playSound('item.bone_meal.use', block.location);
                block.dimension.spawnParticle("minecraft:crop_growth_emitter", block.location);
                decrement_stack(player, false, 1);
                const rand = Math.floor(Math.random() * 10) + 1; // generate number from 1 to 10 inclusive
                if (rand > 6) { // 40% chance
                    switch (block.typeId) {
                        case "honkit26113:luminous_mushroom": 
                            player.runCommand(`structure load mystructure:giant_luminous_mushroom ${x-2} ${y} ${z-2}`);
                            break;
                        case "honkit26113:gloomy_mushroom": 
                            player.runCommand(`structure load mystructure:giant_gloomy_mushroom ${x-3} ${y} ${z-3}`);
                            break;
                    }
                }
            }

            // giant crooked fungus
            if(block.typeId == "honkit26113:crooked_fungus" && block.below().typeId == "honkit26113:crooked_nylium" && selectedItem?.typeId == "minecraft:bone_meal") { 
                block.dimension.playSound('item.bone_meal.use', block.location);
                block.dimension.spawnParticle("minecraft:crop_growth_emitter", block.location);
                decrement_stack(player, false, 1);
                const rand = Math.floor(Math.random() * 10) + 1; // generate number from 1 to 10 inclusive
                if (rand > 6) { // 40% chance
                    block.below().setType("minecraft:netherrack");
                    const type_rand = Math.floor(Math.random() * 6) + 1; // generate number from 1 to 6 inclusive
                    if (type_rand <= 4) { // 4 in 6 chance
                        player.runCommand(`structure load mystructure:crooked_fungus_small_1 ${x-2} ${y} ${z-2}`);
                    } else if (type_rand == 5) { // 1 in 6 chance
                        player.runCommand(`structure load mystructure:crooked_fungus_big_1 ${x-10} ${y} ${z-3}`);
                    } else player.runCommand(`structure load mystructure:crooked_fungus_big_1_rotated_90 ${x-3} ${y} ${z-10}`);
                }
            }
        }
    });

    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:lava_tank_error', {
        onPlayerInteract(e) {
            const { block, player } = e;

            // locked lava tanks
            if(block.typeId == "honkit26113:lava_tank_gold_locked" || block.typeId == "honkit26113:lava_tank_diamond_locked") { 
                player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.locked" }]});
                block.dimension.spawnParticle("minecraft:critical_hit_emitter", block.location);
                block.dimension.playSound('random.anvil_land', block.location);
            }

            // broken lava tanks
            if(block.typeId == "honkit26113:lava_tank_broken") { 
                player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.broken" }]});
                block.dimension.spawnParticle("minecraft:cauldron_explosion_emitter", block.location)
                block.dimension.playSound('random.fizz', block.location);
            }

            // cooling down lava tanks
            if(block.typeId == "honkit26113:lava_tank_gold_cooldown" || block.typeId == "honkit26113:lava_tank_diamond_cooldown") { 
                player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.cooldown" }]});
                block.dimension.spawnParticle("minecraft:critical_hit_emitter", block.location);
                block.dimension.playSound('random.anvil_land', block.location);
            }

        }
    });

    // empty lava tank
    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:empty_full_tank', {
        onPlayerInteract(e) {
            const pickaxe_types = [
                "minecraft:diamond_pickaxe",
                "minecraft:netherite_pickaxe",
                "honkit26113:luminite_pickaxe"
            ];
            const { block, player } = e;
            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment('Mainhand');

            if(block.permutation.getState( "honkit26113:obsidian" ) == 1) {
                const drop_item = new ItemStack("minecraft:obsidian", 1);

                if (pickaxe_types.includes(selectedItem?.typeId)) {
                    player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.emptied" }]});
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
    
                    // cooling down countdown
                    var count_secs = 5;
                    const countdown = system.runInterval(() => {
                        count_secs--;
                    }, 20);
                        
                    system.runTimeout(() => {
                        system.clearRun(countdown);
                        player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.cooldown_end" }]});
                        switch (block.typeId) {
                            case "honkit26113:lava_tank_gold_cooldown": 
                                block.setType("honkit26113:lava_tank_gold");
                                break;
                            case "honkit26113:lava_tank_diamond_cooldown": 
                                block.setType("honkit26113:lava_tank_diamond");
                                break;
                        }
                    }, 140);
                } else {
                    player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.interact_with_pickaxe" }]});
                }
            }

        }
    });

    // cool down tank from lava to obsidian
    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:cool_down_tank', {
        onPlayerInteract(e) {
            const { block, player } = e;
            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment('Mainhand');

            if(block.permutation.getState( "honkit26113:obsidian" ) == 0) { 
                if(selectedItem?.typeId != "minecraft:water_bucket") {
                    player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.interact_with_water" }]});
                } else {
                    player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.cooling_down" }]});
                    block.dimension.playSound('random.fizz', block.location);
                    block.dimension.spawnParticle("minecraft:ice_evaporation_emitter", block.location);
                    decrement_stack(player, false, 1);

                    if (!player.matches({gameMode:'creative'})) {
                        const inventory = player.getComponent("minecraft:inventory").container;
                        inventory.addItem(new ItemStack("minecraft:bucket", 1));
                    }
                    block.setPermutation(BlockPermutation.resolve(block.typeId, {"honkit26113:obsidian": 1}));    
                }
            }

        }
    });

    // new slab interaction 
    eventData.blockComponentRegistry.registerCustomComponent('kai:slab_on_interact', {
        // Define the behavior when a player interacts with the slab
        onPlayerInteract(e) {
            // Destructure event data for easier access
            const { block, player, face } = e;

            // Get the equipment component for the player
            const equipment = player.getComponent('equippable');

            // Get the selected item from the player's mainhand
            const selectedItem = equipment.getEquipment('Mainhand');

            // Check if the selected item is a slab and the block is not already double
            if (selectedItem?.typeId === block.typeId && !block.permutation.getState('kai:double')) {
                // Check if the interaction is valid based on vertical half and face
                const verticalHalf = block.permutation.getState('minecraft:vertical_half');
                const isBottomUp = verticalHalf === 'bottom' && face === 'Up';
                const isTopDown = verticalHalf === 'top' && face === 'Down';
                if (isBottomUp || isTopDown) {
                    // Reduces item count if not in creative mode
                    if (player.getGameMode() !== "creative") {
                        selectedItem.amount -= 1;
                        // Clear or update selected slot based on item count
                        if (selectedItem.amount === 0) {
                            equipment.setEquipment('Mainhand', undefined);
                        } else {
                            equipment.setEquipment('Mainhand', selectedItem);
                        }
                    }
                    // Set block to double and remove water if present
                    block.setPermutation(block.permutation.withState('kai:double', true));
                    block.setWaterlogged(false);
                    // Play sound effect
                    player.playSound('use.wood');
                }
            }
        }
    });

    // make double slabs
    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:make_double', {
        onPlayerInteract(e) {
            const { block, player, face } = e;

            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment('Mainhand');

            const slabs = [
                "honkit26113:crooked_slab",
                "honkit26113:frosted_stone_slab",
                "honkit26113:limestone_bricks_slab",
                "honkit26113:limestone_slab",
                "honkit26113:packed_ice_bricks_slab",
                "honkit26113:slimy_deepslate_bricks_slab",
                "honkit26113:slimy_deepslate_tiles_slab",
                "honkit26113:slimy_stone_bricks_slab",
                "honkit26113:soul_bricks_slab"
            ]

            if (slabs.includes(selectedItem?.typeId) && block.typeId === selectedItem?.typeId && !block.permutation.getState('kai:double')) {
                // Check if the interaction is valid based on vertical half and face
                const verticalHalf = block.permutation.getState('minecraft:vertical_half');
                const isBottomUp = verticalHalf === 'bottom' && face === 'Up';
                const isTopDown = verticalHalf === 'top' && face === 'Down';
                if (isBottomUp || isTopDown) {
                    decrement_stack(player, false, 1);
                    // Set block to double and remove water if present
                    block.setPermutation(block.permutation.withState('kai:double', true));
                    player.playSound('use.stone');
                }
            }
        }
    });

    // chromatic petals
    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:count', {
        onPlayerInteract(e) {
            const { block, player } = e;

            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment('Mainhand');

            if (selectedItem?.typeId === block.typeId && block.permutation.getState('honkit26113:count') < 3) {
                decrement_stack(player, false, 1);
                block.setPermutation(block.permutation.withState('honkit26113:count', block.permutation.getState('honkit26113:count') + 1));
                player.playSound('dig.grass', player);
            }
        }
    });
});