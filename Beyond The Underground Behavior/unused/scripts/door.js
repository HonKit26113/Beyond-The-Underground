import { world, system, MinecraftDimensionTypes, ItemStack, BlockPermutation } from '@minecraft/server';
//converts the dimensionID to a Y value
function dimensionToHeight(dimension) {
    const heights = [
        {
            id: MinecraftDimensionTypes.overworld,
            maxHeight: 320
        },
        {
            id: MinecraftDimensionTypes.nether,
            maxHeight: 128
        },
        {
            id: MinecraftDimensionTypes.theEnd,
            maxHeight: 256
        }
    ];
    const data = heights.find((f)=>f.id == dimension);
    if (data != undefined) {
        //return the Y value
        return data.maxHeight;
    } else return undefined;
}
const blockComps = [
    //define the block component
    {
        //the id of the block component
        id: "honkit26113:crooked_door",
        //the code of the block component
        code: {
            onTick: (data)=>{
                /*redstoneManager.redstonePowerAfterEvent(data.block, {
                    code: (block)=>{
                        if (block.permutation.getState("customdoor:open_bit") == true) return;
                        doorManager.interactWithDoor(block);
                    },
                    unpowered: (block)=>{
                        const topHalf = block.permutation.getState("customdoor:upper_block_bit");
                        let doorPart = undefined;
                        if (topHalf == false) {
                            //gets the block above
                            try {
                                doorPart = block.above(1);
                            } catch  {}
                        } else try {
                            doorPart = block.below(1);
                        } catch  {} //gets the block below
                        if (block.permutation.getState("customdoor:open_bit") == false) return;
                        if (doorPart && doorPart.hasTag(doorManager.doorTag) && doorPart.permutation.getState('customdoor:powered') == true) return;
                        doorManager.interactWithDoor(block);
                    }
                });*/
                const block = data.block;
                if (!block) return;
                const doordata = doorManager.doors.find((f)=>f.id == block.typeId);
                const topHalf = block.permutation.getState("customdoor:upper_block_bit");
                let doorPart = undefined;
                if (topHalf == false) {
                    //gets the block above
                    try {
                        doorPart = block.above(1);
                    } catch  {}
                } else try {
                    doorPart = block.below(1);
                } catch  {} //gets the block below
                if (doorPart == undefined) {
                    if (topHalf == true) {
                        block.setPermutation(BlockPermutation.resolve("minecraft:air"));
                    } else {
                        if (doordata) {
                            const item = new ItemStack(doordata.itemID, 1);
                            spawnItemAnywhere(item, block.location, block.dimension);
                        }
                        block.setPermutation(BlockPermutation.resolve("minecraft:air"));
                    }
                } else if (!doorPart.hasTag(doorManager.doorTag)) {
                    if (topHalf == true) {
                        block.setPermutation(BlockPermutation.resolve("minecraft:air"));
                    } else {
                        if (doordata) {
                            const item1 = new ItemStack(doordata.itemID, 1);
                            spawnItemAnywhere(item1, block.location, block.dimension);
                        }
                        block.setPermutation(BlockPermutation.resolve("minecraft:air"));
                    }
                }
            },
            //on interact with door
            onPlayerInteract: (data)=>{
                //interact with the door
                doorManager.interactWithDoor(data.block);
            },
            //on place door
            beforeOnPlayerPlace: (data)=>{
                const { block , player , dimension , permutationToPlace  } = data;
                const loc = block.location;
                //if the aboveBlock location is higher than the max height of the dimension, cancel the placement
                if (loc.y + 1 >= dimensionToHeight(dimension.id)) {
                    data.cancel = true;
                    return;
                }
                let blockAbove = undefined;
                let blockBelow = undefined;
                try {
                    blockBelow = dimension.getBlock({
                        x: loc.x,
                        y: loc.y - 1,
                        z: loc.z
                    });
                } catch  {}
                //if the below block is undefined, cancel the placement
                if (blockBelow == undefined) {
                    data.cancel = true;
                    return;
                }
                //if the belowBlock is air or liquid, cancel the placement
                if (blockBelow.isAir || blockBelow.isLiquid) {
                    data.cancel = true;
                    return;
                }
                try {
                    blockAbove = dimension.getBlock({
                        x: loc.x,
                        y: loc.y + 1,
                        z: loc.z
                    });
                } catch  {}
                //if the above block is undefined, cancel the placement
                if (blockAbove == undefined) {
                    data.cancel = true;
                    return;
                }
                if (blockAbove.isAir || blockAbove.isLiquid) {
                    doorManager.placeDoor(block, blockAbove);
                } else {
                    //if the aboveBlock isn't air or liquid, cancel the placement
                    data.cancel = true;
                    return;
                }
            }
        }
    }
];
function spawnItemAnywhere(item, location, dimension) {
    //spawn the item at y100
    const itemEntity = dimension.spawnItem(item, {
        x: location.x,
        y: 100,
        z: location.z
    });
    //tp the item to the specified location
    itemEntity.teleport(location);
    //return the itemEntity
    return itemEntity;
}
class doorManager {
    //interact with a door block
    static interactWithDoor(block) {
        const dim = block.dimension;
        const loc = block.location;
        //get the top half of the block
        const topHalf = block.permutation.getState("customdoor:upper_block_bit");
        //get if the block is open or not
        const open = block.permutation.getState("customdoor:open_bit");
        let doorPart = undefined;
        if (topHalf == false) {
            //gets the block above
            try {
                doorPart = block.above(1);
            } catch  {}
        } else try {
            doorPart = block.below(1);
        } catch  {} //gets the block below
        //checks if the doorPart is undefined
        if (doorPart != undefined) {
            const data = this.doors.find((f)=>f.id == block.typeId);
            let bool = false;
            if (open == true) {
                //play the close sound and set the bool constant to false
                if (data != undefined && data.closeSound != undefined) dim.playSound(data.closeSound.id, loc, {
                    pitch: data.closeSound.pitch,
                    volume: data.closeSound.volume
                });
                bool = false;
            } else {
                //play the open sound and set the bool constant to true
                if (data != undefined && data.openSound != undefined) dim.playSound(data.openSound.id, loc, {
                    pitch: data.openSound.pitch,
                    volume: data.openSound.volume
                });
                bool = true;
            }
            const blocks = [
                block,
                doorPart
            ];
            for (const door of blocks){
                //sets the open state
                try {
                    door.setPermutation(door.permutation.withState("customdoor:open_bit", bool));
                } catch  {}
            }
        }
    }
    static breakDoor(blockID, block, topHalf) {
        //does this stuff a tick later
        system.runTimeout(()=>{
            let doorPart = undefined;
            if (topHalf == false) {
                try {
                    doorPart = block.above(1);
                } catch  {}
            } else try {
                doorPart = block.below(1);
            } catch  {}
            //sets the doorPart to air
            if (doorPart != undefined && doorPart.hasTag(this.doorTag)) doorPart.setPermutation(BlockPermutation.resolve("minecraft:air"));
            //gets the door data
            const data = this.doors.find((f)=>f.id == blockID);
            if (data == undefined) return;
            const item = new ItemStack(data.itemID, 1);
            const loc = block.location;
            spawnItemAnywhere(item, {
                x: loc.x + 0.5,
                y: loc.y + 0.5,
                z: loc.z + 0.5
            }, block.dimension) //spawns the item
            ;
            block.setPermutation(BlockPermutation.resolve("minecraft:air")) //sets the main block to air
            ;
        });
    }
    static placeDoor(block, aboveBlock) {
        //does this stuff a tick later
        system.runTimeout(()=>{
            let reversed = false;
            const facing = block.permutation.getState("minecraft:cardinal_direction");
            switch(facing){
                case "north":
                    try {
                        const otherblock = block.west(1);
                        if (otherblock.typeId.includes("door")) {
                            const otherfacing = otherblock.permutation.getState("minecraft:cardinal_direction");
                            if (otherfacing == facing) {
                                reversed = true;
                            }
                        }
                    } catch  {}
                    break;
                case "south":
                    try {
                        const otherblock1 = block.east(1);
                        if (otherblock1.typeId.includes("door")) {
                            const otherfacing1 = otherblock1.permutation.getState("minecraft:cardinal_direction");
                            if (otherfacing1 == facing) {
                                reversed = true;
                            }
                        }
                    } catch  {}
                    break;
                case "east":
                    try {
                        const otherblock2 = block.north(1);
                        if (otherblock2.typeId.includes("door")) {
                            const otherfacing2 = otherblock2.permutation.getState("minecraft:cardinal_direction");
                            if (otherfacing2 == facing) {
                                reversed = true;
                            }
                        }
                    } catch  {}
                    break;
                case "west":
                    try {
                        const otherblock3 = block.south(1);
                        if (otherblock3.typeId.includes("door")) {
                            const otherfacing3 = otherblock3.permutation.getState("minecraft:cardinal_direction");
                            if (otherfacing3 == facing) {
                                reversed = true;
                            }
                        }
                    } catch  {}
                    break;
            }
            block.setPermutation(block.permutation.withState("customdoor:reversed", reversed));
            aboveBlock.setPermutation(BlockPermutation.resolve(block.typeId)); //sets aboveBlock to the main block typeId
            aboveBlock.setPermutation(aboveBlock.permutation.withState("customdoor:upper_block_bit", true)); //sets the upper block bit state to true
            aboveBlock.setPermutation(aboveBlock.permutation.withState("minecraft:cardinal_direction", facing).withState("customdoor:reversed", reversed)); //sets the facing direction to the main blocks facing direction
        });
    }
}
//set the door tag
doorManager.doorTag = "customdoor:is_door";
doorManager.doors = [
    //door data
    {
        //the typeId of the block
        id: "honkit26113:crooked_door",
        //the typeId of the item
        itemID: "honkit26113:crooked_door_item",
        //the opening sound data
        openSound: {
            id: "open.nether_wood_door",
            volume: 1,
            pitch: 1
        },
        //the closing sound data
        closeSound: {
            id: "close.nether_wood_door",
            volume: 1,
            pitch: 1
        }
    }
];
/*class redstoneManager {
    static powered(block) {
        if (!block.hasTag(doorManager.doorTag)) return;
        let powered = false;
        let above = undefined;
        try {
            above = block.above(1);
        } catch  {}
        let below = undefined;
        try {
            below = block.below(1);
        } catch  {}
        let north = undefined;
        try {
            north = block.north(1);
        } catch  {}
        let south = undefined;
        try {
            south = block.south(1);
        } catch  {}
        let east = undefined;
        try {
            east = block.east(1);
        } catch  {}
        let west = undefined;
        try {
            west = block.west(1);
        } catch  {}
        const sides = [
            above,
            below,
            north,
            south,
            east,
            west
        ];
        for (const side of sides){
            if (side != undefined && side.getRedstonePower() > 0) powered = true;
        }
        return powered;
    }
    static redstonePowerAfterEvent(block, event) {
        if (!block.hasTag(doorManager.doorTag)) return;
        const state = block.permutation.getState("customdoor:powered");
        const powered = this.powered(block);
        if (state) {
            if (!powered) {
                block.setPermutation(block.permutation.withState("customdoor:powered", false));
                if (event.unpowered != undefined) event.unpowered(block);
            }
            return;
        }
        if (!powered) return;
        block.setPermutation(block.permutation.withState("customdoor:powered", true));
        event.code(block);
    }
}*/
world.beforeEvents.playerBreakBlock.subscribe((data)=>{
    if (data.block.hasTag(doorManager.doorTag)) {
        //if the block has the door tag, breakDoor
        data.cancel = true;
        doorManager.breakDoor(data.block.typeId, data.block, data.block.permutation.getState("customdoor:upper_block_bit"));
    } else try {
        const blockAbove = data.block.above(1);
        //if the above block has the door tag, breakDoor
        if (blockAbove.hasTag(doorManager.doorTag)) doorManager.breakDoor(blockAbove.typeId, blockAbove, blockAbove.permutation.getState("customdoor:upper_block_bit"));
    } catch  {}
});
let int = 0;
world.beforeEvents.worldInitialize.subscribe((data)=>{
    //needed to stop crashes when leaving the world
    int = int + 1;
    if (int != 1) return;
    for (const comp of blockComps){
        //registers all custom block components
        data.blockComponentRegistry.registerCustomComponent(comp.id, comp.code);
    }
});
