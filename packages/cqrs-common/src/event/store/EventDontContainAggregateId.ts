export class EventDontContainAggregateId implements Error {
    name: string = "EventDontContainAggregateId";
    message: string;
    public eventName: string;
    constructor(eventName: string) {
        this.eventName = eventName;
        this.message = eventName + " dont contain an aggregate Id";
    }
}
