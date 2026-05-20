import { BlockCustomComponent, CommandPermissionLevel, CustomCommand, CustomCommandResult, CustomCommandStatus, EquipmentSlot, ItemStack, Player, PlayerCursorInventoryComponent, system, world } from '@minecraft/server';
import { ModalFormData, ActionFormData, ModalFormResponse, MessageFormData } from "@minecraft/server-ui";
import { REPAIR_LIMIT } from '../items/CombustionAmulet';

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
  const helloCommand: CustomCommand = {
    name: "honkit26113:xp_tank_count",
    description: "DEBUG: Prints `honkit26113:xp_tank_count`",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    optionalParameters: []
  };
  init.customCommandRegistry.registerCommand(helloCommand, printCountCommand);
})


function printCountCommand(): CustomCommandResult {
    system.run(() => {
        const count = world.getDynamicProperty("honkit26113:xp_tank_count");
        world.sendMessage(`honkit26113:xp_tank_count: ${JSON.stringify(count)}`);
    });
    return {
      status: CustomCommandStatus.Success
    };
}


const xpTankPlacement: BlockCustomComponent = {
    onPlace({}, {}) {
        const count = world.getDynamicProperty("honkit26113:xp_tank_count");
        const current = typeof count === "number" ? count : 0;

        world.setDynamicProperty("honkit26113:xp_tank_count", current + 1);
    },

    onBreak({}, {}) {
        const count = world.getDynamicProperty("honkit26113:xp_tank_count");
        const current = typeof count === "number" ? count : 0;

        world.setDynamicProperty(
            "honkit26113:xp_tank_count",
            Math.max(0, current - 1)
        );
    }
}

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
}, 20)

const xpTankInteract: BlockCustomComponent = {
    onPlayerInteract({player}, {}) {
        // Initalize
        let currentTankLevel = player.getDynamicProperty("honkit26113:xp_tank_level") as TankLevel;
       // if (typeof currentTankLevel != "number") {
           // throw new Error("wrong type for honkit26113:xp_tank_level");
       // }
        if (typeof currentTankLevel === "undefined") {
            player.setDynamicProperty("honkit26113:xp_tank_level", 0);
            currentTankLevel = 0;
        }
        let deposited = player.getDynamicProperty("honkit26113:xp_tank_deposited") as number;
        if (typeof deposited === "undefined") {
            player.setDynamicProperty("honkit26113:xp_tank_deposited", 0);
            deposited = 0;
        }
        let generated = player.getDynamicProperty("honkit26113:xp_tank_generated") as number;
        if (typeof generated === "undefined") {
            player.setDynamicProperty("honkit26113:xp_tank_generated", 0);
            generated = 0;
        }
        let xpNeeded = levelXPNeeded[(currentTankLevel + 1) as TankLevel] - deposited;

        // XP Tank menu
        const form = new ActionFormData();
        form.title(`XP Tank - §2Grade ${currentTankLevel}§r`);

        // Collect XP
        if (generated > 0) {
            form.button(`Collect\n§2[${Math.round(generated * 10) / 10} Levels]§r`, "textures/ui/download_backup");
        } else {
            form.button("Collect\n§c[None to collect]§r", "textures/ui/download_backup")
        }

        // Deposit XP
        if (currentTankLevel < 10) {
            form.body(`The XP Tank generates XP levels every new Minecraft day!\nAt §aGrade ${currentTankLevel}§r, you'll receive §a${levelXPGenerated[currentTankLevel]}§r Levels.\nAt §aGrade ${currentTankLevel + 1}§r, you'll receive §a${levelXPGenerated[(currentTankLevel + 1) as TankLevel]}§r Levels.\n\nYour current XP level: §a${player.level}§r\nLevels to be collected: §a${Math.round(generated * 10) / 10}§r\nDeposit §a${xpNeeded}§r more levels to reach Grade ${currentTankLevel + 1} [ ${deposited} / ${levelXPNeeded[(currentTankLevel + 1) as TankLevel]} ] (${Math.round((Number(deposited) / Number(levelXPNeeded[(currentTankLevel + 1) as TankLevel]) * 100) * 10) / 10}%%)`);
            if (player.level > 0) {
                form.button("Deposit", "textures/ui/backup_replace");
            } else {
                form.button("Deposit\n§c[None to deposit]§r", "textures/ui/backup_replace");
            }
        } else {
            form.body(`The XP Tank generates XP levels every new Minecraft day!\nAt §aGrade ${currentTankLevel}§r, you'll receive §a${levelXPGenerated[currentTankLevel]}§r Levels.\nThis tank is at Max Grade!\n\nYour current XP level: §a${player.level}§r\nLevels to be collected: §a${Math.round(generated * 10) / 10}§r`);
            form.button("Deposit\n§c[Tank is at Max Grade]§r", "textures/ui/backup_replace");
        }
        
        // Combustion Amulet section
        const amulet = player.getComponent('equippable')?.getEquipment(EquipmentSlot.Mainhand);

        if (isHoldingAmulet(player)) {
            const repairCount = amulet.getDynamicProperty("honkit26113:repair_count") ?? 0;
            if (typeof repairCount !== "number") {
                console.error(`Unexpected type for repairCount: Expected number, got ${typeof repairCount}`);
                return;
            }
            if (repairCount >= REPAIR_LIMIT) {
                form.button("Repair Amulet\n§c[Repair Limit Reached]§r", "textures/items/combustion_amulet");
            } else {
                form.button(
                    `Repair Amulet\n${player.level >= 1 ? "§2" : "§c"}[Cost: 1 Level / 30 Seconds]§r`,
                    "textures/items/combustion_amulet"
                );
            }
        } else {
            form.button("Repair Amulet\n§c[Not holding broken Amulet]§r", "textures/items/combustion_amulet");
        }

        form.show(player).then(
            (response) => {
                switch (response?.selection) {
                    case 0:
                        collectXP(player);
                        break;
                    case 1:
                        depositXP(player);
                        break;
                    case 2:
                        repairAmulet(player);
                    default:
                        break;
                }
            }
        );
    }
}

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("honkit26113:xp_tank_interact", xpTankInteract);
    blockComponentRegistry.registerCustomComponent("honkit26113:xp_tank_placement", xpTankPlacement);
});

type TankLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

const levelXPNeeded: Record<TankLevel, number> = {
    // Tank level: XP Levels required (Cumulative)
    0: 0,
    1: 5,
    2: 10,
    3: 18,
    4: 28,
    5: 40,
    6: 55,
    7: 75,
    8: 100,
    9: 135,
    10: 185
}

const levelXPGenerated: Record<TankLevel, number> = {
    // Tank level: XP Levels generated each day
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 10,
    10: 12
}

const MAX_TANK_LEVEL = 10;

function incrementPlayerTankStorage(player: Player) {
    const tankLevel = (player.getDynamicProperty(`honkit26113:xp_tank_level`) ?? 0) as TankLevel;
    if (typeof tankLevel !== "number" || tankLevel < 0 || tankLevel > MAX_TANK_LEVEL) {
        console.error("Unexpected tankLevel");
        return;
    }
    generateXPLevel(player, levelXPGenerated[tankLevel]);
}

function generateXPLevel(player: Player, level: number) {
    const generated = Number(player.getDynamicProperty(`honkit26113:xp_tank_generated`)) || 0;
    player.setDynamicProperty(`honkit26113:xp_tank_generated`, generated + level);
}

function collectXP(player: Player) {
    const toCollect = Number(player.getDynamicProperty(`honkit26113:xp_tank_generated`)) || 0;
    if (toCollect === 0) {
        const TITLE = "None to Collect";
        const CONTENT = "No XP is available for collection at the moment. Check back tomorrow!"
        showPopup(player, TITLE, CONTENT);
        return;
    }
    player.setDynamicProperty(`honkit26113:xp_tank_generated`, 0);
    if (toCollect % 1 != 0) {
        player.addExperience(player.totalXpNeededForNextLevel * (toCollect % 1));
    }
    player.addLevels(Math.floor(toCollect));
    player.playSound("random.levelup");
}

function depositXP(player: Player) {
    const deposited = Number(player.getDynamicProperty(`honkit26113:xp_tank_deposited`)) || 0;
    let tankLevel = Number(player.getDynamicProperty(`honkit26113:xp_tank_level`)) || 0;

    // Return if tank is already at max level
    if (tankLevel === MAX_TANK_LEVEL) {
        const TITLE = "Max Grade";
        const CONTENT = "This XP Tank is already at Max Grade and cannot be upgraded!"
        showPopup(player, TITLE, CONTENT);
        return;
    }

    const level = player.level;
    const form = new ModalFormData();
    form.title("Deposit XP Levels");
    if (level > levelXPNeeded[MAX_TANK_LEVEL] - deposited) {
        form.slider("Select levels to deposit", Math.floor(level * 0.1), levelXPNeeded[(MAX_TANK_LEVEL - 1) as TankLevel] - deposited, {defaultValue: Math.floor(level * 0.5)});
    } else {
        form.slider("Select levels to deposit", Math.floor(level * 0.1), Math.floor(level), {defaultValue: Math.floor(level * 0.5)});
    }
    form.show(player).then(
        (response: ModalFormResponse) => {
            try {
                const amount = response.formValues[0] as number;
                const newDeposited = deposited + amount;
    
                player.setDynamicProperty(`honkit26113:xp_tank_deposited`, newDeposited);
    
                while (tankLevel < 10 && newDeposited >= (levelXPNeeded[(tankLevel + 1) as TankLevel])) {
                    tankLevel++;
                }
    
                player.setDynamicProperty(`honkit26113:xp_tank_level`, tankLevel);
                player.addLevels(Math.floor(-amount));
                if (tankLevel == 10) {
                    player.addLevels(newDeposited - Number(levelXPNeeded[(tankLevel + 1) as TankLevel]));
                }
            } catch (error) {
                console.log(error);
            }
        }
    );
}

/**
 * Returns `true` if the player is holding `honkit26113:combustion_amulet_broken`, false otherwise.
 * @param player 
 */
function isHoldingAmulet(player: Player) {
	const inventory = player.getComponent("minecraft:inventory").container;
    const selected = player.selectedSlotIndex;

    // I Use try-catch because calling `matches` checks for both an item and
    // a block, which throws an error since I don't have a block with that ID.
    let isHoldingAmulet = false;
    try {
        isHoldingAmulet = inventory.getItem(selected)?.matches("honkit26113:combustion_amulet_broken");
    } catch (error) {}
    return isHoldingAmulet;
}

function repairAmulet(player: Player) {
    // TODO: charged with xp using xp tank, 1 xp level = 30s, max 5 min, charge once every Minecraft day

	const inventory = player.getComponent("minecraft:inventory").container;
    const selected = player.selectedSlotIndex;

    // Check holding broken amulet
    if (!isHoldingAmulet(player)) {
        const TITLE = "Not holding broken amulet";
        const CONTENT = "You are not holding a Broken Combustion Amulet in your hand.";
        showPopup(player, TITLE, CONTENT);
        return;
    }

    // Check player XP level
    if (player.level < 1) {
        const TITLE = "Not enough XP!";
        const CONTENT = "You don't have enough XP levels to complete this operation.";
        showPopup(player, TITLE, CONTENT);
        return;
    }

    const repairCount = inventory.getItem(selected).getDynamicProperty("honkit26113:repair_count") ?? 0;
    if (typeof repairCount !== "number") {
        console.error(`Unexpected type for repairCount: Expected number, got ${typeof repairCount}`);
        return;
    }
    if (repairCount >= REPAIR_LIMIT) {
        const TITLE = "Repair Limit Reached!";
        const CONTENT = "You've repaired this Amulet too many times. It's time to craft a new one!";
        showPopup(player, TITLE, CONTENT);
        return;
    }
    
    // Repair
    const form = new ModalFormData();
    const INTERVAL = 30;
    form.title("Charge Amulet with XP");
    form.slider("1 Level per 30 seconds", 1 * INTERVAL, Math.min(6, player.level) * INTERVAL, {valueStep: INTERVAL, defaultValue: 1 * INTERVAL});
    form.show(player).then(response => {
        if (response.canceled) return;
        const duration = response.formValues[0] as number;

        // Show confirmation popup
        const confirmation = new MessageFormData()
            .title("Are you sure?")
            .body(`You are about to charge your amulet using ${duration / INTERVAL} level${duration / INTERVAL === 1 ? "" : "s"} for ${Math.floor(duration / 60)}m ${duration % 60}s of use.`)
            .button1("Confirm")
            .button2("Cancel")
            .show(player)
            .then(response => {
                // Cancel
                if (response.canceled || response.selection === undefined || response.selection === 1) {
                    return;
                }
                // Confirm
                const amulet = new ItemStack("honkit26113:combustion_amulet");
                amulet.setDynamicProperty("honkit26113:use_duration", duration);
                amulet.setDynamicProperty("honkit26113:repair_count", repairCount + 1);
                amulet.setLore([`Use duration: ${Math.floor(duration / 60)}m ${duration % 60}s`, `Can charge ${REPAIR_LIMIT - (repairCount + 1)} more times`]);
                inventory.setItem(player.selectedSlotIndex, amulet);
                player.playSound("random.anvil_use");
                player.addLevels(duration / -INTERVAL);
            });
    })
}

function showPopup(player: Player, title: string, content: string) {
    new ModalFormData()
        .title(title)
        .label(content)
        .submitButton("Ok")
        .show(player);
}