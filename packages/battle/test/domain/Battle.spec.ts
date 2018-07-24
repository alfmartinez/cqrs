import {createBattle, BattleId, BattleCreated, Battle} from "../../src/domain/Battle";

describe("Battle factory", () => {

    let eventsRaised: any[];
    const publishEvent = (evt) => {
        eventsRaised.push(evt);
    };

    beforeEach(() => {
        eventsRaised = [];
    });

    it("should create a new battle", () => {
        const id = createBattle(publishEvent);
        expect(id).toBeInstanceOf(BattleId);

        const expectedEvent = new BattleCreated(id);
        expect(eventsRaised).toContainEqual(expectedEvent);
    });
});

describe("Battle", () => {
    const battleId = new BattleId("foo");
    const battleCreated = new BattleCreated(battleId);

    it("should project an empty state", () => {
        const battle = new Battle([]);
        const actual = battle.getView();
        expect(actual).toEqual({});
    });

    it("should project an empty state", () => {
        const battle = new Battle([battleCreated]);
        const actual = battle.getView();
        expect(actual).toEqual({
            battleId
        });
    });
})