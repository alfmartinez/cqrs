export declare class EventDontContainAggregateId implements Error {
    name: string;
    message: string;
    eventName: string;
    constructor(eventName: string);
}
