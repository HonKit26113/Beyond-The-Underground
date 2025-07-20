import { Block, world } from "@minecraft/server";

//set block fence tag here
const fenceTag = 'is_fence'

const excludedBlocks = [
    'minecraft:wooden_door', 
    'minecraft:iron_door', 
    'minecraft:acacia_door', 
    'minecraft:birch_door', 
    'minecraft:crimson_door', 
    'minecraft:dark_oak_door', 
    'minecraft:jungle_door', 
    'minecraft:oak_door', 
    'minecraft:spruce_door', 
    'minecraft:warped_door', 
    'minecraft:mangrove_door',
    'minecraft:cherry_door',
    'minecraft:bamboo_door',
    'honkit26113:crooked_door',
    'honkit26113:rainbow_gum_door',
    'honkit26113:crooked_trapdoor',
    'honkit26113:rainbow_gum_trapdoor',
    'minecraft:trapdoor', 
    'minecraft:glass',
    'minecraft:glass_pane',
    "minecraft:yellow_flower",
    "minecraft:red_flower"
]

const excludedTags = [
    "minecraft:crop",
    "plant",
    "snow",
    "text_sign",
    "trapdoors"
]

export class fence_Manager {
    static update_Fence_States(Fence) {
        let north = undefined;
        try {
            north = Fence.north(1);
        } catch { }
        let south = undefined;
        try {
            south = Fence.south(1);
        } catch { }
        let east = undefined;
        try {
            east = Fence.east(1);
        } catch { }
        let west = undefined;
        try {
            west = Fence.west(1);
        } catch { }
        const blocks = [
            { block: north, side: "north" },
            { block: south, side: "south" },
            { block: east, side: "east" },
            { block: west, side: "west" },
        ];
        for (const blockData of blocks) {
            if (blockData.block != undefined) {
                if (!(blockData.block.isLiquid || blockData.block.isAir || excludedBlocks.includes(blockData.block) || excludedTags.includes(blockData.block.hasTag))) {
                    Fence.setPermutation(Fence.permutation.withState("fence:connect_" + blockData.side, true));
                } else {
                    Fence.setPermutation(Fence.permutation.withState("fence:connect_" + blockData.side, false));
                }
            } else {
                Fence.setPermutation(Fence.permutation.withState("fence:connect_" + blockData.side, false));
            }
        }
    }
    static updateFencesAround(Block) {
        let north = undefined;
        try {
            north = Block.north(1);
        } catch { }
        let south = undefined;
        try {
            south = Block.south(1);
        } catch { }
        let east = undefined;
        try {
            east = Block.east(1);
        } catch { }
        let west = undefined;
        try {
            west = Block.west(1);
        } catch { }
        const blocks = [Block, north, south, east, west];
        for (const block of blocks) {
            if (block != undefined) {
                if (block.hasTag(fenceTag)) this.update_Fence_States(block);
            }
        }
    }
}

world.afterEvents.playerBreakBlock.subscribe((data) => {
    fence_Manager.updateFencesAround(data.block)
})

world.afterEvents.playerPlaceBlock.subscribe((data) => {
    fence_Manager.updateFencesAround(data.block)
})