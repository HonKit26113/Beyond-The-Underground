import { CommandPermissionLevel, CustomCommandStatus, system, world } from '@minecraft/server';
import { ModalFormData, ActionFormData } from "@minecraft/server-ui";
// debug only
/*world.afterEvents.itemUse.subscribe((data) => {
    const player = data.source;
    const item = player.getComponent("minecraft:inventory").container.getItem(player.selectedSlotIndex);
    if (item.typeId === "minecraft:breeze_rod") {
        player.setDynamicProperty("honkit26113:xp_tank_deposited", undefined);
        player.setDynamicProperty("honkit26113:xp_tank_level", 0);
    }
});*/
system.beforeEvents.startup.subscribe((init) => {
    const helloCommand = {
        name: "btu:xp_tank_count",
        description: "Prints `honkit26113:xp_tank_count`",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: []
    };
    init.customCommandRegistry.registerCommand(helloCommand, printCountCommand);
});
function printCountCommand() {
    system.run(() => {
        const count = world.getDynamicProperty("honkit26113:xp_tank_count");
        world.sendMessage(`honkit26113:xp_tank_count: ${JSON.stringify(count)}`);
    });
    return {
        status: CustomCommandStatus.Success
    };
}
const xpTankPlacement = {
    onPlace({}, {}) {
        const count = world.getDynamicProperty("honkit26113:xp_tank_count");
        const current = typeof count === "number" ? count : 0;
        world.setDynamicProperty("honkit26113:xp_tank_count", current + 1);
    },
    onBreak({}, {}) {
        const count = world.getDynamicProperty("honkit26113:xp_tank_count");
        const current = typeof count === "number" ? count : 0;
        world.setDynamicProperty("honkit26113:xp_tank_count", Math.max(0, current - 1));
    }
};
system.runInterval(() => {
    const tankCount = world.getDynamicProperty("honkit26113:xp_tank_count");
    if (typeof tankCount !== "number" || tankCount <= 0) {
        return; // skip if no tanks exist
    }
    const day = world.getDay();
    const storedDay = world.getDynamicProperty("honkit26113:day_counter");
    if (storedDay !== day) {
        world.setDynamicProperty("honkit26113:day_counter", day);
        world.getAllPlayers().forEach(player => {
            incrementPlayerTankStorage(player);
            world.sendMessage(`[XP Tank] It's a new day! The XP Tank has generated some XP for everyone currently playing.`);
        });
    }
}, 20);
const xpTankInteract = {
    onPlayerInteract({ player }, {}) {
        // Initalize
        let currentTankLevel = player.getDynamicProperty("honkit26113:xp_tank_level");
        // if (typeof currentTankLevel != "number") {
        // throw new Error("wrong type for honkit26113:xp_tank_level");
        // }
        if (typeof currentTankLevel === "undefined") {
            player.setDynamicProperty("honkit26113:xp_tank_level", 0);
            currentTankLevel = 0;
        }
        let deposited = player.getDynamicProperty("honkit26113:xp_tank_deposited");
        if (typeof deposited === "undefined") {
            player.setDynamicProperty("honkit26113:xp_tank_deposited", 0);
            deposited = 0;
        }
        let generated = player.getDynamicProperty("honkit26113:xp_tank_generated");
        if (typeof generated === "undefined") {
            player.setDynamicProperty("honkit26113:xp_tank_generated", 0);
            generated = 0;
        }
        let xpNeeded = levelXPNeeded[(currentTankLevel + 1)] - deposited;
        // XP Tank menu
        const form = new ActionFormData();
        form.title(`XP Tank - §2Grade ${currentTankLevel}§r`);
        if (generated > 0) {
            form.button(`Collect\n§2[${Math.round(generated * 10) / 10} Levels]§r`, "textures/ui/download_backup");
        }
        else {
            form.button("Collect\n§c[None to collect]§r", "textures/ui/download_backup");
        }
        if (currentTankLevel < 10) {
            form.body(`The XP Tank generates XP levels every new Minecraft day!\nAt §aGrade ${currentTankLevel}§r, you'll receive §a${levelXPGenerated[currentTankLevel]}§r Levels.\nAt §aGrade ${currentTankLevel + 1}§r, you'll receive §a${levelXPGenerated[(currentTankLevel + 1)]}§r Levels.\n\nYour current XP level: §a${player.level}§r\nLevels to be collected: §a${Math.round(generated * 10) / 10}§r\nDeposit §a${xpNeeded}§r more levels to reach Grade ${currentTankLevel + 1} [ ${deposited} / ${levelXPNeeded[(currentTankLevel + 1)]} ] (${Math.round((Number(deposited) / Number(levelXPNeeded[(currentTankLevel + 1)]) * 100) * 10) / 10}%%)`);
            if (player.level > 0) {
                form.button("Deposit", "textures/ui/backup_replace");
            }
            else {
                form.button("Deposit\n§c[None to deposit]§r", "textures/ui/backup_replace");
            }
        }
        else {
            form.body(`The XP Tank generates XP levels every new Minecraft day!\nAt §aGrade ${currentTankLevel}§r, you'll receive §a${levelXPGenerated[currentTankLevel]}§r Levels.\n\nYour current XP level: §a${player.level}§r\nLevels to be collected: §a${Math.round(generated * 10) / 10}§r\nXP Tank is at max level!`);
        }
        form.show(player).then((response) => {
            switch (response?.selection) {
                case 0:
                    collectXP(player);
                    break;
                case 1:
                    if (player.level > 0) {
                        depositXP(player);
                    }
                    break;
                default:
                    break;
            }
        });
    }
};
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("honkit26113:xp_tank_interact", xpTankInteract);
    blockComponentRegistry.registerCustomComponent("honkit26113:xp_tank_placement", xpTankPlacement);
});
const levelXPNeeded = {
    // Tank level: XP Levels required
    0: 0,
    1: 10,
    2: 20,
    3: 30,
    4: 50,
    5: 70,
    6: 100,
    7: 140,
    8: 180,
    9: 240,
    10: 300
};
const levelXPGenerated = {
    // Tank level: XP Levels generated each day
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 6,
    6: 8,
    7: 10,
    8: 12,
    9: 14,
    10: 15
};
function incrementPlayerTankStorage(player) {
    const tankLevel = player.getDynamicProperty(`honkit26113:xp_tank_level`);
    generateXPLevel(player, levelXPGenerated[tankLevel]);
}
function generateXPLevel(player, level) {
    const generated = Number(player.getDynamicProperty(`honkit26113:xp_tank_generated`)) || 0;
    player.setDynamicProperty(`honkit26113:xp_tank_generated`, generated + level);
}
function collectXP(player) {
    const toCollect = Number(player.getDynamicProperty(`honkit26113:xp_tank_generated`)) || 0;
    player.setDynamicProperty(`honkit26113:xp_tank_generated`, 0);
    if (toCollect % 1 != 0) {
        player.addExperience(player.totalXpNeededForNextLevel * (toCollect % 1));
    }
    player.addLevels(Math.floor(toCollect));
}
function depositXP(player) {
    const deposited = Number(player.getDynamicProperty(`honkit26113:xp_tank_deposited`)) || 0;
    let tankLevel = Number(player.getDynamicProperty(`honkit26113:xp_tank_level`)) || 0;
    const level = player.level;
    const form = new ModalFormData();
    form.title("Deposit XP Levels");
    if (level > levelXPNeeded[10] - deposited) {
        form.slider("Select levels to deposit", Math.floor(level * 0.1), levelXPNeeded[9] - deposited, { defaultValue: Math.floor(level * 0.5) });
    }
    else {
        form.slider("Select levels to deposit", Math.floor(level * 0.1), Math.floor(level), { defaultValue: Math.floor(level * 0.5) });
    }
    form.show(player).then((response) => {
        try {
            const amount = response.formValues[0];
            const newDeposited = deposited + amount;
            player.setDynamicProperty(`honkit26113:xp_tank_deposited`, newDeposited);
            while (tankLevel < 10 && newDeposited >= (levelXPNeeded[(tankLevel + 1)])) {
                tankLevel++;
            }
            player.setDynamicProperty(`honkit26113:xp_tank_level`, tankLevel);
            player.addLevels(Math.floor(amount * -1));
            if (tankLevel == 10) {
                player.addLevels(newDeposited - Number(levelXPNeeded[(tankLevel + 1)]));
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
//# sourceMappingURL=XpTank.js.map