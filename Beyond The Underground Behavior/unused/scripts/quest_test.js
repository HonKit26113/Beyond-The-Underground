import { world , GameMode, Player } from "@minecraft/server";
import { ActionFormData, ActionFormResponse } from "@minecraft/server-ui";

world.afterEvents.itemUse.subscribe((data) => {
	const player = data.source;
	const item = player.getComponent("minecraft:inventory").container.getItem(player.selectedSlotIndex);
    if (item.typeId === "minecraft:stick") {
        const form = new ActionFormData();
        form.title("test title");
        form.body("test body");
        form.button("start");
        form.button("no");
        form.show(player).then(
            (response) => {
                switch (response?.selection) {
                    case 0:
						player.sendMessage("hello!")
                };
            }
        );
    }
})