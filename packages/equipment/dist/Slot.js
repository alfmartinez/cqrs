"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Slot {
    constructor(item, index, equipped = false) {
        this.item = item;
        this.index = index;
        this.equipped = equipped;
    }
}
exports.Slot = Slot;
