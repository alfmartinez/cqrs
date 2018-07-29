import {createUser, SessionStarted, User, UserCreated} from "../../src/domain/User";
import {UserId} from "../../src/domain/UserId";
import {SessionId} from "../../src/domain/SessionId";

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
});

describe("User", () => {

    let eventsRaised: any[];
    const publishEvent = (event) => {
        eventsRaised.push(event);
    }
    const userId = new UserId("foo");
    const username = "Ralph";
    const createdUserEvent = new UserCreated(userId, username);
    const sessionId = new SessionId("boo");
    const sessionStarted = new SessionStarted(userId, sessionId);

    beforeEach(() => {
        eventsRaised = [];
    });


    it("When login, should return sessionId", () => {
        const events = [createdUserEvent, sessionStarted];
        const user: User = new User(events);
        const state = user.getView();

        expect(state).toHaveProperty("userId", userId);
        expect(state).toHaveProperty("username", username);
        expect(state).toHaveProperty("sessionId", sessionId);
    });

    it("When login, should return sessionId", () => {
        const events = [createdUserEvent];
        const user: User = new User(events);
        const sessionId = user.login(publishEvent);
        expect(sessionId).toBeInstanceOf(SessionId);

        expect(eventsRaised.length).toBe(1);
        const actualEvent = eventsRaised[0];
        expect(actualEvent).toBeInstanceOf(SessionStarted);
        expect(actualEvent).toHaveProperty("userId", userId);
        expect(actualEvent).toHaveProperty("sessionId", sessionId);

    })
})