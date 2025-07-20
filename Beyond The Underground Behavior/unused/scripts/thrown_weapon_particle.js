/*import { world, system } from '@minecraft/server';

world.beforeEvents.entityRemove.subscribe((data) => {
	let entity = data.removedEntity;
    let dimension = entity.dimension;
	
	const thrown_weapon = [
		"honkit26113:thrown_slimeball",
        "honkit26113:thrown_sand",
        "honkit26113:thrown_soul"
	];

	if(thrown_weapon.includes(entity.typeId)) { 
		system.run(() => {
            switch (entity.typeId) {
                case "honkit26113:thrown_slimeball":
                    dimension.runCommand("say hi");
                    dimension.spawnParticle("honkit26113:thrown_slimeball_hit_particle", entity.location);
                    break;
                case "honkit26113:thrown_sand":
                    dimension.spawnParticle("minecraft:falling_dust_sand_particle", entity.location);
                    break;
                case "honkit26113:thrown_soul":
                    dimension.spawnParticle("honkit26113:wisp_soul_particle", entity.location);
                    break;
            }
		})
	}
	return;
});*/