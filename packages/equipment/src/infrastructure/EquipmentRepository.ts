import {EventStore} from "@cqrs-alf/common";
import {CharacterId} from "@fubattle/character";
import {Equipment} from "../domain/Equipment";

export class UnknownCharacter implements Error {
    public name: string = "UnknownCharacter";
    public message: string;

    constructor(message: string = "Unknown Character") {
        this.message = message;
    }
}

export class EquipmentRepository {
    public eventStore: EventStore;

    constructor(eventStore: EventStore) {
        this.eventStore = eventStore;
    }

    public getEquipment(characterId: CharacterId) {
        const events = this.getAllEvents(characterId);
        return new Equipment(events);
    }

    private getAllEvents(characterId: CharacterId) {
        const events = this.eventStore.getEventsOfAggregate(characterId);
        if (!events.length) {
            throw new UnknownCharacter();
        }
        return events;
    }
}
