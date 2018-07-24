"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValueType {
    constructor() { }
    equals(other) {
        if (!other) {
            return false;
        }
        return this.toString() === other.toString();
    }
}
exports.ValueType = ValueType;
