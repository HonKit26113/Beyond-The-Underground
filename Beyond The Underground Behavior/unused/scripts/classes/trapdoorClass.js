export class trapdoorManager {
    //interact data
    static interact(block) {
        //get the dimension
        const dimension = block.dimension;
        //get the trapdoor data
        const data = this.trapdoors.find((f)=>f.id == block.typeId);
        //get the open state
        const openState = block.permutation.getState('customtrapdoor:open');
        //get the opposite state of the open state
        let oppositeState = false;
        if (openState == false) oppositeState = true;
        //set the open state
        block.setPermutation(block.permutation.withState("customtrapdoor:open", oppositeState));
        if (data == undefined) return;
        //play sounds depending on the opposite state
        if (oppositeState == false) {
            dimension.playSound(data.closeSound.soundID, block.location, {
                volume: data.closeSound.volume,
                pitch: data.closeSound.pitch
            });
        } else dimension.playSound(data.openSound.soundID, block.location, {
            volume: data.openSound.volume,
            pitch: data.openSound.pitch
        });
    }
    static detectPowered(block) {
        //set all blocks
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
        //list all blocks
        const blocks = [
            above,
            below,
            north,
            south,
            east,
            west
        ];
        let hasPower = false;
        for (const otherBlock of blocks){
            if (otherBlock != undefined && otherBlock.getRedstonePower() > 0) {
                //if the block has power, set hasPower to true
                hasPower = true;
            }
        }
        if (hasPower == true) {
            //if it has power and it didn't before, set it to powered and interact 
            const state = block.permutation.getState("customtrapdoor:powered");
            const state2 = block.permutation.getState("customtrapdoor:open");
            if (state == false) {
                if (state2 == false) this.interact(block);
                block.setPermutation(block.permutation.withState("customtrapdoor:powered", true));
            }
        } else {
            //if it doesn't have power and it did before, set it to unpowered and interact 
            const state1 = block.permutation.getState("customtrapdoor:powered");
            const state21 = block.permutation.getState("customtrapdoor:open");
            if (state1 == true) {
                if (state21 == true) this.interact(block);
                block.setPermutation(block.permutation.withState("customtrapdoor:powered", false));
            }
        }
    }
}
//all trapdoor data
trapdoorManager.trapdoors = [
    {
        id: "honkit26113:crooked_trapdoor",
        openSound: {
            soundID: "open.nether_wood_door",
            volume: 1,
            pitch: 1
        },
        closeSound: {
            soundID: "close.nether_wood_door",
            volume: 1,
            pitch: 1
        }
    }
];
