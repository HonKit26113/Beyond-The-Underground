import { EquipmentSlot, GameMode, ItemStack, Player, system } from '@minecraft/server';

// durability
export function use_durability(player: Player, item: ItemStack, add_damage: number) {
    if (player.getGameMode() === GameMode.Creative) return;
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
export function decrement_stack(target: Player, execute_in_creative: boolean, amount: number) {
    const equipment = target.getComponent('equippable');
    const selectedItem = equipment.getEquipment(EquipmentSlot.Mainhand);
    
    system.run(() => {
        if (!execute_in_creative) {
            if (target.getGameMode() === GameMode.Creative) return;
        }
        if (selectedItem.amount > amount) {
            selectedItem.amount -= amount;
            equipment.setEquipment(EquipmentSlot.Mainhand, selectedItem);
        } else {
            equipment.setEquipment(EquipmentSlot.Mainhand, undefined); 
        }
    })
}