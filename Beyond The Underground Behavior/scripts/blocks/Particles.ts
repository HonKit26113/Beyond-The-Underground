import { system, BlockCustomComponent, Vector3 } from '@minecraft/server';

interface Particle {
    "name": string,
    "offset"?: [number, number, number]
}

const ParticleComponent: BlockCustomComponent = {
    onTick({block}, {params}) {
        const p: Particle = params as Particle;
        const [dx, dy, dz] = p.offset ?? [0, 0, 0];
        const loc = block.location;
        const pos: Vector3 = {
            x: loc.x + dx, 
            y: loc.y + dy, 
            z: loc.z + dz
        };
        block.dimension.spawnParticle(p.name, pos);
    }
};

const SlimyParticles: BlockCustomComponent = {
    onStepOn({block}) {
        const { x, y, z} = block.location;
        let rand = Math.floor(Math.random() * 4) + 1;
        if (rand < 4) {
            block.dimension.spawnParticle("honkit26113:dripping_slime_particle", {x: x, y: y+.25, z: z});
        }
    }
}

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("honkit26113:particles", ParticleComponent);
    blockComponentRegistry.registerCustomComponent("honkit26113:slimy_blocks_step_on", SlimyParticles);
});

