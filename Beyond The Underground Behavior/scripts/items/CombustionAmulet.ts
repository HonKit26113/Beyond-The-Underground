import { EntityHitEntityAfterEvent, ItemCustomComponent, ItemStack, Player, PlayerBreakBlockAfterEvent, system, world } from '@minecraft/server';
import { decrement_stack } from "../Functions";

const maxTime = 60; // duration in seconds
const objectiveId = "honkit26113:combustion_ring_timer";

const combustionRing: ItemCustomComponent = {
    onUse({ source }, {}) {
		source.playSound("random.glass");
		decrement_stack(source, false);

		let objective = world.scoreboard.getObjective(objectiveId);

		if (!objective) {
			objective = world.scoreboard.addObjective(objectiveId);
		}
		objective.setScore(source, maxTime);
		startCountdown(source);
    }
};

world.afterEvents.playerSpawn.subscribe(e => {
	const {player, initialSpawn } = e;
	const objective = world.scoreboard.getObjective(objectiveId);
	if (initialSpawn && objective && objective.getScore(player) > 0) {
		startCountdown(player);
	}
})

const blockDrops: Map<string, [string, string]> = new Map([
	["minecraft:sand", ["minecraft:sand", "minecraft:glass"]],
	["minecraft:iron_ore", ["minecraft:raw_iron", "minecraft:iron_ingot"]],
	["minecraft:gold_ore", ["minecraft:raw_gold", "minecraft:gold_ingot"]],
	["minecraft:copper_ore", ["minecraft:raw_copper", "minecraft:copper_ingot"]],
	["minecraft:deepslate_iron_ore", ["minecraft:raw_iron", "minecraft:iron_ingot"]],
	["minecraft:deepslate_gold_ore", ["minecraft:raw_gold", "minecraft:gold_ingot"]],
	["minecraft:deepslate_copper_ore", ["minecraft:raw_copper", "minecraft:copper_ingot"]],
	["minecraft:cactus", ["minecraft:cactus", "minecraft:cactus_green"]]
])

const hitHandler = (e: EntityHitEntityAfterEvent) => {
	const {hitEntity, damagingEntity} = e;
	const objective = world.scoreboard.getObjective(objectiveId);
	if (!(damagingEntity instanceof Player)) return;
	if (objective.getScore(damagingEntity) > 0) {
		hitEntity.setOnFire(4);
	}
}

const breakHandler = (e: PlayerBreakBlockAfterEvent) => {
	const {block, player, brokenBlockPermutation} = e;
	const objective = world.scoreboard.getObjective(objectiveId);
	const id = brokenBlockPermutation.type.id;
	const loc = block.location;
	//world.sendMessage(`${id}`)
	//world.sendMessage(`${JSON.stringify(loc)}`)
	if (objective.getScore(player) <= 0) return;
	if (!blockDrops.has(id)) return;
	//world.sendMessage(`${id}`)
	//world.sendMessage(`${JSON.stringify(loc)}`)
	const items = player.dimension.getEntities({location: loc, maxDistance: 1.35, type: "minecraft:item"});
	let count = 0;
	const targetId = blockDrops.get(id)[0];
	for (const item of items) {
		const velocity = item.getVelocity();
		const stack = item.getComponent("minecraft:item").itemStack
		if (stack.typeId === targetId && (velocity.x > 0 || velocity.y > 0 || velocity.z > 0)) {
			count += stack.amount;
			world.sendMessage(`got ${stack.amount} ${item.getComponent("minecraft:item").itemStack.typeId}, count is now ${count}`);
			item.kill();
		}
	}
	if (count > 0) player.dimension.spawnItem(new ItemStack(blockDrops.get(id)[1], count), loc);
}

let refcount = 0;
function subscribeToEvents() {
	if (refcount === 0) {
		world.afterEvents.entityHitEntity.subscribe(hitHandler);
		world.afterEvents.playerBreakBlock.subscribe(breakHandler);
	}
	refcount++;
}

function unsubscribeFromEvents() {
	refcount--;
	if (refcount <= 0) {
		world.afterEvents.entityHitEntity.unsubscribe(hitHandler);
		world.afterEvents.playerBreakBlock.unsubscribe(breakHandler);
	}
}


function startCountdown(player: Player) {
	let objective = world.scoreboard.getObjective(objectiveId);
	if (!objective) {
		objective = world.scoreboard.addObjective(objectiveId);
	}
	subscribeToEvents();

	const countdown = system.runInterval(() => {
		const currentTime = (objective.getScore(player) ?? 0);
		player.onScreenDisplay.setActionBar([{ "rawtext": [{ "translate": "ring_of_combustion.message.countdown" }]}, { "text": " §6[0:" }, currentTime.toString().padStart(2, "0"), { "text": "]§r" }]);
		if (currentTime === 0) {
			system.clearRun(countdown);
			unsubscribeFromEvents();
		}
		objective.setScore(player, currentTime - 1);
	}, 20);
}

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("honkit26113:use_combustion_amulet", combustionRing);
});

