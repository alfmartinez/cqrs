import {EquipmentLevel} from "./Equipment";
import {Item} from "./Item";
import {Slot} from "./Slot";

export function createItemSet(level: EquipmentLevel) {
    return [
        new Slot(new Item("helmet")),
        new Slot(new Item("knife")),
        new Slot(new Item("buckler")),
        new Slot(new Item("cloak")),
        new Slot(new Item("cloth")),
        new Slot(new Item("boots")),
    ];
}
