import {EquipmentLevel} from "./Equipment";
import {Item} from "./Item";
import {Slot} from "./Slot";

export function createItemSet(level: EquipmentLevel) {
    return [
        new Slot(new Item("helmet"), 0),
        new Slot(new Item("knife"), 1),
        new Slot(new Item("buckler"), 2),
        new Slot(new Item("cloak"), 3),
        new Slot(new Item("cloth"), 4),
        new Slot(new Item("boots"), 5),
    ];
}
