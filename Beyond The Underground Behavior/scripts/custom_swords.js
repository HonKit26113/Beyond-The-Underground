// This code is adapted from Kaioga's Block Templates. Thank you!
import { world, system, EffectType } from '@minecraft/server';
import { use_durability } from './functions';


world.afterEvents.entityHitEntity.subscribe(data => {
    const source = data.damagingEntity;

    if (source.typeId != "minecraft:player") return;
    // The code below only runs if the damage source is a player
    const target = data.hitEntity;

    const equipment = source.getComponent('equippable');
    const selectedItem = equipment.getEquipment('Mainhand');
	
    
    if (selectedItem?.typeId == "honkit26113:slime_dagger") {
	    system.run(() => {
            use_durability(source, selectedItem, 1)
            target.addEffect('poison', 120, {amplifier: 1})
	    });
	}
    
    if (selectedItem?.typeId == "honkit26113:bane_of_frost") {
	    system.run(() => {
            use_durability(source, selectedItem, 1)
            target.addEffect('slowness', 60, {amplifier: 3})
            target.addEffect('mining_fatigue', 60, {amplifier: 2})
	    });
	}

	return;
});

world.afterEvents.projectileHitEntity.subscribe(data => {
    const source = data.projectile;
    const target = data.getEntityHit().entity;

    if (source.typeId == "honkit26113:tracking_thorn" && target.typeId != "minecraft:player") {
        system.run(() => {
            try {
                target?.applyDamage(12);
            }
            catch (error) {
                //world.sendMessage("caught error!");
            }
	    });
    }
	return;
});