export class Slot {
    public item: Item;
    public equipped: boolean;

    constructor(item: Item, equipped: boolean = false) {
        this.item = item;
        this.equipped = equipped;
    }
}
