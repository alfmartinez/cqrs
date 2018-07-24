import {createItem, Item} from "../../src/domain/Item";
import {CharacterClass} from "@fubattle/character";

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

describe("Item factory", () => {
    it("should throw if unknown class", () => {
        expect(
            () => createItem(0, "foo",0)
        ).toThrow(new Error("No item map for foo"))
    });

    it("should throw if unknown level", () => {
        expect(
            () => createItem(0, CharacterClass.FIGHTER, 100)
        ).toThrow(new Error("No item map for fighter at level 100"))
    });

    it("should throw if unknown slot", () => {
        expect(
            () => createItem(6, CharacterClass.FIGHTER, 0)
        ).toThrow(new Error("No item map for fighter at level 0 for slot 6"))
    });
})