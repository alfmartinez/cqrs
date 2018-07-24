import {createItemSet} from "../../src/domain/ItemSet";
import {EquipmentLevel} from "../../src/domain/Equipment";
import {CharacterClass} from "@fubattle/character";

describe("ItemSet factory", () => {
    it("should return slots", () => {
        const actual = createItemSet(EquipmentLevel.WHITE, CharacterClass.FIGHTER);
        expect(actual.length).toBe(6);
    })
})