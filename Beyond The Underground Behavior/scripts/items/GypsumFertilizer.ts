import { world, BlockPermutation, system, ItemCustomComponent, Block, Player, Entity, Vector3, Structure } from "@minecraft/server";
import { decrement_stack } from "../Functions";

const smallTreeIds = [
    "minecraft:oak_sapling",
    "minecraft:birch_sapling",
    "minecraft:spruce_sapling",
    "minecraft:acacia_sapling",
    "minecraft:jungle_sapling",
    "minecraft:mangrove_propagule",
    "minecraft:cherry_sapling"
]

const largeTreeIds = [
    "minecraft:dark_oak_sapling",
    "minecraft:pale_oak_sapling",
    "minecraft:azure_bluet",
    "minecraft:cornflower",
    "minecraft:dandelion",
    "minecraft:oxeye_daisy"
]

const cropIds = [
    "minecraft:wheat",
    "minecraft:beetroot",
    "minecraft:pumpkin_stem",
    "minecraft:melon_stem",
    "minecraft:pitcher_crop",
    "minecraft:cocoa",
    "minecraft:sweet_berry_bush"
]

const specialIds = new Map([
    ["minecraft:small_grass", "minecraft:tall_grass"],
    ["minecraft:seagrass", "minecraft:seagrass"], // new block with different state is placed
    ["minecraft:short_dry_grass", "minecraft:tall_dry_grass"],
    ["minecraft:fern", "minecraft:large_fern"],
    ["minecraft:torchflower_crop", "minecraft:torchflower"],
    ["minecraft:small_dripleaf", "minecraft:big_dripleaf"]
])

const useFertilizer: ItemCustomComponent = {
    onUseOn({block, source}, {}) {
        const id = block.typeId;
        const dim = block.dimension;

        if (!smallTreeIds.includes(id) && !largeTreeIds.includes(id) && !cropIds.includes(id) && !specialIds.has(id)) return;

        // Short grass
        if (specialIds.has(id)) {
            if ((id === "minecraft:short_grass" && !block.above().isAir) ||
                (id === "minecraft:seagrass" && (!(block.above().typeId === "minecraft:water")) || block.permutation.getState("sea_grass_type") !== "default")) {
                sendErrorMessage(source);
            } else {
                if (id === "minecraft:seagrass") {
                    block.setPermutation(BlockPermutation.resolve(id, {"sea_grass_type": "double_bot"}));
                    block.above().setPermutation(BlockPermutation.resolve(id, {"sea_grass_type": "double_top"}));
                } else {
                    block.setType(specialIds.get(id));
                }
                spawnParticles(block);
                decrement_stack(source);
            }
            return;
        }

        // Small saplings
        let place = false;
        if (smallTreeIds.includes(id)) {
            block.setType("minecraft:air");
            switch (id) {
                case "minecraft:oak_sapling":
                    place = dim.placeFeature("minecraft:oak_tree_feature", block.location);
                    break;
                case "minecraft:birch_sapling":
                    place = dim.placeFeature("minecraft:birch_tree_feature", block.location);
                    break;
                case "minecraft:spruce_sapling":
                    if (checkLargeTree(block, source)) break;
                    place = dim.placeFeature("minecraft:spruce_tree_feature", block.location);
                    break;
                case "minecraft:acacia_sapling":
                    place = dim.placeFeature("minecraft:savanna_tree_feature", block.location);
                    break;
                case "minecraft:jungle_sapling":
                    if (checkLargeTree(block, source)) break;
                    place = dim.placeFeature("minecraft:jungle_tree_feature", block.location);
                    break;
                case "minecraft:mangrove_propagule":
                    place = dim.placeFeature("minecraft:mangrove_tree_feature", block.location);
                    break;
                case "minecraft:cherry_sapling":
                    place = dim.placeFeature("minecraft:cherry_tree_feature", block.location);
                    break;
                default:
            }
        }
        
        // Large trees and giant flowers
        if (largeTreeIds.includes(id)) {
            place = checkLargeTree(block, source);
        }
        
        // Farmland crops
        if (cropIds.includes(id)) {
            switch (id) {
                case "minecraft:pitcher_crop":
                    const above = block.above();
                    if (block.permutation.getState("growth") === 7) return;
                    if (block.permutation.getState("upper_block_bit") === true) return;
                    if (above.isAir) {
                        block.setPermutation(BlockPermutation.resolve(id, {"growth": 7}));
                        above.setPermutation(BlockPermutation.resolve(id, {"growth": 7, "upper_block_bit": true}));
                    } else {
                        block.setPermutation(BlockPermutation.resolve(id, {"growth": 2}));
                    }
                    break;
                case "minecraft:cocoa":
                    const direction = block.permutation.getState("direction");
                    block.setPermutation(BlockPermutation.resolve(id, {"age": 2, "direction": direction}));
                    break;
                default:
                    block.setPermutation(BlockPermutation.resolve(id, {"growth": 7}));
            }
            place = true;
        }

        if (place) {
            spawnParticles(block);
            decrement_stack(source);
        } else {
            block.setType(id);
            sendErrorMessage(source);
        }
    }
}

function checkLargeTree(block: Block, source: Entity): boolean {
    const id = block.typeId;
    const dim = block.dimension;
    const neighbourConditions = new Map([
        [(block.north().typeId === id && block.west().typeId === id && block.west().north().typeId === id), [block.north(), block.west(), block, block.west().north()]],
        [(block.north().typeId === id && block.east().typeId === id && block.east().north().typeId === id), [block, block.east(), block.east().north(), block.north()]],
        [(block.east().typeId === id && block.south().typeId === id && block.east().south().typeId === id), [block.east().south(), block.south(), block.east(), block]],
        [(block.west().typeId === id && block.south().typeId === id && block.west().south().typeId === id), [block, block.south(), block.west().south(), block.west()]]
    ])
    for (const cond of neighbourConditions.keys()) {
        if (cond) {
            neighbourConditions.get(cond).forEach(block => {
                block.setType("minecraft:air");
            })
            let place = false;
            switch (id) {
                case "minecraft:jungle_sapling":
                    place = dim.placeFeature("minecraft:mega_jungle_tree_feature", neighbourConditions.get(cond)[3].location);
                    world.sendMessage(`${place}`);
                    break;
                case "minecraft:dark_oak_sapling": 
                    place = dim.placeFeature("minecraft:roofed_tree_feature", neighbourConditions.get(cond)[3].location);
                    break;
                case "minecraft:pale_oak_sapling": 
                    place = dim.placeFeature("minecraft:pale_oak_tree_feature", neighbourConditions.get(cond)[3].location);
                    break;
                case "minecraft:spruce_sapling": 
                    place = dim.placeFeature("minecraft:mega_spruce_tree_feature", neighbourConditions.get(cond)[3].location);
                    break;
                case "minecraft:azure_bluet":
                case "minecraft:cornflower": 
                case "minecraft:dandelion":
                case "minecraft:oxeye_daisy":
                    const structureName = `mystructure:giant_${id.replace("minecraft:", "")}`;
                    //world.sendMessage(`structureName: ${structureName}`);
                    const structure = world.structureManager.get(structureName);
                    place = checkSpace(block, structure);
                    //world.sendMessage(`place: ${place}`);
                    if (place) {
                        const {x, y, z} = neighbourConditions.get(cond)[3].location;
                        const {x: dx, y: dy, z: dz} = getOffset(structure);
                        world.structureManager.place(structure, dim, {x: x - dx, y: y + dy, z: z - dz});
                    }
                    break;
            }
            if (place) {
                spawnParticles(block);
                decrement_stack(source);
            } else {
                for (const b of neighbourConditions.get(cond).concat([block])) {
                    b.setType(id);
                }
                sendErrorMessage(source);
            }
            return true;
        }
    }
    return false;
}

/**
 * @param block Block interacted with
 * @param structure Structure to be placed
 * @returns `true` if structure has enough room to be placed, `false` otherwise
 */
function checkSpace(block: Block, structure: Structure): boolean {
    const size = structure.size;
    const offset = getOffset(structure);
    const targetBlock = block.west(offset.x).above(offset.y).north(offset.z);
    for (let y = 0; y < size.y; y++) {
        if (!targetBlock.above(y).isAir && !targetBlock.above(y).hasTag("dirt")) {
            //world.sendMessage(`Obstruction of ${targetBlock.typeId} found at ${JSON.stringify(targetBlock.location)}`);
            return false;
        }
    }
    const aboveBlock = targetBlock.above(size.y-2);
    for (let x = 0; x < size.x; x++) {
        for (let z = 0; z < size.z; z++) {
            const thisBlock = aboveBlock.south(z).east(x);
            if (!thisBlock.isAir && !thisBlock.hasTag("dirt")) {
                //world.sendMessage(`Obstruction of ${targetBlock.typeId} found at ${JSON.stringify(targetBlock.location)}`);
                return false;
            }
        }
    }
    return true;
}

function getOffset(structure: Structure): Vector3 {
    let offset: Vector3 = {x: 0, y: 0, z: 0};
    switch (structure.id) {
        case "mystructure:giant_azure_bluet":
        case "mystructure:giant_cornflower":
        case "mystructure:giant_oxeye_daisy":
            offset = {x: 3, y: 0, z: 3};
            break;
        case "mystructure:giant_dandelion":
            offset = {x: 2, y: 0, z: 2};
            break;
        default:
    }
    return offset;
}

function spawnParticles(block: Block) {
    const dim = block.dimension;
    const {x, y, z} = block.location;
    const targetLoc = {x: x + 0.5, y: y + 0.5, z: z + 0.5};
    dim.playSound('item.bone_meal.use', targetLoc);
    dim.spawnParticle("minecraft:crop_growth_emitter", targetLoc);
}

function sendErrorMessage(player: Entity) {
    if (!(player instanceof Player)) return;
    player.onScreenDisplay.setActionBar({ "rawtext": [{ "translate": "gypsum_fertilizer.message.fail" }]});
}

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("honkit26113:gypsum_fertilizer", useFertilizer);
});