import {EventStore} from "@cqrs-alf/common";
import {Team, TeamId} from "../domain/Team";

export class UnknownTeam implements Error {
    public name: string = "UnknownTeam";
    public message: string;

    constructor(message: string = "Unknown Team") {
        this.message = message;
    }
}

export class TeamRepository {
    public eventStore: EventStore;

    constructor(eventStore: EventStore) {
        this.eventStore = eventStore;
    }

    public getTeam(teamId: TeamId) {
        const events = this.getAllEvents(teamId);
        return new Team(events);
    }

    private getAllEvents(teamId: TeamId) {
        const events = this.eventStore.getEventsOfAggregate(teamId);
        if (!events.length) {
            throw new UnknownTeam();
        }
        return events;
    }
}
