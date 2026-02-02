import { system } from '@minecraft/server';

/** @type {import("@minecraft/server").ItemCustomComponent} */
const MysteriousStewComponent: import("@minecraft/server").ItemCustomComponent = {
    onConsume({ source }, {}) {
        let rand = Math.floor(Math.random() * 50) + 1;
            
        random_effect(rand);
        if (rand <= 25) return;
        random_effect(rand - 25);

        function random_effect(rand: number) {
            switch (rand) {
                case 1: 
                    source.addEffect('absorption', 300, {amplifier: 1});
                    break;
                case 2: 
                    source.addEffect('bad_omen', 300, {amplifier: 1});
                    break;
                case 3: 
                    source.addEffect('blindness', 300, {amplifier: 1});
                    break;
                case 4: 
                    source.addEffect('conduit_power', 300, {amplifier: 1});
                    break;
                case 5: 
                    source.addEffect('darkness', 300, {amplifier: 1});
                    break;
                case 6: 
                    source.addEffect('fire_resistance', 300, {amplifier: 1});
                    break;
                case 7: 
                    source.addEffect('haste', 300, {amplifier: 1});
                    break;
                case 8: 
                    source.addEffect('health_boost', 300, {amplifier: 1});
                    break;
                case 9: 
                    source.addEffect('hunger', 300, {amplifier: 1});
                    break;
                case 10: 
                    source.addEffect('instant_damage', 300, {amplifier: 1});
                    break;
                case 11: 
                    source.addEffect('instant_health', 300, {amplifier: 1});
                    break;
                case 12: 
                    source.addEffect('invisibility', 300, {amplifier: 1});
                    break;
                case 13: 
                    source.addEffect('jump_boost', 300, {amplifier: 1});
                    break;
                case 14: 
                    source.addEffect('levitation', 300, {amplifier: 1});
                    break;
                case 15: 
                    source.addEffect('mining_fatigue', 300, {amplifier: 1});
                    break;
                case 16: 
                    source.addEffect('nausea', 300, {amplifier: 1});
                    break;
                case 17: 
                    source.addEffect('night_vision', 300, {amplifier: 1});
                    break;
                case 18: 
                    source.addEffect('poison', 300, {amplifier: 1});
                    break;
                case 19: 
                    source.addEffect('regeneration', 300, {amplifier: 1});
                    break;
                case 20: 
                    source.addEffect('resistance', 300, {amplifier: 1});
                    break;
                case 21: 
                    source.addEffect('saturation', 300, {amplifier: 1});
                    break;
                case 22: 
                    source.addEffect('village_hero', 300, {amplifier: 1});
                    break;
                case 23: 
                    source.addEffect('water_breathing', 300, {amplifier: 1});
                    break;
                case 24: 
                    source.addEffect('weakness', 300, {amplifier: 1});
                    break;
                case 25: 
                    source.addEffect('wither', 300, {amplifier: 1});
                    break;
            }
        }
    }
};


system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("honkit26113:use_mysterious_stew", MysteriousStewComponent);
});