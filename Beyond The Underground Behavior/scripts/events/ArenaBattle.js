import { world, system, BlockPermutation, ItemStack, Difficulty } from '@minecraft/server';
import { arenaConfig } from './ArenaConfig';
// CUSTOM COMPONENT PARAMS ////
const arenaBiomes = {
    LimestoneCaves: "limestone_caves",
    IceCaves: "ice_caves"
};
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
 * @returns total entity amount across all phases for an arena type
 */
function getEntityCount(arena) {
    let count = 0;
    for (const phase of arena.phases) {
        for (const mob of phase.mobs) {
            count += mob.count;
        }
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
    onPlayerInteract({ block, player }, { params }) {
        const { x, y, z } = block.location;
        const dim = block.dimension;
        world.setDynamicProperty("honkit26113:arena_over", 1); // ongoing
        world.setDynamicProperty("honkit26113:countdown_ongoing", true);
        const thisArena = getArenaData(params.biome);
        const phaseId = 0; // This placeholder will change once phases are implemented
        const thisPhases = thisArena.phases;
        entity_count = getEntityCount(thisArena); // This entity_count system needs to be refactored for phases to be implemented
        dim.playSound('block.bell.hit', block.location, { volume: 4 });
        block.setPermutation(BlockPermutation.resolve(block.typeId, { "honkit26113:started": 2 }));
        for (let i = 1; i <= 3; i++) {
            block.below(i).setPermutation(BlockPermutation.resolve(block.below(i)?.typeId, { "honkit26113:activated": true }));
        }
        let count_secs = 3;
        const countdown = system.runInterval(() => {
            player.onScreenDisplay.setActionBar([{ "rawtext": [{ "translate": "arena.message.starting_in" }] }, { "text": " §6[0:0" }, { "text": count_secs.toString() }, { "text": "]§r!" }]);
            count_secs--;
        }, 20);
        const randVector3 = {
            x: x + Math.round(Math.random() * 9 + 1) - 5,
            y: y - 3,
            z: z + Math.round(Math.random() * 9 + 1) - 5
        };
        const tag = 'honkit26113.is_arena_placeholder';
        system.runTimeout(() => {
            system.clearRun(countdown);
            player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "arena.message.battle_start" }] });
            dim.spawnEntity('honkit26113:arena_entity_counter', block.location);
            dim.spawnEntity('honkit26113:arena_countdown', block.location);
            for (const mob of thisPhases[phaseId].mobs) {
                for (let i = 0; i < mob.count; i++) {
                    dim.spawnEntity(mob.entity, randVector3).addTag(tag);
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
const checkForFinish = {
    onTick({ block }, { params }) {
        // 1 == ongoing battle
        // 2 == victory
        // 3 == defeat
        const biome = params.biome;
        const dim = block.dimension;
        const loc = block.location;
        if (world.getDynamicProperty("honkit26113:arena_over") == 2) { // victory
            dim.runCommand(`title @a times 20 120 30`);
            dim.runCommand(`title @a title `);
            dim.runCommand(`titleraw @a subtitle { "rawtext": [{ "translate": "arena.message.victory" }]}`);
            dim.runCommand(`title @a reset`);
            world.setDynamicProperty("honkit26113:arena_over", 0); // battle over
            block.setPermutation(BlockPermutation.resolve(block.typeId, { "honkit26113:started": 3 }));
            // play victory sound to nearby players
            const nearbyPlayers = block.dimension.getPlayers({
                location: block.location,
                maxDistance: 32
            });
            for (const p of nearbyPlayers) {
                p.playSound("arena.complete", { pitch: 1, volume: 3 });
            }
            dim.getEntities({ type: "honkit26113:arena_entity_counter", location: loc }).forEach(entity => {
                entity.getComponent('health').setCurrentValue(0);
            });
            dim.getEntities({ type: "honkit26113:arena_countdown", location: loc }).forEach(entity => {
                entity.getComponent('health').setCurrentValue(0);
            });
            const thisArena = getArenaData(params.biome);
            for (const r of thisArena.rewards) {
                dim.spawnItem(new ItemStack(r.item, r.count), loc);
            }
            world.stopMusic();
            entity_count = getEntityCount(getArenaData(biome));
        }
        if (world.getDynamicProperty("honkit26113:arena_over") == 3) { // defeat
            block.dimension.runCommand(`title @a times 20 120 30`);
            block.dimension.runCommand(`title @a title `);
            block.dimension.runCommand(`titleraw @a subtitle { "rawtext": [{ "translate": "arena.message.defeat" }]}`);
            block.dimension.runCommand(`title @a reset`);
            world.setDynamicProperty("honkit26113:arena_over", 0); // battle over
            block.setPermutation(BlockPermutation.resolve(block.typeId, { "honkit26113:started": 3 }));
            block.dimension.getEntities({ type: "honkit26113:arena_entity_counter", location: block.location }).forEach(entity => {
                entity.getComponent('health').setCurrentValue(0);
            });
            block.dimension.getEntities({ type: "honkit26113:arena_countdown", location: block.location }).forEach(entity => {
                entity.getComponent('health').setCurrentValue(0);
            });
            world.stopMusic();
            entity_count = getEntityCount(getArenaData(biome));
        }
        if (world.getDynamicProperty('honkit26113:arena_over') != 1 && block.dimension.getEntities({ type: "honkit26113:arena_entity_counter", location: block.location }).length == 0 && block.dimension.getEntities({ type: "honkit26113:arena_countdown", location: block.location }).length == 0) {
            block.setPermutation(BlockPermutation.resolve(block.typeId, { "honkit26113:started": 3 }));
        }
    }
};
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
var entity_count = 0;
world.afterEvents.entityDie.subscribe((data) => {
    /*const arena_mobs = [
        "honkit26113:scorpion",
        "honkit26113:sandy_skelly"
    ];*/
    const entity = data.deadEntity;
    //if (arena_mobs.includes(entity.typeId) && entity.hasTag("honkit26113.is_from_arena")) {
    if (entity.isValid && entity.hasTag("honkit26113.is_from_arena")) {
        const arena_placeholder = entity.dimension.getEntities({
            type: "honkit26113:arena_entity_counter",
            location: entity.location
        });
        entity_count--;
        arena_placeholder.forEach(entity => {
            entity.getComponent('health').setCurrentValue(entity_count);
        });
        if (entity_count == 0) {
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
                if (entity_count == 0) {
                    system.clearRun(countdown);
                }
            }
        }, 20);
        system.runTimeout(() => {
            system.clearRun(countdown);
            world.setDynamicProperty("honkit26113:countdown_ongoing", false);
        }, 3600);
    }
    /*const arena_mobs = [
        'honkit26113:arena_sandy_skelly_placeholder',
        'honkit26113:arena_scorpion_placeholder'
    ]*/
    //if (arena_mobs.includes(entity.typeId)) {
    // This REQUIRES that ALL arena mobs follow the same naming convention.
    if (entity.typeId.includes("honkit26113:arena_") && entity.typeId.includes("_placeholder")) {
        system.runTimeout(() => {
            entity.dimension.playSound('arena.mob_spawn', entity.location, { volume: 4 });
            entity.dimension.spawnParticle('minecraft:cauldron_explosion_emitter', entity.location);
            try {
                entity.dimension.spawnEntity((entity.typeId.replace('arena_', '')).replace('_placeholder', ''), entity.location).addTag("honkit26113.is_from_arena");
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
        if (world.getAllPlayers().length == 1 && initialSpawn) {
            if (world.getDynamicProperty("honkit26113:arena_over") == 1) {
                world.sendMessage({ rawtext: [{ translate: "arena.message.exit_world_canceled" }] });
                player.onScreenDisplay.setActionBar({ rawtext: [{ translate: "arena.message.exit_world_canceled" }] });
            }
            world.setDynamicProperty("honkit26113:arena_over", 0);
            world.setDynamicProperty("honkit26113:countdown_ongoing", false);
            entity_count = 7;
            world.getDimension("overworld").runCommand("kill @e[family=arena_dummy]");
        }
    });
});
//# sourceMappingURL=ArenaBattle.js.map