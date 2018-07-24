import { Item } from "./Item";
export declare class Slot {
    item: Item;
    equipped: boolean;
    index: number;
    constructor(item: Item, index: number, equipped?: boolean);
}
