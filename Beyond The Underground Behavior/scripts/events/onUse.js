import { world, system } from '@minecraft/server';
import { use_durability } from '../functions.js';

world.beforeEvents.worldInitialize.subscribe(eventData => {
    eventData.itemComponentRegistry.registerCustomComponent('honkit26113:sandstorm', {
        onUse(e) {
            const { source, itemStack } = e;
            //const equipment = source.getComponent('equippable');
            //const selectedItem = equipment.getEquipment("mainhand");

            //const equipment = source.getComponent('equippable');
            const { x, y, z } = source.location;

            system.run(() => {
                source.dimension.spawnParticle("honkit26113:sandstorm_emitter", source.location)
                source.dimension.spawnParticle("honkit26113:sandstorm_emitter", {x: x+2, y: y, z: z})
                source.dimension.spawnParticle("honkit26113:sandstorm_emitter", {x: x, y: y, z: z+2})
                source.dimension.spawnParticle("honkit26113:sandstorm_emitter", {x: x, y: y+2, z: z})
                source.addTag('honkit26113:is_wand_owner')
                source.runCommand("effect @e[r=10,tag=!honkit26113:is_wand_owner] blindness 5")
                source.runCommand("effect @e[r=10,tag=!honkit26113:is_wand_owner] weakness 5 1")
                source.removeTag('honkit26113:is_wand_owner')
                use_durability(source, itemStack, 1)
                itemStack.getComponent('cooldown').startCooldown(source)
            })

            
        }
    });

    eventData.itemComponentRegistry.registerCustomComponent('honkit26113:use_bouquet', {
        onUse(e) {
            const { source, itemStack } = e;
            const { x, y, z } = source.location;

            system.run(() => {
                source.dimension.spawnEntity("honkit26113:tracking_thorn_placeholder", source.location);
                use_durability(source, itemStack, 1);
                itemStack.getComponent('cooldown').startCooldown(source);
            })

            
        }
    });
});