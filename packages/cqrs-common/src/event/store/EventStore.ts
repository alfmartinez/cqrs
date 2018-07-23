import {EventDontContainAggregateId} from "./EventDontContainAggregateId";

export class EventStore {
    public events: any[] = [];

    public store = (event: any) => {
        if (!event.getAggregateId) {
            throw new EventDontContainAggregateId(event.constructor.name);
        }
        this.events.push(event);
    }

    public getEventsOfAggregate(aggregateId: any) {
        return this.events.filter((event) => {
            return event.getAggregateId().equals(aggregateId);
        });
    }
}
