import { EventStore } from "@cqrs-alf/common";
import { Character, CharacterId } from "../domain/Character";
export declare class UnknownCharacter implements Error {
    name: string;
    message: string;
    constructor(message?: string);
}
export declare class CharacterRepository {
    eventStore: EventStore;
    constructor(eventStore: EventStore);
    getCharacter(characterId: CharacterId): Character;
    private getAllEvents;
}
