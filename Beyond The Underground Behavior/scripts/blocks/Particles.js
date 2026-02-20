import { system } from '@minecraft/server';
const ParticleComponent = {
    onTick({ block }, { params }) {
        const p = params;
        const [dx, dy, dz] = p.offset ?? [0, 0, 0];
        const loc = block.location;
        const pos = {
            x: loc.x + dx,
            y: loc.y + dy,
            z: loc.z + dz
        };
        block.dimension.spawnParticle(p.name, pos);
    }
};
const SlimyParticles = {
    onStepOn({ block }) {
        const { x, y, z } = block.location;
        let rand = Math.floor(Math.random() * 4) + 1;
        if (rand < 4) {
            block.dimension.spawnParticle("honkit26113:dripping_slime_particle", { x: x, y: y + .25, z: z });
        }
    }
};
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("honkit26113:particles", ParticleComponent);
    blockComponentRegistry.registerCustomComponent("honkit26113:slimy_blocks_step_on", SlimyParticles);
});
//# sourceMappingURL=Particles.js.map