import { system } from '@minecraft/server';

// durability
export function use_durability(player, item, add_damage) {
    if (player.matches({gameMode:'creative'})) return;
    const inventory = player.getComponent("minecraft:inventory").container;
	const durability = item.getComponent("minecraft:durability");
    system.run(() => {
        if (durability.damage + add_damage >= durability.maxDurability) {
            inventory.setItem(player.selectedSlotIndex, null);
            player.playSound("random.break");
        } else {
            item.getComponent("minecraft:durability").damage += add_damage;
            inventory.setItem(player.selectedSlotIndex, item);
        }
    })
}

// decrement_stack
export function decrement_stack(target, execute_in_creative, amount) {
    const equipment = target.getComponent('equippable');
    const selectedItem = equipment.getEquipment('Mainhand');
    
    system.run(() => {
        if (!execute_in_creative) {
            if (target.matches({gameMode:'creative'})) return;
        }
        if (selectedItem.amount > amount) {
            selectedItem.amount -= amount;
            equipment.setEquipment('Mainhand', selectedItem);
        } else {
            equipment.setEquipment('Mainhand', undefined); 
        }
    })
}