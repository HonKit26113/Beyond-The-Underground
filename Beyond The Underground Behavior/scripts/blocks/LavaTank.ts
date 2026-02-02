import { system, EquipmentSlot, BlockPermutation, BlockCustomComponent, ItemStack, GameMode } from '@minecraft/server';
import { decrement_stack } from "../Functions";

const PlaceLavaTankComponent: BlockCustomComponent = {
    beforeOnPlayerPlace({block, player}, {}) {
		if (!player) return;
		const block_below = block.below();
		const { x, y, z } = block.location;
		
		// check for lava under the tank
		if(block.typeId == "honkit26113:lava_tank_gold" || block.typeId == "honkit26113:lava_tank_diamond") {
			system.run(() => {
				if (block_below?.typeId != "minecraft:lava" && block_below?.typeId != "minecraft:flowing_lava") {
					player.onScreenDisplay.setActionBar({"rawtext":[{"translate":"lava_tank.message.error_not_above_lava"}]});
				} else {
					player.runCommand(`fill ${x-5} ${y-5} ${z-5} ${x+5} ${y} ${z+5} air replace lava`);
					player.runCommand(`fill ${x-5} ${y-5} ${z-5} ${x+5} ${y} ${z+5} air replace flowing_lava`);
					player.runCommand("playsound bucket.fill_lava @a[r=10]");
					switch (block.typeId) {
						case "honkit26113:lava_tank_gold": 
							block.setType("honkit26113:lava_tank_gold_full");
							break;
						case "honkit26113:lava_tank_diamond": 
							block.setType("honkit26113:lava_tank_diamond_full");
							break;
					}
				}
			})
		}
    }
};

interface LavaTankState {
	"type": string
}

const LavaTankErrorComponent: BlockCustomComponent = {
    onPlayerInteract({block, player}, {params}) {
		if (!player) return;
		const state = (params as LavaTankState).type;

		switch (state) {
			case "locked": 
				player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.locked" }]});
				block.dimension.spawnParticle("minecraft:critical_hit_emitter", block.location);
				block.dimension.playSound('random.anvil_land', block.location);
				break;
			case "broken":
				player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.broken" }]});
				block.dimension.spawnParticle("minecraft:cauldron_explosion_emitter", block.location)
				block.dimension.playSound('random.fizz', block.location);
				break;
			case "cooldown": 
				player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.cooldown" }]});
				block.dimension.spawnParticle("minecraft:critical_hit_emitter", block.location);
				block.dimension.playSound('random.anvil_land', block.location);
				break;
			default:
				throw new Error("invalid lava tank type");
		}
    }
}

const EmptyLavaTank: BlockCustomComponent = {
	onPlayerInteract({block, player}, {}) {
		if (!player) return;
		const pickaxe_types = [
			"minecraft:diamond_pickaxe",
			"minecraft:netherite_pickaxe",
			"honkit26113:luminite_pickaxe"
		];

		// Return if lava tank does not need emptying
		if (block.permutation.getState("honkit26113:obsidian" as any) !== 1) return;

		
		const equipment = player.getComponent('equippable');
		const selectedItem = equipment?.getEquipment(EquipmentSlot.Mainhand);
		const drop_item = new ItemStack("minecraft:obsidian", 1);
		// Return if not holding correct pickaxe
		if (!selectedItem || !pickaxe_types.includes(selectedItem.typeId)) {
			player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.interact_with_pickaxe" }]});
			return;
		}

		player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.emptied" }]});
		block.dimension.playSound('dig.stone', block.location);
		player.dimension.spawnItem(drop_item, block.location);
		switch (block.typeId) {
			case "honkit26113:lava_tank_gold_full": 
				block.setType("honkit26113:lava_tank_gold_cooldown");
				break;
			case "honkit26113:lava_tank_diamond_full": 
				block.setType("honkit26113:lava_tank_diamond_cooldown");
				break;
		}

		// cooling down countdown
		var count_secs = 5;
		const countdown = system.runInterval(() => {
			count_secs--;
		}, 20);
			
		system.runTimeout(() => {
			system.clearRun(countdown);
			player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.cooldown_end" }]});
			switch (block.typeId) {
				case "honkit26113:lava_tank_gold_cooldown": 
					block.setType("honkit26113:lava_tank_gold");
					break;
				case "honkit26113:lava_tank_diamond_cooldown": 
					block.setType("honkit26113:lava_tank_diamond");
					break;
			}
		}, 140);
	}
}

const cooldownTank: BlockCustomComponent = {
	onPlayerInteract({block, player}, {}) {
		if (!player) return;
		const equipment = player.getComponent('equippable');
		const selectedItem = equipment?.getEquipment(EquipmentSlot.Mainhand);

		if (block.permutation.getState("honkit26113:obsidian" as any) === 0) { 
			if (selectedItem?.typeId != "minecraft:water_bucket") {
				player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.interact_with_water" }]});
			} else {
				player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "lava_tank.message.cooling_down" }]});
				block.dimension.playSound('random.fizz', block.location);
				block.dimension.spawnParticle("minecraft:ice_evaporation_emitter", block.location);
				decrement_stack(player, false, 1);

				if (player.getGameMode() !== GameMode.Creative) {
					const inventory = player.getComponent("minecraft:inventory")?.container;
					inventory?.addItem(new ItemStack("minecraft:bucket", 1));
				}
				block.setPermutation(BlockPermutation.resolve(block.typeId, {"honkit26113:obsidian": 1}));    
			}
		}
    }
}

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("honkit26113:lava_tank_on_place", PlaceLavaTankComponent);
    blockComponentRegistry.registerCustomComponent("honkit26113:lava_tank_error", LavaTankErrorComponent);
    blockComponentRegistry.registerCustomComponent("honkit26113:empty_full_tank", EmptyLavaTank);
    blockComponentRegistry.registerCustomComponent("honkit26113:cool_down_tank", cooldownTank);
});

