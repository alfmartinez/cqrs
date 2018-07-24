"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DecisionProjection {
    constructor() {
        this.state = {};
        this.handlers = {};
    }
    register(eventType, action) {
        this.handlers[eventType.name] = action;
        return this;
    }
    apply(events) {
        if (events instanceof Array) {
            events.forEach((singleEvent) => this.apply.call(this, singleEvent));
            return this;
        }
        const event = events;
        const typeName = event.constructor.name;
        const handler = this.handlers[typeName];
        if (handler) {
            handler.call(this.state, event);
        }
        return this;
    }
}
exports.DecisionProjection = DecisionProjection;
