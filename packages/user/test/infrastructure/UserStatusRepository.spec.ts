import {UserStatusRepository} from "../../src/infrastructure/UserStatusRepository";
import {UserStatus} from "../../src/domain/UserStatus";
import {SessionId, UserId} from "../../src";

describe("UserStatusRepository", () => {

    let repository: UserStatusRepository;
    const userId = new UserId("foo");
    const username = "Ralph";
    const sessionId = new SessionId("bar");
    const loggedSince = new Date();

    beforeEach(() => {
            repository = new UserStatusRepository();
    });

    it("should save UserStatus", () => {
        const status = new UserStatus(userId, username, sessionId, loggedSince);
        repository.save(status);

        const statuses = repository.getStatuses();
        expect(statuses.length).toBe(1);
        expect(statuses).toContain(status);
    })
})