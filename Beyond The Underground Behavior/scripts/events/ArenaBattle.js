import { world, system, BlockPermutation, ItemStack, Difficulty, TicksPerSecond } from '@minecraft/server';
import { arenaBiomes, arenaConfig } from './ArenaConfig';
////////////////////////////////
function isArenaBiome(value) {
    return Object.values(arenaBiomes).includes(value);
}
const arenaData = arenaConfig.map(b => {
    if (!isArenaBiome(b.biome)) {
        throw new Error(`Invalid biome: ${b.biome}`);
    }
    return {
        ...b,
        biome: b.biome
    };
});
function getArenaData(biome) {
    for (let i = 0; i < arenaData.length; i++) {
        if (arenaData[i].biome === biome) {
            return arenaData[i];
        }
    }
}
/**
 *
 * @returns total entity amount for an arena phase
 */
function getEntityCount(phase) {
    let count = 0;
    for (const mob of phase.mobs) {
        count += mob.count;
    }
    return count;
}
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("honkit26113:arena_ask_for_confirmation", askForConfirmation);
    blockComponentRegistry.registerCustomComponent("honkit26113:arena_cancel", cancelFunction);
    blockComponentRegistry.registerCustomComponent("honkit26113:arena_confirmed", confirmStart);
    blockComponentRegistry.registerCustomComponent("honkit26113:check_for_finish_round", checkForFinish);
    blockComponentRegistry.registerCustomComponent("honkit26113:arena_pillar_used_error", pillarUsedError);
    blockComponentRegistry.registerCustomComponent("honkit26113:check_arena_status", checkArenaStatus);
});
const askForConfirmation = {
    onPlayerInteract({ block, player }, {}) {
        if (world.getDifficulty() === Difficulty.Peaceful) {
            player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "arena.message.difficulty_error" }] });
            return;
        }
        if (world.getDynamicProperty("honkit26113:countdown_ongoing") == true) {
            player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "arena.message.wait" }] });
        }
        else {
            block.setPermutation(BlockPermutation.resolve(block.typeId, { "honkit26113:started": 1 }));
            player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "arena.message.confirmation" }] });
        }
    }
};
const cancelFunction = {
    onTick({ block }, {}) {
        block.setPermutation(BlockPermutation.resolve(block.typeId, { "honkit26113:started": 0 }));
        const nearbyPlayers = block.dimension.getPlayers({
            location: block.location,
            maxDistance: 20
        });
        for (const p of nearbyPlayers) {
            p.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "arena.message.cancel" }] });
        }
    }
};
const confirmStart = {
    onPlayerInteract({ block }, { params }) {
        const { x, y, z } = block.location;
        const dim = block.dimension;
        const thisArena = getArenaData(params.biome);
        if (thisArena === undefined) {
            console.error("Undefined arena config. Check the biome ID?");
            return;
        }
        const thisPhases = thisArena.phases;
        const phaseId = 0; // This placeholder will change once phases are implemented
        entityCount = getEntityCount(thisPhases[phaseId]); // This entity_count system needs to be refactored for phases to be implemented
        world.setDynamicProperty("honkit26113:arena_over", 1); // ongoing
        world.setDynamicProperty("honkit26113:countdown_ongoing", true);
        dim.playSound('block.bell.hit', block.location, { volume: 4 });
        block.setPermutation(BlockPermutation.resolve(block.typeId, { "honkit26113:started": 2 }));
        for (let i = 1; i <= 3; i++) {
            block.below(i).setPermutation(BlockPermutation.resolve(block.below(i)?.typeId, { "honkit26113:activated": true }));
        }
        let count_secs = 3;
        const nearbyPlayers = getNearbyPlayers(block, 32);
        const countdown = system.runInterval(() => {
            for (const p of nearbyPlayers) {
                p.onScreenDisplay.setActionBar([{ "rawtext": [{ "translate": "arena.message.starting_in" }] },
                    { "text": ` §6[0:0${count_secs.toString()}]§r!` }]);
            }
            count_secs--;
        }, 20);
        const tag = 'honkit26113.is_arena_placeholder';
        system.runTimeout(() => {
            system.clearRun(countdown);
            for (const p of nearbyPlayers) {
                p.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "arena.message.battle_start" }] });
            }
            dim.spawnEntity('honkit26113:arena_entity_counter', block.location).triggerEvent(params.biome);
            dim.spawnEntity('honkit26113:arena_countdown', block.location);
            for (const mob of thisPhases[phaseId].mobs) {
                for (let i = 0; i < mob.count; i++) {
                    const randVector3 = {
                        x: x + Math.floor(Math.random() * 9) - 4,
                        y: y - 3,
                        z: z + Math.floor(Math.random() * 9) - 4
                    };
                    const monster = dim.spawnEntity("honkit26113:arena_monster_placeholder", randVector3);
                    monster.addTag(tag);
                    // Colons are not allowed in enum values in entity properties. Therefore, in the enum, the colon following the namespace is replaced with an underscore.
                    // Here we replace it back with a colon. This also means all entities listed in the enum must follow namespace:id.
                    monster.setProperty("honkit26113:monster_type", mob.entity.replace(":", "_"));
                }
            }
            dim.runCommand(`execute positioned ${x} ${y} ${z} run camerashake add @a[r=40] 1 1 positional`);
        }, 80);
        world.stopMusic();
        const musicOptions = {
            fade: 0.5,
            loop: false,
            volume: 1.0,
        };
        world.playMusic("music.arena", musicOptions);
    }
};
/**
 * Given a block, return a list of players within the given radius
 * @param block
 * @param radius
 * @returns
 */
function getNearbyPlayers(block, radius) {
    return block.dimension.getPlayers({
        location: block.location,
        maxDistance: radius
    });
}
const checkForFinish = {
    onTick({ block }, { params }) {
        // 1 == ongoing battle
        // 2 == victory
        // 3 == defeat
        let victory = undefined;
        if (world.getDynamicProperty("honkit26113:arena_over") === 2)
            victory = true;
        if (world.getDynamicProperty("honkit26113:arena_over") === 3)
            victory = false;
        if (victory !== undefined) {
            const thisArena = getArenaData(params.biome);
            arenaCleanup(victory, block, thisArena);
        }
        const dim = block.dimension;
        const loc = block.location;
        // if (world.getDynamicProperty("honkit26113:arena_over") === 2) { // victory
        //     // Show victory text and play victory SFX to nearby players
        //     const nearbyPlayers = getNearbyPlayers(block, 32);
        //     for (const p of nearbyPlayers) {
        //         // text
        //         p.onScreenDisplay.setTitle("", {
        //             fadeInDuration: 1 * TicksPerSecond,
        //             stayDuration: 6 * TicksPerSecond,
        //             fadeOutDuration: 1.5 * TicksPerSecond,
        //             subtitle: { "rawtext": [{ "translate": "arena.message.victory" }]}
        //         })
        //         // sound
        //         p.playSound("arena.complete", {pitch: 1, volume: 3});
        //     }
        //     world.setDynamicProperty("honkit26113:arena_over", 0) // battle over
        //     block.setPermutation(BlockPermutation.resolve(block.typeId, {"honkit26113:started": 3}))
        //     dim.getEntities({ type: "honkit26113:arena_entity_counter", location: loc}).forEach(entity => {
        //         entity.getComponent('health').setCurrentValue(0);
        //     })
        //     dim.getEntities({ type: "honkit26113:arena_countdown", location: loc}).forEach(entity => {
        //         entity.getComponent('health').setCurrentValue(0);
        //     })
        //     // Spawn rewards
        //     const thisArena = getArenaData((params as ArenaParams).biome);
        //     const thisPhases = thisArena.phases;
        //     const phaseId = 0; // Placeholder
        //     for (const r of thisPhases[phaseId].rewards) {
        //         dim.spawnItem(new ItemStack(r.item, r.count), loc);
        //     }
        //     world.stopMusic();
        // }
        // if (world.getDynamicProperty("honkit26113:arena_over") === 3) { // defeat
        //     const nearbyPlayers = getNearbyPlayers(block, 32);
        //     for (const p of nearbyPlayers) {
        //         // show victory text
        //         p.onScreenDisplay.setTitle("", {
        //             fadeInDuration: 1 * TicksPerSecond,
        //             stayDuration: 6 * TicksPerSecond,
        //             fadeOutDuration: 1.5 * TicksPerSecond,
        //             subtitle: { "rawtext": [{ "translate": "arena.message.defeat" }]}
        //         })
        //         // play defeat sound to nearby players
        //         p.playSound("arena.defeat", {pitch: 1, volume: 3});
        //     }
        //     world.setDynamicProperty("honkit26113:arena_over", 0) // battle over
        //     block.setPermutation(BlockPermutation.resolve(block.typeId, {"honkit26113:started": 3}))
        //     dim.getEntities({ type: "honkit26113:arena_entity_counter", location: loc}).forEach(entity => {
        //         entity.getComponent('health').setCurrentValue(0);
        //     })
        //     dim.getEntities({ type: "honkit26113:arena_countdown", location: loc}).forEach(entity => {
        //         entity.getComponent('health').setCurrentValue(0);
        //     })
        //     world.stopMusic();
        // }
        if (world.getDynamicProperty('honkit26113:arena_over') != 1 && dim.getEntities({ type: "honkit26113:arena_entity_counter", location: loc }).length === 0 && dim.getEntities({ type: "honkit26113:arena_countdown", location: loc }).length === 0) {
            block.setPermutation(BlockPermutation.resolve(block.typeId, { "honkit26113:started": 3 }));
        }
    }
};
/**
 *
 * @param victory victory = `true`, defeat = `false`
 * @param block the arena trigger
 * @param arena the arena. Use `getArenaData` from trigger params
 */
function arenaCleanup(victory, block, arena) {
    const dim = block.dimension;
    const loc = block.location;
    // Show victory or defeat text and play sound to nearby players
    const nearbyPlayers = getNearbyPlayers(block, 32);
    for (const p of nearbyPlayers) {
        // text
        p.onScreenDisplay.setTitle("", {
            fadeInDuration: 1 * TicksPerSecond,
            stayDuration: 6 * TicksPerSecond,
            fadeOutDuration: 1.5 * TicksPerSecond,
            subtitle: { "rawtext": [{ "translate": victory ? "arena.message.victory" : "arena.message.defeat" }] }
        });
        // sound
        p.playSound(victory ? "arena.complete" : "arena.defeat", { pitch: 1, volume: 3 });
    }
    // Spawn rewards if victory
    if (victory) {
        const thisPhases = arena.phases;
        const phaseId = 0; // Placeholder
        for (const r of thisPhases[phaseId].rewards) {
            dim.spawnItem(new ItemStack(r.item, r.count), loc);
        }
    }
    // Reset dynamic property and arena trigger block property
    world.setDynamicProperty("honkit26113:arena_over", 0); // 0 = battle over
    block.setPermutation(BlockPermutation.resolve(block.typeId, { "honkit26113:started": 3 }));
    // Reset entity counter and countdown
    dim.getEntities({ type: "honkit26113:arena_entity_counter", location: loc }).forEach(entity => {
        entity.getComponent('health').setCurrentValue(0);
    });
    dim.getEntities({ type: "honkit26113:arena_countdown", location: loc }).forEach(entity => {
        entity.getComponent('health').setCurrentValue(0);
    });
    // Stop arena music
    world.stopMusic();
}
const pillarUsedError = {
    onPlayerInteract({ player }, {}) {
        player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "arena.message.pillar_used" }] });
    }
};
const checkArenaStatus = {
    onTick({ block }, {}) {
        if (world.getDynamicProperty("honkit26113:arena_over") == 0) {
            block.setPermutation(BlockPermutation.resolve(block.typeId, { "honkit26113:activated": false }));
        }
    }
};
var entityCount = 0;
world.afterEvents.entityDie.subscribe((data) => {
    const entity = data.deadEntity;
    if (entity.isValid && entity.hasTag("honkit26113.is_from_arena")) {
        const arena_placeholder = entity.dimension.getEntities({
            type: "honkit26113:arena_entity_counter",
            location: entity.location
        });
        entityCount--;
        arena_placeholder.forEach(entity => {
            entity.getComponent('health').setCurrentValue(entityCount);
        });
        if (entityCount === 0) {
            world.setDynamicProperty("honkit26113:arena_over", 2); // victory
        }
    }
    if (entity.typeId == 'honkit26113:arena_countdown' && world.getDynamicProperty("honkit26113:arena_over") == 1) {
        world.setDynamicProperty("honkit26113:arena_over", 3); // defeat
    }
});
world.afterEvents.entitySpawn.subscribe((data) => {
    const entity = data.entity;
    if (entity.typeId === 'honkit26113:arena_countdown') {
        let count_secs = 180;
        const countdown = system.runInterval(() => {
            count_secs--;
            if (world.getDynamicProperty("honkit26113:countdown_ongoing") == true) {
                entity.getComponent('health').setCurrentValue(count_secs);
                if (entityCount === 0) {
                    system.clearRun(countdown);
                    world.setDynamicProperty("honkit26113:countdown_ongoing", false);
                    return;
                }
            }
        }, 20);
        system.runTimeout(() => {
            system.clearRun(countdown);
            world.setDynamicProperty("honkit26113:countdown_ongoing", false);
        }, 3600);
    }
    if (entity.typeId === "honkit26113:arena_monster_placeholder") {
        system.runTimeout(() => {
            entity.dimension.playSound('arena.mob_spawn', entity.location, { volume: 4 });
            entity.dimension.spawnParticle('minecraft:cauldron_explosion_emitter', entity.location);
            try {
                const monsterType = entity.getProperty("honkit26113:monster_type");
                if (typeof monsterType !== "string") {
                    world.sendMessage("Monster does not have the correct data type");
                    return;
                }
                entity.dimension.spawnEntity(monsterType.replace("_", ":"), entity.location).addTag("honkit26113.is_from_arena");
            }
            catch (error) {
                world.sendMessage({ "rawtext": [{ "translate": "arena.message.difficulty_error" }] });
            }
        }, 40);
    }
});
world.afterEvents.playerSpawn.subscribe(event => {
    const { player, initialSpawn } = event;
    system.run(() => {
        if (world.getAllPlayers().length === 1 && initialSpawn) {
            if (world.getDynamicProperty("honkit26113:arena_over") === 1) {
                world.sendMessage({ rawtext: [{ translate: "arena.message.exit_world_canceled" }] });
                player.onScreenDisplay.setActionBar({ rawtext: [{ translate: "arena.message.exit_world_canceled" }] });
            }
            world.setDynamicProperty("honkit26113:arena_over", 0);
            world.setDynamicProperty("honkit26113:countdown_ongoing", false);
            //entityCount = 7;
            world.getDimension("overworld").runCommand("kill @e[family=arena_dummy]");
        }
    });
});
//# sourceMappingURL=ArenaBattle.js.map