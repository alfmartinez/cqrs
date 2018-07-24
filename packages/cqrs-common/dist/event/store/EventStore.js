"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventDontContainAggregateId_1 = require("./EventDontContainAggregateId");
class EventStore {
    constructor() {
        this.events = [];
        this.store = (event) => {
            if (!event.getAggregateId) {
                throw new EventDontContainAggregateId_1.EventDontContainAggregateId(event.constructor.name);
            }
            this.events.push(event);
        };
    }
    getEventsOfAggregate(aggregateId) {
        return this.events.filter((event) => {
            return event.getAggregateId().equals(aggregateId);
        });
    }
}
exports.EventStore = EventStore;
