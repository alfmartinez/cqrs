"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = require("./Item");
const Slot_1 = require("./Slot");
function createItemSet(level) {
    return [
        new Slot_1.Slot(new Item_1.Item("helmet"), 0),
        new Slot_1.Slot(new Item_1.Item("knife"), 1),
        new Slot_1.Slot(new Item_1.Item("buckler"), 2),
        new Slot_1.Slot(new Item_1.Item("cloak"), 3),
        new Slot_1.Slot(new Item_1.Item("cloth"), 4),
        new Slot_1.Slot(new Item_1.Item("boots"), 5),
    ];
}
exports.createItemSet = createItemSet;
