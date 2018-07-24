"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class IdGenerator {
    static generate() {
        return uuid_1.v4();
    }
}
exports.IdGenerator = IdGenerator;
