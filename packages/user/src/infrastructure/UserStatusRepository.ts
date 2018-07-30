import {UserStatus} from "../domain/UserStatus";
import {UserId} from "..";

export class UserStatusRepository {

    remove(userId: UserId) {

    }

    save(userStatus: UserStatus) {
        this.projections.push(userStatus);
    }

    private projections: UserStatus[] = [];

    getStatuses(): UserStatus[] {
        return this.projections;
    }
}