import { EventStore } from "@cqrs-alf/common";
import { CharacterId } from "@fubattle/character";
import { Equipment } from "../domain/Equipment";
export declare class UnknownCharacter implements Error {
    name: string;
    message: string;
    constructor(message?: string);
}
export declare class EquipmentRepository {
    eventStore: EventStore;
    constructor(eventStore: EventStore);
    getEquipment(characterId: CharacterId): Equipment;
    private getAllEvents;
}
