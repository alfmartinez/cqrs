import {createUser, UserCreated} from "../../src/domain/User";
import {UserId} from "../../src";

describe("User Factory", () => {

    let eventsRaised: any[];
    const publishEvent = (event) => {
        eventsRaised.push(event);
    }

    beforeEach(() => {
        eventsRaised = [];
    });

    it("should publish UserCreatedEvent and return userId", () => {
        const actual = createUser(publishEvent, "foo");
        expect(actual).toBeInstanceOf(UserId);
        expect(eventsRaised.length).toBe(1);

        const expectedEvent = new UserCreated(actual, "foo");
        expect(eventsRaised).toContainEqual(expectedEvent);
    })
})