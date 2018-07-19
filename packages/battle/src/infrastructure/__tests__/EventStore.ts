import {ValueType} from "../../ValueType";
import {EventDontContainsAggregateId, EventStore} from "../EventStore";

class AggregateId extends ValueType {
    private aggregateId: string;

    constructor(id: string) {
        this.aggregateId = id;
    }

    public toString() {
        return "Aggregate: " + this.aggregateId;
    }
}

class Event {
    public aggregateId: AggregateId;
    constructor(aggregateId) {
        this.aggregateId = aggregateId;
    }
    public getAggregateId() {
        return this.aggregateId;
    }
}

class BadEvent {}

describe("EventStore", () => {

    let eventsStore: EventStore;

    beforeEach(() => {
        eventsStore = new EventStore();
    });

    it("When store event of aggregate Then can get this event of aggregate", () => {
        const aggregateId = new AggregateId("AggregateA");
        eventsStore.store(new Event(aggregateId));

        const result = eventsStore.getEventsOfAggregate(aggregateId);

        expect(result).toContainEqual(new Event(aggregateId));
    });

    it("When store events of different aggregates Then can get event of chosen aggregate", () => {
        const aggregateId = new AggregateId("AggregateA");
        const otherAggregateId = new AggregateId("AggregateB");
        eventsStore.store(new Event(aggregateId));
        eventsStore.store(new Event(otherAggregateId));
        eventsStore.store(new Event(aggregateId));

        const result = eventsStore.getEventsOfAggregate(aggregateId);
        expect(result.length).toBe(2);
        expect(result).toContainEqual(new Event(aggregateId));
        expect(result).not.toContainEqual(new Event(otherAggregateId));
    });

    it("When store event with no aggregateId, throw", () => {
        expect(() => {
            eventsStore.store(new BadEvent());
        }).toThrow(EventDontContainsAggregateId);
    });
});
