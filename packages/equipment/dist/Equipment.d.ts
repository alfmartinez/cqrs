import { Aggregable } from "@cqrs-alf/common";
import { CharacterId } from "@fubattle/character";
export declare enum EquipmentLevel {
    WHITE = 0,
    GREEN0 = 1,
    GREEN1 = 2,
    BLUE0 = 3,
    BLUE1 = 4,
    BLUE2 = 5,
    PURPLE0 = 6,
    PURPLE1 = 7,
    PURPLE2 = 8,
    PURPLE3 = 9
}
export declare class SlotNotEquipped implements Error {
    name: string;
    message: string;
    slot: number;
    constructor(slot: number);
}
export declare class ItemEquipped implements Aggregable {
    characterId: CharacterId;
    slot: number;
    constructor(characterId: CharacterId, slot: number);
    getAggregateId(): any;
}
export declare class EquipmentUpgraded implements Aggregable {
    characterId: CharacterId;
    level: EquipmentLevel;
    constructor(characterId: CharacterId, level: EquipmentLevel);
    getAggregateId(): any;
}
export declare class Equipment {
    private projection;
    constructor(events: any[] | any);
    equipItem(publishEvent: (evt: any) => void, slotNumber: number): void;
    upgrade(publishEvent: (evt: any) => void): void;
}
