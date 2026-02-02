import { system } from '@minecraft/server';
const StickySpikesComponent = {
    onStepOn({ block, entity }, {}) {
        if (!entity)
            return;
        block.dimension.playSound("mob.evocation_fangs.attack", block.location);
        if (entity.typeId === "minecraft:item") {
            entity.kill();
            return;
        }
        entity.addEffect('poison', 100, { amplifier: 0 });
        entity.addEffect('slowness', 100, { amplifier: 2 });
    }
};
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("honkit26113:step_on_sticky_spikes", StickySpikesComponent);
});
//# sourceMappingURL=StickySpikes.js.map