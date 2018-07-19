import {DecisionProjection} from "../DecisionProjection";

class EventA {
    public userId = "UserA";
}

class EventB {
    public valueB = "ValueB";
}

class State {
    public isCalled: boolean = false;
}

describe("DecisionProjection", () => {
    const projection: DecisionProjection<State> = new DecisionProjection<State>(new State());

    it("When register Event Then call action on apply of this event", () => {

        projection.register(EventA,  function setCalled() {
            this.isCalled = true;
        }).apply(new EventA());

        expect(projection.state.isCalled).toBe(true);
    });
});
