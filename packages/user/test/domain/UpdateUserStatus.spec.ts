import {EventPublisher} from "@cqrs-alf/common";
import {UserStatusRepository} from "../../src/infrastructure/UserStatusRepository";
import {SessionClosed, SessionId, SessionStarted, UserId} from "../../src";
import {UserStatus} from "../../src/domain/UserStatus";
import {UpdateUserStatus} from "../../src/domain/UpdateUserStatus";
jest.mock('../../src/infrastructure/UserStatusRepository');

describe("UpdateUserStatus", () => {

    const eventPublisher = new EventPublisher();
    const userStatusRepository = new UserStatusRepository();
    const userUpdateStatus = new UpdateUserStatus(userStatusRepository);
    userUpdateStatus.register(eventPublisher);

    it("should save UserStatusProjection on SessionStarted", () => {

        const userId = new UserId("foo");
        const sessionId = new SessionId("bar");
        const expectedDate = new Date();
        const username = "Ralph";

        eventPublisher.publish(new SessionStarted(userId,sessionId, username, expectedDate));

        const expectedUserStatus = new UserStatus(userId, username, sessionId, expectedDate);

        expect(userStatusRepository.remove).toHaveBeenCalledWith(userId);
        expect(userStatusRepository.save).toHaveBeenCalledWith(expectedUserStatus)
    });


    it("should remove UserStatusProjection on SessionClosed", () => {

        const userId = new UserId("foo");
        const sessionId = new SessionId("bar");

        eventPublisher.publish(new SessionClosed(userId,sessionId));

        expect(userStatusRepository.remove).toHaveBeenCalledWith(userId);
    });
})