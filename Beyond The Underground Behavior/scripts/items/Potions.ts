import { system } from '@minecraft/server';

type EffectList = EffectParams[];

interface EffectParams {
    name: string;
    duration: number;
    amplifier: number;
}

/** @type {import("@minecraft/server").ItemCustomComponent} */
const PotionUseComponent: import("@minecraft/server").ItemCustomComponent = {
    onConsume({ source }, {params}) {
        const p = params as EffectList;
        p.forEach(effect => {
            source.addEffect(effect.name, effect.duration * 20, {amplifier: effect.amplifier});
        })
    }
};

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("honkit26113:potion", PotionUseComponent);
});