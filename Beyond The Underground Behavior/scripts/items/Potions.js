import { system } from '@minecraft/server';
/** @type {import("@minecraft/server").ItemCustomComponent} */
const PotionUseComponent = {
    onConsume({ source }, { params }) {
        const p = params;
        p.forEach(effect => {
            source.addEffect(effect.name, effect.duration * 20, { amplifier: effect.amplifier });
        });
    }
};
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("honkit26113:potion", PotionUseComponent);
});
//# sourceMappingURL=Potions.js.map