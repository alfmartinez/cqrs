"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var IdGenerator = /** @class */ (function () {
    function IdGenerator() {
    }
    IdGenerator.generate = function () {
        return uuid_1.v4();
    };
    return IdGenerator;
}());
exports.default = IdGenerator;
//# sourceMappingURL=IdGenerator.js.map