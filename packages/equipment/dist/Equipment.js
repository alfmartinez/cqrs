"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@cqrs-alf/common");
const character_1 = require("@fubattle/character");
const ItemSet_1 = require("./ItemSet");
var EquipmentLevel;
(function (EquipmentLevel) {
    EquipmentLevel[EquipmentLevel["WHITE"] = 0] = "WHITE";
    EquipmentLevel[EquipmentLevel["GREEN0"] = 1] = "GREEN0";
    EquipmentLevel[EquipmentLevel["GREEN1"] = 2] = "GREEN1";
    EquipmentLevel[EquipmentLevel["BLUE0"] = 3] = "BLUE0";
    EquipmentLevel[EquipmentLevel["BLUE1"] = 4] = "BLUE1";
    EquipmentLevel[EquipmentLevel["BLUE2"] = 5] = "BLUE2";
    EquipmentLevel[EquipmentLevel["PURPLE0"] = 6] = "PURPLE0";
    EquipmentLevel[EquipmentLevel["PURPLE1"] = 7] = "PURPLE1";
    EquipmentLevel[EquipmentLevel["PURPLE2"] = 8] = "PURPLE2";
    EquipmentLevel[EquipmentLevel["PURPLE3"] = 9] = "PURPLE3";
})(EquipmentLevel = exports.EquipmentLevel || (exports.EquipmentLevel = {}));
class SlotNotEquipped {
    constructor(slot) {
        this.name = "SlotNotEquipped";
        this.slot = slot;
        this.message = `Slots ${slot} not equipped`;
    }
}
exports.SlotNotEquipped = SlotNotEquipped;
class ItemEquipped {
    constructor(characterId, slot) {
        this.characterId = characterId;
        this.slot = slot;
    }
}
exports.ItemEquipped = ItemEquipped;
class EquipmentUpgraded {
    constructor(characterId, level) {
        this.characterId = characterId;
        this.level = level;
    }
}
exports.EquipmentUpgraded = EquipmentUpgraded;
class Equipment {
    constructor(events) {
        this.projection = new common_1.DecisionProjection();
        this.projection
            .register(character_1.CharacterCreated, function (evt) {
            this.characterId = evt.characterId;
            this.className = evt.className;
            this.level = EquipmentLevel.WHITE;
            this.slots = ItemSet_1.createItemSet(EquipmentLevel.WHITE);
        })
            .register(ItemEquipped, function (evt) {
            this.slots[evt.slot].equipped = true;
        })
            .apply(events);
    }
    equipItem(publishEvent, slotNumber) {
        if (this.projection.state.slots[slotNumber].equipped) {
            return;
        }
        const equipEvent = new ItemEquipped(this.projection.state.characterId, slotNumber);
        this.projection.apply(equipEvent);
        publishEvent(equipEvent);
    }
    upgrade(publishEvent) {
        const unequippedSlot = this.projection.state.slots.find((slot) => !slot.equipped);
        if (unequippedSlot) {
            const { index } = unequippedSlot;
            throw new SlotNotEquipped(index);
        }
        const upgradeEvent = new EquipmentUpgraded(this.projection.state.characterId, this.projection.state.level + 1);
        this.projection.apply(upgradeEvent);
        publishEvent(upgradeEvent);
    }
}
exports.Equipment = Equipment;
