import {UserId} from "./UserId";
import {SessionId} from "./SessionId";

export class UserStatus {
    userId: UserId;
    username: string;
    sessionId: SessionId;
    loggedSince: Date;

    constructor(userId: UserId, username: string, sessionId: SessionId, loggedSince: Date) {
        console.log("Username", username);
        this.userId = userId;
        this.username = username;
        this.sessionId = sessionId;
        this.loggedSince = loggedSince;
    }
}