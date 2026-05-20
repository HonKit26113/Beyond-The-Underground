export const arenaBiomes = { // This is the argument used in the arena trigger's custom component
    LimestoneCaves: "limestone_caves",
    IceCaves: "ice_caves"
} as const;

export const arenaConfig = [
    {
        "biome": arenaBiomes.LimestoneCaves,
        "phases": [
            {
                "id": 0,
                "mobs": [
                    {"entity": "honkit26113:sandy_skelly", "count": 4},
                    {"entity": "honkit26113:scorpion", "count": 3}
                ],
                "rewards": [
                    {"item": "minecraft:diamond", "count": 10},
                    {"item": "honkit26113:sandstone_stick", "count": 1},
                    {"item": "honkit26113:sandy_skelly_skull", "count": 1}
                ]
            }
        ]
    },
    {
        "biome": arenaBiomes.IceCaves,
        "phases": [
            {
                "id": 0,
                "mobs": [
                    {"entity": "honkit26113:frost_spirit", "count": 4},
                    {"entity": "honkit26113:ice_bomber", "count": 2},
                    {"entity": "minecraft:stray", "count": 3}
                ],
                "rewards": [
                    {"item": "minecraft:diamond", "count": 10},
                    {"item": "honkit26113:frost_essence", "count": 1},
                    {"item": "honkit26113:frozen_core", "count": 1}
                ]
            }
        ]
    }
];