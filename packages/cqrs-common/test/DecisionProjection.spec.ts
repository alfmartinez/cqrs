import {DecisionProjection} from "./DecisionProjection";

class EventA {
    public userId = "UserA";
}

class EventB {
    public valueB = "ValueB";
}

class State {
    public isCalled: boolean = false;
    public userId: string;
    public valueB: string;
}

describe("DecisionProjection", () => {
    const projection: DecisionProjection<State> = new DecisionProjection<State>();

    it("When register Event Then call action on apply of this event", () => {

        projection.register(EventA,  function setCalled() {
            (<State>this).isCalled = true;
        }).apply(new EventA());

        expect(projection.state.isCalled).toBe(true);
    });

    it("Given several event registered When apply Then call good handler for each event", () => {
        projection.register(EventA, function setUserId(event) {
            (<State>this).userId = event.userId;
        }).register(EventB, function setValueB(event) {
            (<State>this).valueB = event.valueB;
        }).apply([new EventA(), new EventB()]);

        expect(projection.state.userId).toBe("UserA");
        expect(projection.state.valueB).toBe("ValueB");
    });

    it("When apply an event not registered Then nothing", () => {
        projection.apply(new EventA());

        expect(projection.userId).not.toBeDefined();
    });
});
