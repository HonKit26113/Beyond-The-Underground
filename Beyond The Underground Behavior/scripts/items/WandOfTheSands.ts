import { system, ItemCustomComponent } from '@minecraft/server';
import { use_durability } from "../Functions";

const SandstormComponent: ItemCustomComponent = {
    onUse({ source, itemStack }, {}) {
        const { x, y, z } = source.location;
		const particle = "honkit26113:sandstorm_emitter";
		const tag = "honkit26113:is_wand_owner";
		source.dimension.spawnParticle(particle, source.location);
		source.dimension.spawnParticle(particle, {x: x+2, y: y, z: z});
		source.dimension.spawnParticle(particle, {x: x, y: y, z: z+2});
		source.dimension.spawnParticle(particle, {x: x, y: y+2, z: z});
		source.addTag(tag);
		source.runCommand(`effect @e[r=10,tag=!${tag}] blindness 5`);
		source.runCommand(`effect @e[r=10,tag=!${tag}] weakness 5 1`);
		source.removeTag(tag);
		use_durability(source, itemStack, 1);
		itemStack?.getComponent('cooldown')?.startCooldown(source);
    }
};

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("honkit26113:sandstorm", SandstormComponent);
});

