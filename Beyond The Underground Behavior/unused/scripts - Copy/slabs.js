import { world } from "@minecraft/server";
import SelectionBoxes from "./selection_boxes";

const verticalHalves = new SelectionBoxes(
  { origin: [-8, 8, -8], size: [16, 8, 16], name: "top" },
  { origin: [-8, 0, -8], size: [16, 8, 16], name: "bottom" }
);

const { slab_types } = [
	"honkit26113:soul_bricks_slab",
	"honkit26113:slimy_stone_bricks_slab",
	"honkit26113:slimy_deepslate_bricks_slab",
	"honkit26113:slimy_deepslate_tiles_slab",
	"honkit26113:limestone_bricks_slab",
	"honkit26113:packed_ice_bricks_slab",
	"honkit26113:limestone_slab",
	"honkit26113:frosted_stone_slab",
	"honkit26113:crooked_slab"
]

world.afterEvents.itemUseOn.subscribe((data) => {
	if (data.block.typeId.includes(slab_types)) {

		// Returns the selected vertical half ("top" or "bottom").
		const selectedVerticalHalf = verticalHalves.getSelected(data.faceLocation);
		world.sendMessage(`The ${selectedVerticalHalf} of the block was selected!`);
		
	}
  
  });