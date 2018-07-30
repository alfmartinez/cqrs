import {UserStatusRepository} from "../../src/infrastructure/UserStatusRepository";
import {UserStatus} from "../../src/domain/UserStatus";
import {SessionId, UserId} from "../../src";

describe("UserStatusRepository", () => {

    let repository: UserStatusRepository;
    const userId = new UserId("foo");
    const username = "Ralph";
    const sessionId = new SessionId("bar");
    const loggedSince = new Date();
    const status = new UserStatus(userId, username, sessionId, loggedSince);

    beforeEach(() => {
        repository = new UserStatusRepository();
        repository.save(status);
    });

    it("should save UserStatus", () => {
        const statuses = repository.getStatuses();
        expect(statuses.length).toBe(1);
        expect(statuses).toContain(status);
    });

    it("should remove UserStatuses for given userId", () => {
        repository.remove(userId);
        const statuses = repository.getStatuses();
        expect(statuses.length).toBe(0);
    });

    it("should tell if a session exists for given id", () => {
        repository.save(status);

        expect(repository.hasSession(new SessionId("baz"))).toBe(false);
        expect(repository.hasSession(sessionId)).toBe(true);
    })
})