"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventDontContainAggregateId {
    constructor(eventName) {
        this.name = "EventDontContainAggregateId";
        this.eventName = eventName;
        this.message = eventName + " dont contain an aggregate Id";
    }
}
exports.EventDontContainAggregateId = EventDontContainAggregateId;
