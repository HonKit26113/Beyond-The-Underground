import { EntityHitEntityAfterEvent, ItemCustomComponent, ItemStack, Player, PlayerBreakBlockAfterEvent, PlayerBreakBlockBeforeEvent, system, Vector3, world } from '@minecraft/server';

// Scoreboard objective ID. Changing this will make all existing timers obsolete!
const objectiveId = "honkit26113:combustion_ring_timer";

export const REPAIR_LIMIT = 3;

//////////////////////////////////
// CUSTOM COMPONENT DEFINITIONS //
//////////////////////////////////
const combustionRing: ItemCustomComponent = {
    onUse({ source, itemStack }, {}) {
		let objective = world.scoreboard.getObjective(objectiveId);

		if (!objective) {
			objective = world.scoreboard.addObjective(objectiveId);
		}

		// Return if another amulet is already active
		if (objective.getScore(source) > 0) {
        	source.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "combustion_amulet.message.already_using" }]});
			return;
		}

		const useDuration = (itemStack.getDynamicProperty("honkit26113:use_duration") ?? 60) as number;
		source.playSound("random.glass");
		breakAmulet(source);

		objective.setScore(source, useDuration);
		startCountdown(source);
    }
};

const brokenCombustionRing: ItemCustomComponent = {
	onUse({ source }, {}) {
        source.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "combustion_amulet.message.broken" }]});
    }
}



//////////////////////////////////////////////
// CONTINUE TIMER WHEN PLAYER REJOINS WORLD //
//////////////////////////////////////////////
world.afterEvents.playerSpawn.subscribe(e => {
	const {player, initialSpawn } = e;
	let objective = world.scoreboard.getObjective(objectiveId);
	
	if (!objective) {
		objective = world.scoreboard.addObjective(objectiveId);
	}
	let score = 0;
	// Fixes "Failed to resolve identity" error in multiplayer
	try {
		score = objective.getScore(player) ?? 0;
	} catch (error) {
		objective.setScore(player, 0);
	}
	if (initialSpawn && objective && score > 0) {
		startCountdown(player);
	}
})



/////////////////////////////////
// BLOCK DROP CONVERSATION MAP //
/////////////////////////////////

// < Block broken, [Original drop, New drop] >
const blockDrops: Map<string, [string, string]> = new Map([
	["minecraft:sand", ["minecraft:sand", "minecraft:glass"]],
	["minecraft:red_sand", ["minecraft:red_sand", "minecraft:glass"]],
	["minecraft:iron_ore", ["minecraft:raw_iron", "minecraft:iron_ingot"]],
	["minecraft:gold_ore", ["minecraft:raw_gold", "minecraft:gold_ingot"]],
	["minecraft:copper_ore", ["minecraft:raw_copper", "minecraft:copper_ingot"]],
	["minecraft:deepslate_iron_ore", ["minecraft:raw_iron", "minecraft:iron_ingot"]],
	["minecraft:deepslate_gold_ore", ["minecraft:raw_gold", "minecraft:gold_ingot"]],
	["minecraft:deepslate_copper_ore", ["minecraft:raw_copper", "minecraft:copper_ingot"]],
	["minecraft:cactus", ["minecraft:cactus", "minecraft:green_dye"]],
	["minecraft:ancient_debris", ["minecraft:ancient_debris", "minecraft:netherite_scrap"]],
	["minecraft:cobblestone", ["minecraft:cobblestone", "minecraft:stone"]],
	["minecraft:cobbled_deepslate", ["minecraft:cobbled_deepslate", "minecraft:deepslate"]],
	["minecraft:stone", ["minecraft:cobblestone", "minecraft:smooth_stone"]],
	["minecraft:deepslate_bricks", ["minecraft:deepslate_bricks", "minecraft:cracked_deepslate_bricks"]],
	["minecraft:deepslate_tiles", ["minecraft:deepslate_tiles", "minecraft:cracked_deepslate_tiles"]],
	["minecraft:stone_bricks", ["minecraft:stone_bricks", "minecraft:cracked_stone_bricks"]],
	["honkit26113:slimy_deepslate_bricks", ["honkit26113:slimy_deepslate_bricks", "honkit26113:slimy_deepslate_bricks_cracked"]],
	["honkit26113:slimy_deepslate_tiles", ["honkit26113:slimy_deepslate_tiles", "honkit26113:slimy_deepslate_tiles_cracked"]],
	["honkit26113:slimy_stone_bricks", ["honkit26113:slimy_stone_bricks", "honkit26113:slimy_stone_bricks_cracked"]],
	["minecraft:nether_bricks", ["minecraft:nether_bricks", "minecraft:cracked_nether_bricks"]],
	["minecraft:polished_blackstone_bricks", ["minecraft:polished_blackstone_bricks", "minecraft:cracked_polished_blackstone_bricks"]],
	["minecraft:sandstone", ["minecraft:sandstone", "minecraft:smooth_sandstone"]],
	["minecraft:red_sandstone", ["minecraft:red_sandstone", "minecraft:smooth_red_sandstone"]],
	["minecraft:basalt", ["minecraft:basalt", "minecraft:smooth_basalt"]],
	["minecraft:quartz_block", ["minecraft:quartz_block", "minecraft:smooth_quartz"]],
	["minecraft:wet_sponge", ["minecraft:wet_sponge", "minecraft:sponge"]],
	["honkit26113:limestone_bricks", ["honkit26113:limestone_bricks", "honkit26113:limestone_bricks_cracked"]],
	["honkit26113:soul_bricks", ["honkit26113:soul_bricks", "honkit26113:soul_bricks_cracked"]],
	["honkit26113:packed_ice_bricks", ["honkit26113:packed_ice_bricks", "honkit26113:packed_ice_bricks_cracked"]],

	["minecraft:light_gray_terracotta", ["minecraft:light_gray_terracotta", "minecraft:silver_glazed_terracotta"]]
])

// generate terracotta conversions
// Light gray is defined manually since it has a unique ID
const colours = [
  "white", "orange", "magenta", "light_blue",
  "yellow", "lime", "pink", "gray",
  "cyan", "purple", "blue",
  "brown", "green", "red", "black"
];

for (const colour of colours) {
  const terracottaId = `minecraft:${colour}_terracotta`;
  const glazedId = `minecraft:${colour}_glazed_terracotta`;
  blockDrops.set(terracottaId, [terracottaId, glazedId]);
}



////////////////////
// EVENT HANDLERS //
////////////////////
const hitHandler = (e: EntityHitEntityAfterEvent) => {
	const {hitEntity, damagingEntity} = e;
	const objective = world.scoreboard.getObjective(objectiveId);
	if (!(damagingEntity instanceof Player)) return;
	// Set entity on fire
	if (objective.getScore(damagingEntity) > 0) {
		hitEntity.setOnFire(4);
	}
}

const preBreakItems = new Map<string, Set<string>>();

const breakHandler = (e: PlayerBreakBlockAfterEvent) => {
	const {block, player, brokenBlockPermutation} = e;
	const objective = world.scoreboard.getObjective(objectiveId);
	const id = brokenBlockPermutation.type.id;
	const loc = block.location;

    const key = getKey(player, loc);
    const existingIds = preBreakItems.get(key) ?? new Set();

	// Cleanup 
    preBreakItems.delete(key);

	if (objective.getScore(player) <= 0) return;
	if (!blockDrops.has(id)) return;

	const items = player.dimension.getEntities({location: loc, maxDistance: 2, type: "minecraft:item"});
	let count = 0;
	const targetId = blockDrops.get(id)[0];

	for (const item of items) {
		// Skip if item was already there before breaking the actual block. 
		// This prevents players throwing raw items onto blocks then breaking them.
		if (existingIds.has(item.id)) continue;
		const stack = item.getComponent("minecraft:item").itemStack;
		if (stack.typeId === targetId) {
			count += stack.amount;
			//world.sendMessage(`got ${stack.amount} ${item.getComponent("minecraft:item").itemStack.typeId}, count is now ${count}`);
			item.kill();
		}
	}
	if (count > 0) player.dimension.spawnItem(new ItemStack(blockDrops.get(id)[1], count), loc);
}

const existingItemsDetectionHandler = (e: PlayerBreakBlockBeforeEvent) => {
    const { block, player } = e;
    const loc = block.location;

    const key = getKey(player, loc);
    const items = player.dimension.getEntities({
        location: loc,
        maxDistance: 2,
        type: "minecraft:item"
    });

    const ids = new Set<string>();
    for (const item of items) {
        ids.add(item.id);
    }

    preBreakItems.set(key, ids);
};

function getKey(player: Player, loc: Vector3) {
    return `${player.id}:${loc.x},${loc.y},${loc.z}`;
}



////////////////////////
// EVENT SUBSCRIPTION //
////////////////////////
let refcount = 0;
function subscribeToEvents() {
	if (refcount === 0) {
		world.afterEvents.entityHitEntity.subscribe(hitHandler);
		world.afterEvents.playerBreakBlock.subscribe(breakHandler);
		world.beforeEvents.playerBreakBlock.subscribe(existingItemsDetectionHandler);
	}
	refcount++;
}

function unsubscribeFromEvents() {
	refcount--;
	if (refcount <= 0) {
		world.afterEvents.entityHitEntity.unsubscribe(hitHandler);
		world.afterEvents.playerBreakBlock.unsubscribe(breakHandler);
		world.beforeEvents.playerBreakBlock.unsubscribe(existingItemsDetectionHandler);
	}
}



//////////////////////
// COUNTDOWN SYSTEM //
//////////////////////
function startCountdown(player: Player) {
	let objective = world.scoreboard.getObjective(objectiveId);
	if (!objective) {
		objective = world.scoreboard.addObjective(objectiveId);
	}
	subscribeToEvents();

	const countdown = system.runInterval(() => {		
		const currentTime = (objective.getScore(player) ?? 0);
		const minutes = Math.floor(currentTime / 60).toString();
		const seconds = (currentTime % 60).toString().padStart(2, "0");
		player.onScreenDisplay.setActionBar([{ "rawtext": [{ "translate": "combustion_amulet.message.countdown" }]}, 
			{ "text": ` §6[${minutes}:${seconds}]§r` }]);
		if (currentTime === 0) {
			player.onScreenDisplay.setActionBar([{ "rawtext": [{ "translate": "combustion_amulet.message.ended" }]}]);
			system.clearRun(countdown);
			unsubscribeFromEvents();
		}
		objective.setScore(player, currentTime - 1);
	}, 20);
}



////////////////////////////////////
// REPLACE AMULET WITH BROKEN ONE //
////////////////////////////////////
/**
 * Replaces a normal Combustion Amulet with a broken one.
 * @param player
 */
function breakAmulet(player: Player) {
	const brokenAmulet = new ItemStack("honkit26113:combustion_amulet_broken");
	const inventory = player.getComponent("minecraft:inventory").container;
	const selectedSlot = player.selectedSlotIndex;
	const repairCount = inventory.getItem(selectedSlot).getDynamicProperty("honkit26113:repair_count") ?? 0;
	brokenAmulet.setDynamicProperty("honkit26113:repair_count", repairCount);
	inventory.setItem(selectedSlot, brokenAmulet);
}



///////////////////////////////////
// CUSTOM COMPONENT REGISTRATION //
///////////////////////////////////
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("honkit26113:use_combustion_amulet", combustionRing);
    itemComponentRegistry.registerCustomComponent("honkit26113:broken_combustion_amulet", brokenCombustionRing);
});

