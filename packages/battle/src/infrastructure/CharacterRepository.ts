import {EventStore} from "@cqrs/common";
import {Character, CharacterId} from "../domain/core/Character";

export class UnknownCharacter implements Error {}

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
