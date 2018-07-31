import {EventEmitter} from "events";

export class EventPublisher {
    public eventEmitter = new EventEmitter();

    public publish = (event: any) => {
        this.eventEmitter.emit("*", event);
        const eventName = event.constructor.name;
        this.eventEmitter.emit(eventName, event);
    }

    public onAny(action: (event: any) => void) {
        this.eventEmitter.on("*", action);
        return this;
    }

    public on(eventType: any, action: (event: any) => void) {
        this.eventEmitter.on(eventType.name, action);
        return this;
    }

}
