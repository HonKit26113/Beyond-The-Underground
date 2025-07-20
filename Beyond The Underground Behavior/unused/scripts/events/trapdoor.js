import { world } from '@minecraft/server';
import { trapdoorManager } from '../classes/trapdoorClass';
const blockComponents = [
    {
        //the custom component id
        id: "honkit26113:open_trapdoor",
        //the custom component code
        code: {
            onPlayerInteract: (data)=>{
                //activate interact
                trapdoorManager.interact(data.block);
            },
            onTick: (data)=>{
                //detect if the block is powered
                trapdoorManager.detectPowered(data.block);
            }
        }
    }
];
let reload = 0;
world.beforeEvents.worldInitialize.subscribe((data)=>{
    //reload needed to stop crashes
    reload = reload + 1;
    if (reload > 1) return;
    for (const comp of blockComponents){
        //load the custom block components
        data.blockComponentRegistry.registerCustomComponent(comp.id, comp.code);
    }
});
