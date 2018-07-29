import {IdGenerator, DecisionProjection, Aggregable} from "@cqrs-alf/common";
import {UserId} from "./UserId";
import {Aggregable} from "../../../cqrs-common/src";

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

interface IUserState {
    userId: UserId;
    username: string;
}

export class User {
    projection: DecisionProjection<IUserState> = new DecisionProjection<IUserState>();

    constructor(events: Aggregable | Aggregable[]) {
        this.projection
            .register(UserCreated, function(this: IUserState, evt: UserCreated) {
                this.userId = evt.userId;
                this.username = evt.username;
            })
            .apply(events);
    }

    getView() {
        return this.projection.state;
    }
}

export function createUser(publishEvent: (evt: any) => any, username: string) {
    const userId = new UserId(IdGenerator.generate());
    publishEvent(new UserCreated(userId,username));
    return userId;

}