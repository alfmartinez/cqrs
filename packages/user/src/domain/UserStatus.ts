import {SessionId} from "./SessionId";
import {UserId} from "./UserId";

export class UserStatus {
    public userId: UserId;
    public username: string;
    public sessionId: SessionId;
    public loggedSince: Date;

    constructor(userId: UserId, username: string, sessionId: SessionId, loggedSince: Date) {
        this.userId = userId;
        this.username = username;
        this.sessionId = sessionId;
        this.loggedSince = loggedSince;
    }
}
