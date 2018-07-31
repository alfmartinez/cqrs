export class EventDontContainAggregateId implements Error {
    public name: string = "EventDontContainAggregateId";
    public message: string;
    public eventName: string;
    constructor(eventName: string) {
        this.eventName = eventName;
        this.message = eventName + " dont contain an aggregate Id";
    }
}
