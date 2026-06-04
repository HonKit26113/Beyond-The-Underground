Beyond The Underground
Version 1.7 (released May 23, 2026)
Made by HonKit26113. All rights reserved. Do not distribute without permission.

This add-on is only available on honkit26113.com and MCPEDL / CurseForge.

====================
Terms of Use
You are allowed to:
 - Edit the pack for personal use.
 - Use the pack in your private modpack that you aren’t releasing publicly. You cannot use the pack in a public modpack.
 - Make videos & media content with the pack if you leave the link to this page.

You are NOT allowed to:
 - Distribute the pack using a new download link. Always share the link to this page.
 - Monetize the pack download. Doing so could result in a copyright takedown.

====================
Changelog
Version 1.7
Released May 23, 2026

Foreword from the creator:
 - A lot of time has passed since the last update. I apologize for this, but as you can see from the changelog there has been many changes. I wanted to make sure this update brought exciting new content, as well as fix issues that severely affected gameplay. I have also taken time to refactor existing code, both for optimization and to update the add-on to Scripting API v2.0. I hope you enjoy this update!

New Cave Type: Arid Caves!
 - Found under Savannas and Badlands.
 - Lifeless terrain scattered with Petrified snags, bushes and dry grass.

New Cave Type: Crystal Caves!
 - Found under Plains, Forests, Birch Forests and Taigas.
 - Giant Gypsum formations and Topaz Crystals can be found here, alongside Gypsum Needles that grow from the cave ceiling.
 - Home to the Crystal Firefly.

Made cave type generation more common:
 - The Slimy Sewers (Slime Caves) now generate under Mangrove Swamps.
 - Ice Caves now generate under all cold biomes, such as Snowy Taigas.
 - The Undergrowth (Forest Caves) now generates under Flower Forests and Meadows.
 - Pebbles now generate more frequently in all Overworld biomes.
 - Limestone now generates in all Overworld biomes, except for Roofed Forests, Jungles, and cold & frozen biomes.
 - These changes mean it's now easier than ever to find the new caves and blocks in your world!

New Structure: Ice Fort!
 - Found deep in the Ice Caves at Deepslate level. Look out for Frostslate Bricks while mining!
 - Uses the Jigsaw system to procedurally generate rooms and corridors. This means every Fort you find will be unique and different from any other you've explored!
 - Obtain special loot and crafting ingredients for the Bane of Frost.
 - The legacy Ice Dungeon structure has been turned into a room in the Fort. It has a lower chance of generating than other rooms, and on average 1 will generate for each Fort. 2 mob spawners were removed for difficulty balancing, but chest contents remain the same.

Arena System Rework:
 - You might not notice many changes, but most of the arena code has been refactored / rewritten to improve maintainability and scalability.
 - Arenas now generate in a special room in Ice Forts, with ice-themed rewards and mob spawning.
 - When interacting with an Arena Trigger in Peaceful difficulty, an error message now shows and no battle is triggered.
 - The battle countdown is now visible to all players within a 32 block radius of the Arena Pillar.
 - You can now start another Arena Battle immediately after one ends.
 - A sound effect plays on losing.

Lost Explorer Rework:
 - Their camps are now found in all parts of the Overworld between y=-50 and 20, except in Crystal Caves and the Deep Dark. (It doesn't make sense for them to only get lost in Ice Caves!) 
 - They now take Topaz as currency and trade unique items from various cave types.
 - They won't sell specialties from the Crooked Caverns. The Nether is too dangerous of a travel destination!
 - You no longer need an Emerald to summon the Lost Explorer.
 - Unused suitcases now flash to indicate they can be interacted with.
 - Removed the Ice Crystal from the Lost Explorer's camp.

New Blocks:
 - Experience Tank. Deposit XP and get XP back every Minecraft day. The more you deposit, the more you get!
 - Petrified Wood (Log, Wood, Planks, Slab, Stairs, Fence, Fence Gate, Door, Trapdoor). Best tool to break is a Pickaxe instead of an Axe.
 - Petrified Bush
 - Block of Gypsum
 - Gypsum Cluster
 - Gypsum Needles
 - Block of Topaz
 - Topaz Cluster
 - Frostslate Bricks (Normal, Slab, Stairs)
 - Ice Fort Lamp
 - Limestone Ores (Coal, Copper, Diamond, Emerald, Gold, Iron, Lapis Lazuli, Redstone)
 - Stairs (Crooked, Frosted Stone, Rainbow Gum, Slimy Deepslate Tiles, Slimy Deepslate Bricks, Slimy Stone Bricks, Limestone, Limestone Bricks, Soul Bricks, Packed Ice Bricks)

New Items:
 - Gypsum Fertilizer. Grows a crop or tree instantly. Put 4 Azure Bluets, Cornflowers, Dandelions, or Oxeye Daisies in a 2x2 grid to spawn a Giant Flower.
 - Gypsum Shard. Use to craft Gypsum Fertilizer & Combustion Amulet. Smelt to get Calcined Gypsum.
 - Calcined Gypsum. Put this and 8 Concrete Powder in a crafting table to get Concrete.
 - Topaz. Currency for trading with Lost Explorers. Use to craft Combustion Amulet and Experience Tank.
 - Ice Bomb. Throw at enemies to freeze them in place for 1.5 seconds.

New Special Item:
 - Combustion Amulet. Use to gain the Touch of Fire ability: For a specified duration, instantly smelt blocks you break and set entities you hit on fire. Recharge the amulet with 1 XP level for 30 seconds in an XP Tank, for a maximum of 5 minutes.

New Mobs:
 - Ice Bomber. Found in the Ice Caves and Ice Forts. Throws Ice Bombs.
 - Crystal Firefly. Flies around leaving behind trails of topaz dust particles.

Other Changes:
 - Blocks that react to redstone, such as Fence Gates and Doors, no longer rely on Minecraft:tick to detect power. This should significantly reduce tick lag, especially if you've placed many of these blocks.
 - All blocks in this add-on now break faster when using the correct tools and tier.
 - Adjusted the breaking speed by fist of some blocks to match similar blocks in vanilla.
 - Some blocks now require breaking with the correct tool and tier to drop.
 - Limestone variants of ores now replace the stone variants whenever ores generate in Limestone.
 - Rooted Dirt patches and Hanging Roots now generate in most Overworld biomes.
 - The song Excuse by C418 now plays in the Undergrowth.
 - Slimy Zombies now spawn in smaller hordes.
 - Thornspitters now naturally spawn in the Undergrowth.
 - Luminite Ore and Deepslate Luminite Ore are now affected by Fortune.
 - Sand Layers and Slime Layers are now replaceable. This means a new block (e.g. a torch) can replace them at their current position.
 - Sticky Spikes and Dripping Icicles now require Silk Touch to obtain.
 - You can now craft Limestone into Cobbled Limestone using a Stonecutter.
 - Crooked Fungi can now be placed on Cave Turf and Deepslate Cave Turf.
 - Pebbles now break when coming in contact with flowing water.
 - Added explanations for some items in their item names.
 - Crooked and Rainbow Gum Planks (and their products) are now in their own item groups in the creative menu.
 - Used Suitcases are now available in the creative menu.
 - The Slime Dagger's special ability has been renamed as "Slimy Curse".
 - Frosted Deepslate has been renamed as Frostslate.
 - Ice Dungeons no longer generate on their own.
 - Instead of anvil sounds, interacting with Lava Tanks that are locked or on cooldown now plays the "block.false_permissions" sound.
 - Entities can no longer jump over Beyond The Underground fences.
 - Crooked Planks and Rainbow Gum Planks can now be used to craft Wooden Spears.
 - Twilight Spores now generate particles less frequently to reduce lag.
 - New background panorama featuring the Crystal Caves.
 - Added some debug commands. These aren't meant for general use. Use them at your own risk.
 - This add-on now requires Minecraft 26.20 or above to function.

Fixed Bugs:
 - All Beyond The Underground hostile mobs now only spawn at a light level of 0.
 - Lava Tanks now work again.
 - Water no longer flows through non-full blocks.
 - Texture flickering no longer occurs on blocks with cross-shape geometries.
 - Fixed "Invalid asset path" errors that appeared in the content log.
 - Fixed the high spawn weights of mobs that prevented other mobs from spawning.
 - Crooked Stems can now be stripped.
 - Crooked wood now play nether wood sounds.
 - Limestone Slabs, Rainbow Gum Slabs and Slimy Deepslate Brick Slabs now play the correct sounds.
 - Luminous Mushroom Stew, Mysterious Stew, Slime Soup and Crooked Fungus Stew are now available in the creative menu.
 - You can now craft campfires using Crooked and Rainbow Gum Logs / Wood.
 - Fixed incorrect map color for Rainbow Gum Planks.
 - The Bane of Frost now breaks Chiseled Packed Ice faster.
 - Fixed incorrect information in some loading screen tips.
 - "Can't find animation..." errors no longer appear when encountering a Slimy Zombie.
 - Content log errors no longer appear when breaking blocks at y=1 or y=319.
 - Content log errors no longer appear saying Beyond The Underground spawn eggs were put into the wrong category.
 - Fixed "minecraft:render_offsets has been deprecated..." content error upon world load.
 - Undead mobs are now immune to Soul Magma Blocks.

====================
Credits
Creator: HonKit26113 

Special thanks to:
 - BrineCraft for making many textures for many blocks across different cave types and for the Slimy Blossom model!
 - Leonardo for the 5 in-game songs!

Other contributors:
 - Alylica - Arena Battle custom bars for countdown and mobs left
 - Beez - Ice Crystal, Crystallized Ice, Topaz & Topaz Cluster textures
 - Freaky - Slime Dagger texture
 - Ftere - Luminous Mooshroom model
 - Ignitemare - Block of Gypsum texture
 - MCSASA - Minecraft-style Beyond The Underground title render
 - SorYPMod - Code for attachables
 - Star Origins - Beyond The Underground name suggestion
 - StickmanDrip69 - Scorpion texture
 - TaxingHawk - Radiant Vines texture
 - TheRealSpidey - Lost Explorer texture
 - VactricaKing - Slingshot code, models & animations

