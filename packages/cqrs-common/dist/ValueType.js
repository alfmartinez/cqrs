"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValueType = /** @class */ (function () {
    function ValueType() {
    }
    ValueType.prototype.equals = function (other) {
        if (!other) {
            return false;
        }
        return this.toString() === other.toString();
    };
    return ValueType;
}());
exports.ValueType = ValueType;
