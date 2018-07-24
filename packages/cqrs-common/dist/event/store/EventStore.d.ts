import { Aggregable } from "../Aggregable";
export declare class EventStore {
    events: any[];
    store: (event: Aggregable) => void;
    getEventsOfAggregate(aggregateId: any): any[];
}
