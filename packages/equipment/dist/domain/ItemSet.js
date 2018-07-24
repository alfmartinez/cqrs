"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = require("./Item");
const Slot_1 = require("./Slot");
function createItemSet(level, className) {
    return [...Array(6).keys()].map((slot) => new Slot_1.Slot(Item_1.createItem(slot, className, level), slot));
}
exports.createItemSet = createItemSet;
