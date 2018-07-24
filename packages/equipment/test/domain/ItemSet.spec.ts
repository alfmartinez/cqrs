import {createItemSet} from "../../src/domain/ItemSet";
import {EquipmentLevel} from "../../src/domain/Equipment";
import {CharacterClass} from "@fubattle/character";

fdescribe("ItemSet factory", () => {
    it("should return slots", () => {
        const actual = createItemSet(EquipmentLevel.WHITE, CharacterClass.FIGHTER);
        expect(actual.length).toBe(6);
    })
})