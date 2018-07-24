import {CharacterClass} from "@fubattle/character";
import {EquipmentLevel} from "./Equipment";
import {createItem} from "./Item";
import {Slot} from "./Slot";

export function createItemSet(level: EquipmentLevel, className: CharacterClass) {
    return [...Array(6).keys()].map(
        (slot) => new Slot(createItem(slot, className, level), slot),
    );
}
