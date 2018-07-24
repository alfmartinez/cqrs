"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@cqrs-alf/common");
const Bonus_1 = require("./Bonus");
const ItemMap_1 = require("./ItemMap");
class Item extends common_1.ValueType {
    constructor(name, bonus) {
        super();
        this.name = name;
        this.bonus = bonus;
    }
    toString() {
        return "Item: " + this.name;
    }
}
exports.Item = Item;
function createItem(slot, className, level) {
    if (!ItemMap_1.itemMap[className]) {
        throw new Error("No item map for " + className);
    }
    if (!ItemMap_1.itemMap[className][level]) {
        throw new Error("No item map for " + className + " at level " + level);
    }
    if (!ItemMap_1.itemMap[className][level]) {
        throw new Error("No item map for " + className + " at level " + level + " for slot " + slot);
    }
    const [name, category, attribute, value] = ItemMap_1.itemMap[className][level][slot];
    return new Item(name, new Bonus_1.Bonus(category, attribute, value));
}
exports.createItem = createItem;
