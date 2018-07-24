import {ValueType} from "@cqrs-alf/common";
import {CharacterClass} from "@fubattle/character";
import {Bonus} from "./Bonus";
import {EquipmentLevel} from "./Equipment";
import {itemMap} from "./ItemMap";

export class Item extends ValueType {
    public name: string;
    public bonus: Bonus;
    constructor(name: string, bonus: Bonus) {
        super();
        this.name = name;
        this.bonus = bonus;
    }

    public toString(): string {
        return "Item: " + this.name;
    }
}

export function createItem(slot: number, className: CharacterClass, level: EquipmentLevel) {
    if (!itemMap[className]) {
        throw new Error("No item map for " + className);
    }
    if (!itemMap[className][level]) {
        throw new Error("No item map for " + className + " at level " + level);
    }
    if (!itemMap[className][level][slot]) {
        throw new Error("No item map for " + className + " at level " + level + " for slot " + slot);
    }
    const [name, category, attribute, value] = itemMap[className][level][slot];
    return new Item(name, new Bonus(category, attribute, value));
}
