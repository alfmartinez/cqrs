import {SessionId} from "../domain/SessionId";
import {UserId} from "../domain/UserId";
import {UserStatus} from "../domain/UserStatus";

export class UserStatusRepository {

    private projections: Map<UserId, UserStatus> = new Map<UserId, UserStatus>();

    public remove(userId: UserId) {
        this.projections.delete(userId);
    }

    public save(userStatus: UserStatus) {
        this.projections.set(userStatus.userId, userStatus);
    }

    public getStatuses(): UserStatus[] {
        const statuses: UserStatus[] = [];
        for (const status of this.projections.values()) {
            statuses.push(status);
        }
        return statuses;
    }

    public hasSession(sessionId: SessionId) {
        for (const status of this.projections.values()) {
            if (status.sessionId.equals(sessionId)) { return true; }
        }
        return false;
    }
}
