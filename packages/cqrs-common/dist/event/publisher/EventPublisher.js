"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var EventPublisher = /** @class */ (function () {
    function EventPublisher() {
        var _this = this;
        this.eventEmitter = new events_1.EventEmitter();
        this.publish = function (event) {
            _this.eventEmitter.emit("*", event);
            var eventName = event.constructor.name;
            _this.eventEmitter.emit(eventName, event);
        };
    }
    EventPublisher.prototype.onAny = function (action) {
        this.eventEmitter.on("*", action);
        return this;
    };
    EventPublisher.prototype.on = function (eventType, action) {
        this.eventEmitter.on(eventType.name, action);
        return this;
    };
    return EventPublisher;
}());
exports.EventPublisher = EventPublisher;
