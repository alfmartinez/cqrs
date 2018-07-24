import {createBattle, BattleId} from "../../src/domain/Battle";

describe("Battle factory", () => {
    it("should create a new battle", () => {
        const actual = createBattle();
        expect(actual).toBeInstanceOf(BattleId);
    })
})