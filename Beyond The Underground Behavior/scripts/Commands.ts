import { world, system, CommandPermissionLevel, CustomCommandStatus, CustomCommand, CustomCommandResult } from '@minecraft/server';

system.beforeEvents.startup.subscribe((init) => {
  const resetArenaCommand: CustomCommand = {
    name: "honkit26113:reset_arena",
    description: "DEBUG: Stop and reset ongoing arena battle.",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    optionalParameters: []
  };

  init.customCommandRegistry.registerCommand(resetArenaCommand, resetArena);
})


function resetArena(): CustomCommandResult {
  system.run(() => {
      world.setDynamicProperty("honkit26113:arena_over", 3);
  });
  return {
    status: CustomCommandStatus.Success
  };
}

