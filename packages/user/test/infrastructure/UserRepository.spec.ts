import {EventStore} from "@cqrs-alf/common";
import {UnknownUser, UserRepository} from "../../src/infrastructure/UserRepository";
import {UserId} from "../../src/domain/UserId";
import {UserCreated} from "../../src/domain/User";

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
        store.store(new UserCreated(userId, username));
        const actual = repository.getUser(userId);
        const state = actual.getView();
        expect(state).toHaveProperty("userId", userId);
        expect(state).toHaveProperty("username", username);
    });
})