import { world, system, BlockPermutation, EffectType } from '@minecraft/server';

world.beforeEvents.worldInitialize.subscribe(eventData => {
    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:quicksand_step_on', {
        onStepOn(e) {
            let block = e.block;
            let step = 0;
            
            const countdown = system.runInterval(() => {
                step++;
                try {
                    block.setPermutation(BlockPermutation.resolve("honkit26113:quicksand", {"honkit26113:layer": step}));
                } catch (error) {
                }
            }, 10);
            system.runTimeout(() => {
                system.clearRun(countdown);
                try {
                    block.setPermutation(BlockPermutation.resolve("honkit26113:quicksand", {"honkit26113:layer": 0}));
                } catch (error) {
                }
            }, 80);
        }
    });
    
    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:slimy_blocks_step_on', {
        onStepOn(e) {
            let entity = e.entity;
            let block = e.block;
            const { x, y, z} = block.location;
            system.run(() => {
                let rand = Math.floor(Math.random() * 4) + 1;
                if (rand < 4) {
                    block.dimension.spawnParticle("honkit26113:dripping_slime_particle", {x: x, y: y+.25, z: z});
                }
            })
            
        }
    });
    
    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:soul_geyser_step_on', {
        onStepOn(e) {
            let entity = e.entity;
            let block = e.block;
            const { x, y, z } = block.location;
            system.run(() => {
                block.dimension.playSound("random.fizz", block.location)
                entity.addEffect("levitation", 20, {amplifier: 7});
                block.dimension.spawnParticle("minecraft:cauldron_explosion_emitter", block.location)
            })
            
        }
    });

    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:soul_magma_step_on', {
        onStepOn(e) {
            let entity = e.entity;
            let block = e.block;
            system.run(() => {
                block.setPermutation(BlockPermutation.resolve("honkit26113:soul_magma", {"honkit26113:damage": 1}));  
                if (!entity.isSneaking && !entity.hasTag("undead")) {
                    entity.addEffect("wither", 40, {amplifier: 3});
                }
            })
        }
    });
    
    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:soul_magma_step_off', {
        onStepOff(e) {
            let entity = e.entity;
            let block = e.block;
            system.run(() => {
                block.setPermutation(BlockPermutation.resolve("honkit26113:soul_magma", {"honkit26113:damage": 0}));  
            })
        }
    });

    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:sticky_spikes_step_on', {
        onStepOn(e) {
            let entity = e.entity;
            let block = e.block;
            system.run(() => {
                block.dimension.playSound("mob.evocation_fangs.attack", block.location)
                if (entity.typeId === "minecraft:item") {
                    entity.kill();
                    return;
                }
                entity.addEffect('poison', 100, {amplifier: 0});
                entity.addEffect('slowness', 100, {amplifier: 2});
            })
        }
    });
});