import {IdGenerator, DecisionProjection, Aggregable} from "@cqrs-alf/common";
import {UserId} from "./UserId";
import {SessionId} from "./SessionId";

export class UserCreated implements Aggregable {
    userId: UserId;
    username: string;

    constructor(userId: UserId, username: string) {
        this.userId = userId;
        this.username = username;
    }

    public getAggregateId() {
        return this.userId;
    }
}

export class SessionStarted implements Aggregable {
    userId: UserId;
    sessionId: SessionId;
    username: string;
    date: Date;

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

export class SessionClosed implements Aggregable {
    userId: UserId;
    sessionId: SessionId;

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
    sessionId: SessionId;
    connected: boolean;
}

export class User {
    projection: DecisionProjection<IUserState> = new DecisionProjection<IUserState>();

    constructor(events: Aggregable | Aggregable[]) {
        this.projection
            .register(UserCreated, function(this: IUserState, evt: UserCreated) {
                this.userId = evt.userId;
                this.username = evt.username;
            })
            .register(SessionStarted, function(this: IUserState, evt: SessionStarted){
                this.sessionId = evt.sessionId;
                this.connected = true;
            })
            .register(SessionClosed, function(this: IUserState, evt: SessionClosed){
                this.sessionId = evt.sessionId;
                this.connected = false;
            })
            .apply(events);
    }

    getView() {
        return this.projection.state;
    }

    login(publishEvent: (evt:any) => any): SessionId {
        const sessionId = new SessionId(IdGenerator.generate());
        const {userId, username} = this.projection.state;
        const sessionStarted = new SessionStarted(userId, sessionId, username, new Date());
        publishEvent(sessionStarted);

        return sessionId;
    }

    logout(publishEvent: (evt: any) => any): void {
        const {userId, sessionId} = this.projection.state;
        const sessionClosed = new SessionClosed(userId, sessionId);
        publishEvent(sessionClosed);
    }
}

export function createUser(publishEvent: (evt: any) => any, username: string) {
    const userId = new UserId(IdGenerator.generate());
    publishEvent(new UserCreated(userId,username));
    return userId;

}