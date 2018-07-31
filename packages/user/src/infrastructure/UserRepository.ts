import {EventStore} from "@cqrs-alf/common";
import {User} from "../domain/User";
import {UserId} from "../domain/UserId";

export class UnknownUser implements Error {
    public name: string = "UnknownUser";
    public message: string;

    constructor(message: string = "Unknown User") {
        this.message = message;
    }
}

export class UserRepository {
    public eventStore: EventStore;

    constructor(eventStore: EventStore) {
        this.eventStore = eventStore;
    }

    public getUser(userId: UserId) {
        const events = this.getAllEvents(userId);
        return new User(events);
    }

    private getAllEvents(userId: UserId) {
        const events = this.eventStore.getEventsOfAggregate(userId);
        if (!events.length) {
            throw new UnknownUser();
        }
        return events;
    }
}
