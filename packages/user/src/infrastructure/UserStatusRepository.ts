import {UserStatus} from "../domain/UserStatus";
import {UserId} from "../domain/UserId";

export class UserStatusRepository {

    private projections: Map<UserId, UserStatus> = new Map<UserId, UserStatus>();

    remove(userId: UserId) {
        this.projections.delete(userId);
    }

    save(userStatus: UserStatus) {
        this.projections.set(userStatus.userId, userStatus);
    }

    getStatuses(): UserStatus[] {
        const statuses: UserStatus[] = [];
        for(let status of this.projections.values()) {
            statuses.push(status);
        }
        return statuses;
    }
}