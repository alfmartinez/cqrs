import {EventStore} from "@cqrs-alf/common";
import {Character, CharacterId} from "../domain/Character";

export class UnknownCharacter implements Error {
    name: string = "UnknownCharacter";
    message: string;

    constructor(message: string = "Unknown Character") {
        this.message = message;
    }
}

export class CharacterRepository {
    public eventStore: EventStore;

    constructor(eventStore: EventStore) {
        this.eventStore = eventStore;
    }

    public getCharacter(characterId: CharacterId) {
        const events = this.getAllEvents(characterId);
        return new Character(events);
    }

    private getAllEvents(characterId: CharacterId) {
        const events = this.eventStore.getEventsOfAggregate(characterId);
        if (!events.length) {
            throw new UnknownCharacter();
        }
        return events;
    }
}
