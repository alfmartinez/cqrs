import {Item} from "./Item";

export class Slot {
    public item: Item;
    public equipped: boolean;
    public index: number;

    constructor(item: Item, index: number, equipped: boolean = false) {
        this.item = item;
        this.index = index;
        this.equipped = equipped;
    }
}
