import {EventPublisher} from "@cqrs-alf/common";
import {UserStatusRepository} from "../infrastructure/UserStatusRepository";
import {SessionClosed, SessionStarted} from "./User";
import {UserStatus} from "./UserStatus";

export class UpdateUserStatus {
    private repository: UserStatusRepository;
    constructor(userStatusRepository: UserStatusRepository) {
        this.repository = userStatusRepository;
    }

    public register(eventPublisher: EventPublisher) {
        eventPublisher.on(SessionStarted, (event: SessionStarted) => {
            this.removeProjection(event);
            this.saveProjection(event);
        }).on(SessionClosed, (event: SessionClosed) => {
            this.removeProjection(event);
        });
    }

    private removeProjection(event: SessionClosed | SessionStarted) {
        this.repository.remove(event.userId);
    }

    private saveProjection(event: SessionStarted) {
        const {userId, username, sessionId, date} = event;
        const userStatus = new UserStatus(userId, username, sessionId, date);
        this.repository.save(userStatus);
    }
}
