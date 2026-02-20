export const arenaConfig = [
    {
        "biome": "limestone_caves",
        "phases": [
            {
                "id": 0,
                "mobs": [
                    // These mobs MUST be arena placeholders
                    {"entity": "honkit26113:arena_sandy_skelly_placeholder", "count": 4},
                    {"entity": "honkit26113:arena_scorpion_placeholder", "count": 3}
                ]
            }
        ],
        "rewards": [
            {"item": "minecraft:diamond", "count": 10},
            {"item": "honkit26113:sandstone_stick", "count": 1},
            {"item": "honkit26113:sandy_skelly_skull", "count": 1}
        ]
    }
];