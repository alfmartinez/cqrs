import {EventEmitter} from "events";

export class EventPublisher {
    public eventEmitter = new EventEmitter();

    public onAny(action) {
        this.eventEmitter.on("*", action);
        return this;
    }

    public on(eventType, action) {
        this.eventEmitter.on(eventType.name, action);
        return this;
    }

    public publish(event) {
        this.eventEmitter.emit("*", event);

        const eventName = event.constructor.name;
        this.eventEmitter.emit(eventName, event);
    }

}
