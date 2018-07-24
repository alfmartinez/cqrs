"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class EventPublisher {
    constructor() {
        this.eventEmitter = new events_1.EventEmitter();
        this.publish = (event) => {
            this.eventEmitter.emit("*", event);
            const eventName = event.constructor.name;
            this.eventEmitter.emit(eventName, event);
        };
    }
    onAny(action) {
        this.eventEmitter.on("*", action);
        return this;
    }
    on(eventType, action) {
        this.eventEmitter.on(eventType.name, action);
        return this;
    }
}
exports.EventPublisher = EventPublisher;
