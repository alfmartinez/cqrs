"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventDontContainAggregateId = /** @class */ (function () {
    function EventDontContainAggregateId(eventName) {
        this.name = "EventDontContainAggregateId";
        this.eventName = eventName;
        this.message = eventName + " dont contain an aggregate Id";
    }
    return EventDontContainAggregateId;
}());
exports.EventDontContainAggregateId = EventDontContainAggregateId;
