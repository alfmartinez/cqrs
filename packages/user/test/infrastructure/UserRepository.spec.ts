import {EventStore} from "@cqrs-alf/common";
import {UnknownUser, UserRepository} from "../../src/infrastructure/UserRepository";
import {UserId} from "../../src/domain/UserId";
import {SessionClosed, SessionStarted, UserCreated} from "../../src/domain/User";
import {SessionId} from "../../src/domain/SessionId";

describe("UserRepository", () => {
    let store: EventStore;
    let repository: UserRepository;

    beforeEach(() => {
        store = new EventStore();
        repository = new UserRepository(store);
    })

    it("should throw if unknown user", () => {
        const userId = new UserId("foo");
        expect(() => repository.getUser(userId))
            .toThrow(UnknownUser);
    });

    it("should return known user", () => {
        const userId = new UserId("foo");
        const username = "Ralph";
        const sessionId = new SessionId("foo");
        const date = new Date();

        store.store(new UserCreated(userId, username));
        store.store(new SessionStarted(userId,sessionId,username, date));
        store.store(new SessionClosed(userId,sessionId));

        const actual = repository.getUser(userId);
        const state = actual.getView();
        expect(state).toHaveProperty("userId", userId);
        expect(state).toHaveProperty("username", username);
        expect(state).toHaveProperty("sessionId", sessionId);
        expect(state).toHaveProperty("connected", false);
    });

    it("should return connected known user", () => {
        const userId = new UserId("foo");
        const username = "Ralph";
        const sessionId = new SessionId("foo");
        const date = new Date();

        store.store(new UserCreated(userId, username));
        store.store(new SessionStarted(userId,sessionId,username, date));

        const actual = repository.getUser(userId);
        const state = actual.getView();
        expect(state).toHaveProperty("userId", userId);
        expect(state).toHaveProperty("username", username);
        expect(state).toHaveProperty("sessionId", sessionId);
        expect(state).toHaveProperty("connected", true);
    });
})