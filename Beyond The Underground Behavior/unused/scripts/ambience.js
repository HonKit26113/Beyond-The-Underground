import { world, system, BlockPermutation } from '@minecraft/server';



  world.afterEvents.itemUse.subscribe(data => {
	  system.run(() => {
		const player = data.source;
		const {x, y, z} = player.location;
	  });

	return;
  });