import {Item} from "../../src/domain/Item";

describe("Item", () => {
    it("should be same if value is same", () => {
        const itemA = new Item("A");
        const otherItemA = new Item("A");
        expect(itemA.equals(otherItemA)).toBe(true);
    });

    it("should be different if different value", () => {
        const itemA = new Item("A");
        const itemB = new Item("B");

        expect(itemA.equals(itemB)).toBe(false);
    })

})