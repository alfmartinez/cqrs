"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DecisionProjection = /** @class */ (function () {
    function DecisionProjection() {
        this.state = {};
        this.handlers = {};
    }
    DecisionProjection.prototype.register = function (eventType, action) {
        this.handlers[eventType.name] = action;
        return this;
    };
    DecisionProjection.prototype.apply = function (events) {
        var _this = this;
        if (events instanceof Array) {
            events.forEach(function (singleEvent) { return _this.apply.call(_this, singleEvent); });
            return this;
        }
        var event = events;
        var typeName = event.constructor.name;
        var handler = this.handlers[typeName];
        if (handler) {
            handler.call(this.state, event);
        }
        return this;
    };
    return DecisionProjection;
}());
exports.DecisionProjection = DecisionProjection;
