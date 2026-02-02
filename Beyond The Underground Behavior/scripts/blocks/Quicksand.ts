import { system, BlockPermutation, BlockCustomComponent } from '@minecraft/server';

const QuicksandComponent: BlockCustomComponent = {
    onStepOn({block}, {}) {
        let step = 0;
        
        const countdown = system.runInterval(() => {
            step++;
            try {
                block.setPermutation(BlockPermutation.resolve("honkit26113:quicksand", {"honkit26113:layer": step}));
            } catch (error) {
            }
        }, 10);
        system.runTimeout(() => {
            system.clearRun(countdown);
            try {
                block.setPermutation(BlockPermutation.resolve("honkit26113:quicksand", {"honkit26113:layer": 0}));
            } catch (error) {
            }
        }, 80);
    }
};

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("honkit26113:step_on_quicksand", QuicksandComponent);
});

