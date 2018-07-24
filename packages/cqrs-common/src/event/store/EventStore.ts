import {EventDontContainAggregateId} from "./EventDontContainAggregateId";
import {Aggregable} from "../Aggregable";

export class EventStore {
    public events: any[] = [];

    public store = (event: Aggregable) => {
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
