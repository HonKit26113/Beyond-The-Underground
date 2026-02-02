import { world, system, EquipmentSlot, Player } from '@minecraft/server';
import { use_durability } from './Functions';
world.afterEvents.entityHitEntity.subscribe(data => {
    const source = data.damagingEntity;
    // return if attacker is not a player
    if (!(source instanceof Player))
        return;
    const target = data.hitEntity;
    const equipment = source.getComponent('equippable');
    const selectedItem = equipment?.getEquipment(EquipmentSlot.Mainhand);
    // return if attacker is not holding anything
    if (!selectedItem)
        return;
    if (selectedItem.typeId == "honkit26113:slime_dagger") {
        system.run(() => {
            use_durability(source, selectedItem, 1);
            target.addEffect('poison', 120, { amplifier: 1 });
        });
    }
    if (selectedItem.typeId == "honkit26113:bane_of_frost") {
        system.run(() => {
            use_durability(source, selectedItem, 1);
            target.addEffect('slowness', 60, { amplifier: 3 });
            target.addEffect('mining_fatigue', 60, { amplifier: 2 });
        });
    }
});
world.afterEvents.projectileHitEntity.subscribe(data => {
    const source = data.projectile;
    const target = data.getEntityHit().entity;
    if (source.typeId == "honkit26113:tracking_thorn" && target?.typeId != "minecraft:player") {
        system.run(() => {
            try {
                target?.applyDamage(12);
            }
            catch (error) {
                //world.sendMessage("caught error!");
            }
        });
    }
});
//# sourceMappingURL=HitEntity.js.map