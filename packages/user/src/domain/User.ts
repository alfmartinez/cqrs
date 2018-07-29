import {IdGenerator} from "@cqrs-alf/common";
import {UserId} from "./UserId";

export class UserCreated {
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

export function createUser(publishEvent: (evt: any) => any, username: string) {
    const userId = new UserId(IdGenerator.generate());
    publishEvent(new UserCreated(userId,username));
    return userId;

}