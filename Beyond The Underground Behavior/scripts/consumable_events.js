// This file was modified by HonKit26113 (@HonKit1103). Do not distribute without permission.
import { world, system, EffectType } from '@minecraft/server';

world.afterEvents.itemCompleteUse.subscribe(data => {
    const player = data.source;
    const item = data.itemStack;
	
    
    if (item.typeId == "honkit26113:fatal_poison_potion") {
	    system.run(() => {
            player.addEffect('fatal_poison', 800, {amplifier: 0})
	    });
	}
    
    if (item.typeId == "honkit26113:fatal_poison_potion_plus") {
	    system.run(() => {
            player.addEffect('fatal_poison', 1800, {amplifier: 0})
	    });
	}

    if (item.typeId == "honkit26113:fatal_poison_potion_potency_2") {
	    system.run(() => {
            player.addEffect('fatal_poison', 400, {amplifier: 1})
	    });
	}

    if (item.typeId == "honkit26113:frozen_potion") {
	    system.run(() => {
            player.addEffect('slowness', 400, {amplifier: 6})
            player.addEffect('mining_fatigue', 400, {amplifier: 2})
	    });
	}

    if (item.typeId == "honkit26113:frozen_potion_plus") {
	    system.run(() => {
            player.addEffect('slowness', 800, {amplifier: 6})
            player.addEffect('mining_fatigue', 800, {amplifier: 2})
	    });
	}

    if (item.typeId == "honkit26113:luminous_mushroom_stew") {
	    system.run(() => {
            player.addEffect('night_vision', 300, {amplifier: 0})
	    });
	}
    
    if (item.typeId == "honkit26113:mysterious_stew") {
	    system.run(() => {
            let rand = Math.floor(Math.random() * 50) + 1;
            
            random_effect(rand);
            if (rand <= 25) return;
            random_effect(rand - 25);

            function random_effect(rand) {
                switch (rand) {
                    case 1: 
                        player.addEffect('absorption', 300, {amplifier: 1});
                        break;
                    case 2: 
                        player.addEffect('bad_omen', 300, {amplifier: 1});
                        break;
                    case 3: 
                        player.addEffect('blindness', 300, {amplifier: 1});
                        break;
                    case 4: 
                        player.addEffect('conduit_power', 300, {amplifier: 1});
                        break;
                    case 5: 
                        player.addEffect('darkness', 300, {amplifier: 1});
                        break;
                    case 6: 
                        player.addEffect('fire_resistance', 300, {amplifier: 1});
                        break;
                    case 7: 
                        player.addEffect('haste', 300, {amplifier: 1});
                        break;
                    case 8: 
                        player.addEffect('health_boost', 300, {amplifier: 1});
                        break;
                    case 9: 
                        player.addEffect('hunger', 300, {amplifier: 1});
                        break;
                    case 10: 
                        player.addEffect('instant_damage', 300, {amplifier: 1});
                        break;
                    case 11: 
                        player.addEffect('instant_health', 300, {amplifier: 1});
                        break;
                    case 12: 
                        player.addEffect('invisibility', 300, {amplifier: 1});
                        break;
                    case 13: 
                        player.addEffect('jump_boost', 300, {amplifier: 1});
                        break;
                    case 14: 
                        player.addEffect('levitation', 300, {amplifier: 1});
                        break;
                    case 15: 
                        player.addEffect('mining_fatigue', 300, {amplifier: 1});
                        break;
                    case 16: 
                        player.addEffect('nausea', 300, {amplifier: 1});
                        break;
                    case 17: 
                        player.addEffect('night_vision', 300, {amplifier: 1});
                        break;
                    case 18: 
                        player.addEffect('poison', 300, {amplifier: 1});
                        break;
                    case 19: 
                        player.addEffect('regeneration', 300, {amplifier: 1});
                        break;
                    case 20: 
                        player.addEffect('resistance', 300, {amplifier: 1});
                        break;
                    case 21: 
                        player.addEffect('saturation', 300, {amplifier: 1});
                        break;
                    case 22: 
                        player.addEffect('village_hero', 300, {amplifier: 1});
                        break;
                    case 23: 
                        player.addEffect('water_breathing', 300, {amplifier: 1});
                        break;
                    case 24: 
                        player.addEffect('weakness', 300, {amplifier: 1});
                        break;
                    case 25: 
                        player.addEffect('wither', 300, {amplifier: 1});
                        break;
                }
            }
	    });
	}

    if (item.typeId == "honkit26113:luminous_mushroom_stew") {
	    system.run(() => {
            player.addEffect('night_vision', 300, {amplifier: 0})
	    });
	}

    if (item.typeId == "honkit26113:crooked_fungus_stew") {
	    system.run(() => {
            player.addEffect('fire_resistance', 400, {amplifier: 0})
	    });
	}
    
    if (item.typeId == "honkit26113:raw_scorpion") {
	    system.run(() => {
            player.addEffect('fatal_poison', 200, {amplifier: 1})
            player.addEffect('nausea', 160, {amplifier: 2})
            player.addEffect('hunger', 200, {amplifier: 2})
	    });
	}


	return;
});