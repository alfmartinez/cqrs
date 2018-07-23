export declare class EventStore {
    events: any[];
    store: (event: any) => void;
    getEventsOfAggregate(aggregateId: any): any[];
}
