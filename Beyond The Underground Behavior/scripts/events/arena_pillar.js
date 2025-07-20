import { world, system, BlockPermutation, ItemStack } from '@minecraft/server';


var entity_count = 7;
world.beforeEvents.worldInitialize.subscribe(eventData => {

    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:arena_ask_for_confirmation', {
        onPlayerInteract(e) {
            const { block, player } = e;
            if (world.getDynamicProperty("honkit26113:countdown_ongoing") == true) {
                player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "arena.message.wait" }]});
            } else {
                block.setPermutation(BlockPermutation.resolve(block.typeId, {"honkit26113:started": 1}))
                player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "arena.message.confirmation" }]});
                world.sendMessage({ "rawtext": [{ "translate": "arena.message.check_difficulty" }]});
            }
        }
    });
    
    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:arena_cancel', {
        onTick(e) {
            const { block } = e;
            block.setPermutation(BlockPermutation.resolve(block.typeId, {"honkit26113:started": 0}))
            block.dimension.runCommand(`titleraw @a[r=20] actionbar { "rawtext": [{ "translate": "arena.message.cancel" }]}`);
        }
    });
    
    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:arena_confirmed', {
        onPlayerInteract(e) {
            const { block, player } = e;
            const {x, y, z} = block.location;

            world.setDynamicProperty("honkit26113:arena_over", 1); // ongoing
            world.setDynamicProperty("honkit26113:countdown_ongoing", true);
            block.dimension.playSound('block.bell.hit', block.location, {volume: 4})
            block.setPermutation(BlockPermutation.resolve(block.typeId, {"honkit26113:started": 2}))
            block.below(1).setPermutation(BlockPermutation.resolve(block.below(1)?.typeId, {"honkit26113:activated": true}))
            block.below(2).setPermutation(BlockPermutation.resolve(block.below(2)?.typeId, {"honkit26113:activated": true}))
            block.below(3).setPermutation(BlockPermutation.resolve(block.below(3)?.typeId, {"honkit26113:activated": true}))
            var count_secs = 3;
            const countdown = system.runInterval(() => {
                player.onScreenDisplay.setActionBar([{ "rawtext": [{ "translate":"arena.message.starting_in" }]}, { "text": " §6[0:0" }, { "text": count_secs.toString() }, { "text": "]§r!" }]);
                count_secs--;
            }, 20);
            
            system.runTimeout(() => {
                system.clearRun(countdown);
                player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "arena.message.battle_start" }]});

                block.dimension.spawnEntity('honkit26113:arena_entity_counter', block.location)
                block.dimension.spawnEntity('honkit26113:arena_countdown', block.location)
                for (let i = 0; i < 4; i++) {
                    block.dimension.spawnEntity('honkit26113:arena_sandy_skelly_placeholder', { x: x+Math.round(Math.random()*9+1)-5, y: y-3, z: z+Math.round(Math.random()*9+1)-5 }).addTag('honkit26113.is_arena_placeholder');;
                }
                for (let i = 0; i < 3; i++) {
                    block.dimension.spawnEntity('honkit26113:arena_scorpion_placeholder', { x: x+Math.round(Math.random()*9+1)-5, y: y-3, z: z+Math.round(Math.random()*9+1)-5 }).addTag('honkit26113.is_arena_placeholder');; 
                }
                //block.dimension.runCommand(`execute positioned ${x} ${y-2} ${z} run spreadplayers ${x} ${z} 0.01 1.01 @e[tag=honkit26113.is_arena_placeholder,r=10]`);
                //block.dimension.runCommand(`spreadplayers ${x} ${z} 0.1 1.2 @e[tag=honkit26113.is_arena_placeholder,r=10]`);
                block.dimension.runCommand(`execute positioned ${x} ${y} ${z} run camerashake add @a[r=40] 1 1 positional`);
            }, 80);
            
            world.stopMusic();
            const musicOptions = {
                fade: 0.5,
                loop: false,
                volume: 1.0,
            };
            world.playMusic("music.arena", musicOptions);
        }
    });

    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:check_for_finish_round', {
        onTick(e) {
            const { block, player } = e;
            // 1 == ongoing battle
            // 2 == victory
            // 3 == defeat

            if (world.getDynamicProperty("honkit26113:arena_over") == 2) { // victory
                block.dimension.runCommand(`title @a times 20 120 30`)
                block.dimension.runCommand(`title @a title `)
                block.dimension.runCommand(`titleraw @a subtitle { "rawtext": [{ "translate": "arena.message.victory" }]}`)
                block.dimension.runCommand(`title @a reset`)
                world.setDynamicProperty("honkit26113:arena_over", 0) // battle over
                block.setPermutation(BlockPermutation.resolve(block.typeId, {"honkit26113:started": 3}))
                world.playSound("arena.complete", block.location, {pitch: 1, volume: 3})
                block.dimension.getEntities({ type: "honkit26113:arena_entity_counter", location: block.location}).forEach(entity => {
                    entity.getComponent('health').setCurrentValue(0);
                })
                block.dimension.getEntities({ type: "honkit26113:arena_countdown", location: block.location}).forEach(entity => {
                    entity.getComponent('health').setCurrentValue(0);
                })
                block.dimension.spawnItem(new ItemStack("honkit26113:sandy_skelly_skull", 1), block.location);
                block.dimension.spawnItem(new ItemStack("honkit26113:sandstone_stick", 1), block.location);
                block.dimension.spawnItem(new ItemStack("minecraft:diamond", 10), block.location);
                world.stopMusic();
                entity_count = 7;
            }

            if (world.getDynamicProperty("honkit26113:arena_over") == 3) { // defeat
                block.dimension.runCommand(`title @a times 20 120 30`)
                block.dimension.runCommand(`title @a title `)
                block.dimension.runCommand(`titleraw @a subtitle { "rawtext": [{ "translate": "arena.message.defeat" }]}`)
                block.dimension.runCommand(`title @a reset`)
                world.setDynamicProperty("honkit26113:arena_over", 0) // battle over
                block.setPermutation(BlockPermutation.resolve(block.typeId, {"honkit26113:started": 3}))
                block.dimension.getEntities({ type: "honkit26113:arena_entity_counter", location: block.location}).forEach(entity => {
                    entity.getComponent('health').setCurrentValue(0);
                })
                block.dimension.getEntities({ type: "honkit26113:arena_countdown", location: block.location}).forEach(entity => {
                    entity.getComponent('health').setCurrentValue(0);
                })
                world.stopMusic();
                entity_count = 7;
            }

            if (world.getDynamicProperty('honkit26113:arena_over') != 1 && block.dimension.getEntities({ type: "honkit26113:arena_entity_counter", location: block.location}).length == 0 && block.dimension.getEntities({ type: "honkit26113:arena_countdown", location: block.location}).length == 0) {
                block.setPermutation(BlockPermutation.resolve(block.typeId, {"honkit26113:started": 3}))
            }
        }
    });

    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:arena_pillar_used_error', {
        onPlayerInteract(e) {
            const { block, player } = e;
            player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "arena.message.pillar_used" }]});
        }
    });
    
    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:check_arena_status', {
        onTick(e) {
            const { block } = e;
            if (world.getDynamicProperty("honkit26113:arena_over") == 0) {
                block.setPermutation(BlockPermutation.resolve(block.typeId, {"honkit26113:activated": false}))
            }
        }
    });
});

world.afterEvents.entityDie.subscribe((data) => {
    const arena_mobs = [
        "honkit26113:scorpion",
        "honkit26113:sandy_skelly"
    ];
	const entity = data.deadEntity;
    
    if (arena_mobs.includes(entity.typeId) && entity.hasTag("honkit26113.is_from_arena")) {
        const arena_placeholder = entity.dimension.getEntities({
            type: "honkit26113:arena_entity_counter",
            location: entity.location
        })
        entity_count--;
        arena_placeholder.forEach(entity => {
            entity.getComponent('health').setCurrentValue(entity_count);
        })
        if (entity_count == 0) {
            world.setDynamicProperty("honkit26113:arena_over", 2); // victory
        }
    }
    if (entity.typeId == 'honkit26113:arena_countdown' && world.getDynamicProperty("honkit26113:arena_over") == 1) {
        world.setDynamicProperty("honkit26113:arena_over", 3); // defeat
    }
})

world.afterEvents.entitySpawn.subscribe((data) => {
	const entity = data.entity;
    if (entity.typeId === 'honkit26113:arena_countdown') {
        var count_secs = 180;
        const countdown = system.runInterval(() => {
            count_secs--;
            if (world.getDynamicProperty("honkit26113:countdown_ongoing") == true) {
                entity.getComponent('health').setCurrentValue(count_secs);
                if (entity_count == 0) {
                    system.clearRun(countdown); 
                }
            }
        }, 20);
        
        system.runTimeout(() => {
            system.clearRun(countdown);
            world.setDynamicProperty("honkit26113:countdown_ongoing", false)
        }, 3600);
    }

    const arena_mobs = [
        'honkit26113:arena_sandy_skelly_placeholder',
        'honkit26113:arena_scorpion_placeholder'
    ]

    if (arena_mobs.includes(entity.typeId)) {
        system.runTimeout(() => {
            entity.dimension.playSound('arena.mob_spawn', entity.location, {volume: 4})
            entity.dimension.spawnParticle('minecraft:cauldron_explosion_emitter', entity.location)
            try {
                entity.dimension.spawnEntity((entity.typeId.replace('arena_', '')).replace('_placeholder', ''), entity.location).addTag("honkit26113.is_from_arena");
            }
            catch (error) {
                world.sendMessage({ "rawtext": [{ "translate": "arena.message.difficulty_error" }]});
            }
        }, 40);
    }
})


world.afterEvents.playerSpawn.subscribe(event => { 
    const {player, initialSpawn} = event;
    system.run(() => {
        if (world.getAllPlayers().length == 1 && initialSpawn) {
            if (world.getDynamicProperty("honkit26113:arena_over") == 1) {
                world.sendMessage({ rawtext: [{ translate: "arena.message.exit_world_canceled" }]})
                player.onScreenDisplay.setActionBar({ rawtext: [{ translate: "arena.message.exit_world_canceled" }], stayDuration: 600 });
            }
            world.setDynamicProperty("honkit26113:arena_over", 0)
            world.setDynamicProperty("honkit26113:countdown_ongoing", false)
            entity_count = 7;
            world.getDimension("overworld").runCommand("kill @e[family=arena_dummy]")
            
        }
    })
})