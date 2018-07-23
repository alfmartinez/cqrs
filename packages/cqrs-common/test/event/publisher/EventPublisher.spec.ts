import {EventPublisher} from "../../../src/event/publisher/EventPublisher";

class EventA {
    public value: string = "Value";
}

class EventB {
    public value: string = "Value";
}

describe("EventPublisher", () => {

    const publisher = new EventPublisher();

    it("Given subscribers to onAny, When EventA published, Then should publish events to all subscribers", () => {
        let called = false;
        publisher.onAny(() => {
            called = true;
        });
        publisher.publish(new EventA());
        expect(called).toBe(true);
    });

    it("Given subscribers to EventA, When EventA published, Then should publish EventA to subscribers", () => {
        let called = false;
        publisher.on(EventA, () => {
            called = true;
        });
        publisher.publish(new EventA());
        expect(called).toBe(true);
    });

    it("Given subscribers to EventA, When EventB published, Then should publish events to subscribers", () => {
        let called = false;
        publisher.on(EventA, () => {
            called = true;
        });
        publisher.publish(new EventB());
        expect(called).toBe(false);
    });
});
