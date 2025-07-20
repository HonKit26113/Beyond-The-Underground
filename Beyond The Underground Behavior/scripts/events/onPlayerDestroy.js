// This code is adapted from Kaioga's Block Templates. Thank you!
import { world } from '@minecraft/server';

world.beforeEvents.worldInitialize.subscribe(eventData => {
    eventData.blockComponentRegistry.registerCustomComponent('honkit26113:fence_gate_destroyed', {
        onPlayerDestroy(e) {
            const { block } = e;
            const aboveBlock = block.above();

            if (aboveBlock.typeId === block.typeId && aboveBlock.permutation.getState('kai:invisible')) {
                aboveBlock.setType('minecraft:air')
            }
        }
    });
});
