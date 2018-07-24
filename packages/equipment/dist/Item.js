"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@cqrs-alf/common");
class Item extends common_1.ValueType {
    constructor(name) {
        super();
        this.name = name;
    }
    toString() {
        return "Item: " + this.name;
    }
}
exports.Item = Item;
