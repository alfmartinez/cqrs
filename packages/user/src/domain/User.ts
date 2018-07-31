import {DecisionProjection, IAggregable, IdGenerator} from "@cqrs-alf/common";
import {SessionId} from "./SessionId";
import {UserId} from "./UserId";

export class UserCreated implements IAggregable {
    public userId: UserId;
    public username: string;
    public password: string;

    constructor(userId: UserId, username: string, password: string) {
        this.userId = userId;
        this.username = username;
        this.password = password;
    }

    public getAggregateId() {
        return this.userId;
    }
}

export class SessionStarted implements IAggregable {
    public userId: UserId;
    public sessionId: SessionId;
    public username: string;
    public date: Date;

    constructor(userId: UserId, sessionId: SessionId, username: string, date: Date) {
        this.userId = userId;
        this.sessionId = sessionId;
        this.username = username;
        this.date = date;
    }

    public getAggregateId() {
        return this.userId;
    }
}

export class SessionClosed implements IAggregable {
    public userId: UserId;
    public sessionId: SessionId;

    constructor(userId: UserId, sessionId: SessionId) {
        this.userId = userId;
        this.sessionId = sessionId;
    }

    public getAggregateId() {
        return this.userId;
    }
}

interface IUserState {
    userId: UserId;
    username: string;
    password: string;
    sessionId: SessionId;
    connected: boolean;
}

export class AuthenticationError implements Error {
    public message: string;
    public name: string = "AuthenticationError";

    constructor(message: string) {
        this.message = message;
    }
}

export class User {
    public projection: DecisionProjection<IUserState> = new DecisionProjection<IUserState>();

    constructor(events: IAggregable | IAggregable[]) {
        this.projection
            .register(UserCreated, function(this: IUserState, evt: UserCreated) {
                this.userId = evt.userId;
                this.username = evt.username;
                this.password = evt.password;
            })
            .register(SessionStarted, function(this: IUserState, evt: SessionStarted) {
                this.sessionId = evt.sessionId;
                this.connected = true;
            })
            .register(SessionClosed, function(this: IUserState, evt: SessionClosed) {
                this.sessionId = evt.sessionId;
                this.connected = false;
            })
            .apply(events);
    }

    public getView() {
        return this.projection.state;
    }

    public login(publishEvent: (evt: any) => any, password: string): SessionId {
        if (password !== this.projection.state.password) {
            throw new AuthenticationError("Authentication failed");
        }
        const sessionId = new SessionId(IdGenerator.generate());
        const {userId, username} = this.projection.state;
        const sessionStarted = new SessionStarted(userId, sessionId, username, new Date());
        publishEvent(sessionStarted);

        return sessionId;
    }

    public logout(publishEvent: (evt: any) => any): void {
        const {userId, sessionId} = this.projection.state;
        const sessionClosed = new SessionClosed(userId, sessionId);
        publishEvent(sessionClosed);
    }
}

export function createUser(publishEvent: (evt: any) => any, username: string, password: string) {
    const userId = new UserId(IdGenerator.generate());
    publishEvent(new UserCreated(userId, username, password));
    return userId;

}
