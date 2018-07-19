export class EventDontContainsAggregateId implements Error {
    public eventName: string;
    constructor(eventName) {
        this.eventName = eventName;
    }
}

export class EventStore {
    public events: any[] = [];

    public store = (event) => {
        if (!event.getAggregateId) {
            throw new EventDontContainsAggregateId(event.constructor.name);
        }
        this.events.push(event);
    }

    public getEventsOfAggregate(aggregateId) {
        return this.events.filter((event) => {
            return event.getAggregateId().equals(aggregateId);
        });
    }
}
