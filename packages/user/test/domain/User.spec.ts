import {AuthenticationError, createUser, SessionClosed, SessionStarted, User, UserCreated} from "../../src/domain/User";
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
        const actual = createUser(publishEvent, "foo", "bar");
        expect(actual).toBeInstanceOf(UserId);
        expect(eventsRaised.length).toBe(1);

        const expectedEvent = new UserCreated(actual, "foo", "bar");
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
    const password = "bar";
    const createdUserEvent = new UserCreated(userId, username, password);
    const sessionId = new SessionId("boo");
    const expectedDate = new Date();
    const sessionStarted = new SessionStarted(userId, sessionId, username, expectedDate);
    const sessionClosed = new SessionClosed(userId, sessionId);

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
        expect(state).toHaveProperty("connected", true);
    });

    it("When login and logout, should return sessionId, but have attributed connected to false", () => {
        const events = [createdUserEvent, sessionStarted, sessionClosed];
        const user: User = new User(events);
        const state = user.getView();

        expect(state).toHaveProperty("userId", userId);
        expect(state).toHaveProperty("username", username);
        expect(state).toHaveProperty("sessionId", sessionId);
        expect(state).toHaveProperty("connected", false);
    });


    it("When login, should return sessionId", () => {
        const events = [createdUserEvent];
        const user: User = new User(events);
        expect(() => user.login(publishEvent, "baz"))
            .toThrow(AuthenticationError);
    });

    it("When login, should return sessionId", () => {
        const events = [createdUserEvent];
        const user: User = new User(events);
        const sessionId = user.login(publishEvent, password);
        expect(sessionId).toBeInstanceOf(SessionId);

        expect(eventsRaised.length).toBe(1);
        const actualEvent = eventsRaised[0];
        expect(actualEvent).toBeInstanceOf(SessionStarted);
        expect(actualEvent).toHaveProperty("userId", userId);
        expect(actualEvent).toHaveProperty("sessionId", sessionId);
        expect(actualEvent).toHaveProperty("username", username);
        expect(actualEvent).toHaveProperty("date");

    });

    it("When logout, should publish SessionClosed", () => {
        const events = [createdUserEvent, sessionStarted];
        const user: User = new User(events);
        user.logout(publishEvent);

        expect(eventsRaised.length).toBe(1);
        const actualEvent = eventsRaised[0];
        expect(actualEvent).toBeInstanceOf(SessionClosed);
        expect(actualEvent).toHaveProperty("userId", userId);
        expect(actualEvent).toHaveProperty("sessionId", sessionId);

    })
})