/// <reference types="node" />
import { EventEmitter } from "events";
export declare class EventPublisher {
    eventEmitter: EventEmitter;
    publish: (event: any) => void;
    onAny(action: (event: any) => void): this;
    on(eventType: any, action: (event: any) => void): this;
}
