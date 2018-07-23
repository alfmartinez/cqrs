"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@cqrs-alf/common");
var UserEmailCannotBeEmpty = /** @class */ (function () {
    function UserEmailCannotBeEmpty(message) {
        if (message === void 0) { message = 'User email cannot be empty'; }
        this.name = "UserEmailCannotBeEmpty";
        this.message = message;
    }
    return UserEmailCannotBeEmpty;
}());
exports.UserEmailCannotBeEmpty = UserEmailCannotBeEmpty;
var UserId = /** @class */ (function (_super) {
    __extends(UserId, _super);
    function UserId(email) {
        var _this = _super.call(this) || this;
        if (!email) {
            throw new UserEmailCannotBeEmpty();
        }
        _this.email = email;
        return _this;
    }
    UserId.prototype.toString = function () {
        return "UserId:" + this.email;
    };
    return UserId;
}(common_1.ValueType));
exports.UserId = UserId;
