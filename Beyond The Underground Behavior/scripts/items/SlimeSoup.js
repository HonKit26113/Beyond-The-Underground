import { system } from '@minecraft/server';
/** @type {import("@minecraft/server").ItemCustomComponent} */
const SlimeSoupComponent = {
    onConsume({ source }, {}) {
        source.addEffect("jump_boost", 8 * 20, { amplifier: 1 });
        source.addEffect("resistance", 5 * 20, { amplifier: 1 });
        let rand = Math.floor(Math.random() * 100);
        if (rand >= 45) {
            source.addEffect("hunger", 30 * 20, { amplifier: 0 });
            source.addEffect("nausea", 20 * 20, { amplifier: 1 });
        }
    }
};
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("honkit26113:use_slime_soup", SlimeSoupComponent);
});
//# sourceMappingURL=SlimeSoup.js.map