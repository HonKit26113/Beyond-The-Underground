import { system, BlockPermutation, Player } from '@minecraft/server';
const SoulMagmaComponent = {
    onStepOn({ block, entity }, {}) {
        if (!entity)
            return;
        if (!entity.hasTag("undead") && (entity instanceof Player && !entity.isSneaking)) {
            entity.addEffect("wither", 40, { amplifier: 3 });
            block.setPermutation(BlockPermutation.resolve("honkit26113:soul_magma", { "honkit26113:damage": 1 }));
        }
    },
    onStepOff({ block }, {}) {
        block.setPermutation(BlockPermutation.resolve("honkit26113:soul_magma", { "honkit26113:damage": 0 }));
    }
};
const SoulMagmaTickingComponent = {
    onTick({ block }, {}) {
        const { x, y, z } = block.location;
        let entities = block.dimension.getEntitiesAtBlockLocation({ x, y: y + 1, z });
        for (const entity of entities) {
            if (!entity.hasTag("undead") && (entity instanceof Player && !entity.isSneaking)) {
                entity.addEffect("wither", 40, { amplifier: 3 });
            }
        }
    }
};
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("honkit26113:step_on_soul_magma", SoulMagmaComponent);
    blockComponentRegistry.registerCustomComponent("honkit26113:ticking_soul_magma", SoulMagmaTickingComponent);
});
//# sourceMappingURL=SoulMagma.js.map