import { ValueType } from "@cqrs-alf/common";
import { CharacterClass } from "@fubattle/character";
import { Bonus } from "./Bonus";
import { EquipmentLevel } from "./Equipment";
export declare class Item extends ValueType {
    name: string;
    bonus: Bonus;
    constructor(name: string, bonus: Bonus);
    toString(): string;
}
export declare function createItem(slot: number, className: CharacterClass, level: EquipmentLevel): Item;