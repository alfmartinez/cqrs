"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@cqrs-alf/common");
class UserEmailCannotBeEmpty {
    constructor() {
        this.name = "UserEmailCannotBeEmpty";
        this.message = 'User email cannot be empty';
    }
}
exports.UserEmailCannotBeEmpty = UserEmailCannotBeEmpty;
class UserId extends common_1.ValueType {
    constructor(email) {
        super();
        if (!email) {
            throw new UserEmailCannotBeEmpty();
        }
        this.email = email;
    }
    toString() {
        return "UserId:" + this.email;
    }
}
exports.UserId = UserId;
