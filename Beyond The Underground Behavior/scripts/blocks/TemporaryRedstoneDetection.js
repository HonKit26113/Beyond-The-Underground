import { system, world } from '@minecraft/server';
import { toggleOpenGate } from './FenceGates';
import { toggleOpenTrapdoor } from './Trapdoors';
import { toggleOpenDoor } from './Doors';
var BlockTypes;
(function (BlockTypes) {
    BlockTypes["FenceGate"] = "_fence_gate";
    BlockTypes["Trapdoor"] = "_trapdoor";
    BlockTypes["Door"] = "_door";
})(BlockTypes || (BlockTypes = {}));
function handleAdjacentBlocks(block, typeSubstring, toggleFn, isButton = false) {
    const sides = [
        block.north(),
        block.east(),
        block.south(),
        block.west(),
        ...(isButton ? [block.above(2)] : [])
    ];
    const execute = () => {
        for (const b of sides) {
            if (b &&
                b.typeId.includes("honkit26113") &&
                b.typeId.includes(typeSubstring)) {
                toggleFn(b);
            }
        }
    };
    if (isButton) {
        system.runTimeout(execute, (block.typeId.includes("stone") && block.typeId.includes("button")) ? 20 : 30);
    }
    else
        execute();
}
world.afterEvents.buttonPush.subscribe((e) => {
    handleAdjacentBlocks(e.block, BlockTypes.FenceGate, toggleOpenGate, true);
    handleAdjacentBlocks(e.block, BlockTypes.Trapdoor, toggleOpenTrapdoor, true);
    handleAdjacentBlocks(e.block, BlockTypes.Door, toggleOpenDoor, true);
});
world.afterEvents.pressurePlatePop.subscribe((e) => {
    handleAdjacentBlocks(e.block, BlockTypes.FenceGate, toggleOpenGate);
    handleAdjacentBlocks(e.block, BlockTypes.Trapdoor, toggleOpenTrapdoor);
    handleAdjacentBlocks(e.block, BlockTypes.Door, toggleOpenDoor);
});
world.afterEvents.pressurePlatePush.subscribe((e) => {
    handleAdjacentBlocks(e.block, BlockTypes.Trapdoor, toggleOpenTrapdoor);
    //handleAdjacentBlocks(e.block, BlockTypes.Door, toggleOpenDoor);
});
world.afterEvents.leverAction.subscribe((e) => {
    // we only need this event to fire when the lever is switched off, because the block automatically
    // opens with the onRedstoneUpdate component.
    // It doesn't automatically close because that's disabled to account for vanilla pressure plate and button behaviour.
    if (!e.isPowered) {
        handleAdjacentBlocks(e.block, BlockTypes.FenceGate, toggleOpenGate);
        handleAdjacentBlocks(e.block, BlockTypes.Trapdoor, toggleOpenTrapdoor);
        handleAdjacentBlocks(e.block, BlockTypes.Door, toggleOpenDoor);
    }
});
//# sourceMappingURL=TemporaryRedstoneDetection.js.map