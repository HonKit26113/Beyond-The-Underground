import { system } from '@minecraft/server';
import { use_durability } from "../Functions";
const BouquetComponent = {
    onUse({ source, itemStack }, {}) {
        source.dimension.spawnEntity("honkit26113:tracking_thorn_placeholder", source.location);
        use_durability(source, itemStack, 1);
        itemStack?.getComponent('cooldown')?.startCooldown(source);
    }
};
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("honkit26113:use_bouquet", BouquetComponent);
});
//# sourceMappingURL=CorruptedBouquet.js.map