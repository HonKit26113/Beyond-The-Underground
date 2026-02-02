import { system } from '@minecraft/server';
const SoulGeyserComponent = {
    onStepOn({ block, entity }, {}) {
        block.dimension.playSound("random.fizz", block.location);
        entity?.addEffect("levitation", 20, { amplifier: 7 });
        block.dimension.spawnParticle("minecraft:cauldron_explosion_emitter", block.location);
    }
};
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("honkit26113:step_on_soul_geyser", SoulGeyserComponent);
});
//# sourceMappingURL=SoulGeyser.js.map