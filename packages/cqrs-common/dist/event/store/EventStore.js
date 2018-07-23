"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventDontContainAggregateId_1 = require("./EventDontContainAggregateId");
var EventStore = /** @class */ (function () {
    function EventStore() {
        var _this = this;
        this.events = [];
        this.store = function (event) {
            if (!event.getAggregateId) {
                throw new EventDontContainAggregateId_1.EventDontContainAggregateId(event.constructor.name);
            }
            _this.events.push(event);
        };
    }
    EventStore.prototype.getEventsOfAggregate = function (aggregateId) {
        return this.events.filter(function (event) {
            return event.getAggregateId().equals(aggregateId);
        });
    };
    return EventStore;
}());
exports.EventStore = EventStore;
