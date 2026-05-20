import { system, ItemCustomComponent } from '@minecraft/server';
import { use_durability } from "../Functions";

const SandstormComponent: ItemCustomComponent = {
    onUse({ source, itemStack }, {}) {
        const { x, y, z } = source.location;
		const PARTICLE_ID = "honkit26113:sandstorm_emitter";
		const SOURCE_TAG = "honkit26113:is_wand_owner";

		const locations = [
			source.location,
			{x: x+2, y: y, z: z},
			{x: x, y: y, z: z+2},
			{x: x, y: y+2, z: z}
		]
		for (const loc of locations) {
			source.dimension.spawnParticle(PARTICLE_ID, loc);
		}

		source.addTag(SOURCE_TAG);
		source.runCommand(`effect @e[r=10,tag=!${SOURCE_TAG}] blindness 5`);
		source.runCommand(`effect @e[r=10,tag=!${SOURCE_TAG}] weakness 5 1`);
		source.removeTag(SOURCE_TAG);
		use_durability(source, itemStack, 1);
		itemStack?.getComponent('cooldown')?.startCooldown(source);
    }
};

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("honkit26113:sandstorm", SandstormComponent);
});

