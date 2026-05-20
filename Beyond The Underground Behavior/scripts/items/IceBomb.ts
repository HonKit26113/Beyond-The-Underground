import { world, Vector3, Dimension, ProjectileHitBlockAfterEvent, ProjectileHitEntityAfterEvent, TicksPerSecond, Entity } from '@minecraft/server';

const projectileHitDetected = (data: ProjectileHitEntityAfterEvent | ProjectileHitBlockAfterEvent) => {
	const {dimension, location, projectile, source} = data;
	if (projectile.typeId !== "honkit26113:ice_bomb_projectile") return;
	iceBombExplode(dimension, location, source);
}

world.afterEvents.projectileHitEntity.subscribe(data => {
	projectileHitDetected(data);
})

world.afterEvents.projectileHitBlock.subscribe(data => {
	projectileHitDetected(data);
})

const excludeEntities = [
	"minecraft:armor_stand",
	"minecraft:arrow",
	"minecraft:boat",
	"minecraft:ender_crystal",
	"minecraft:fire_charge",
	"minecraft:lingering_potion",
	"minecraft:splash_potion",
	"minecraft:wind_charge_projectile",
	"honkit26113:arena_entity_counter",
	"honkit26113:arena_countdown",
	"honkit26113:arena_monster_placeholder",
	"honkit26113:ice_bomb_projectile",
	"honkit26113:ice_bomber"
]

function iceBombExplode(dim: Dimension, loc: Vector3, source?: Entity) {
	try {
		dim.spawnParticle("honkit26113:ice_bomb_explosion", loc);
		const entities = dim.getEntities({
			location: loc, 
			excludeTypes: excludeEntities, 
			maxDistance: 2
		})
		for (const entity of entities) {
			if (entity === source) continue;
			entity.addEffect("slowness", 1.5 * TicksPerSecond, {amplifier: 6});
		}
	} catch (error) {
		return;
	}
}