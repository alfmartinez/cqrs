import {BattleRepository, UnknownBattle} from "../../src/infrastructure/BattleRepository";
import {Battle, BattleCreated, BattleId} from "../../src/domain/Battle";
import {EventStore} from "@cqrs-alf/common";

describe("BattleRepository", () => {

    let store: EventStore;
    let repository: BattleRepository;

    beforeEach(() => {
        store = new EventStore();
        repository = new BattleRepository(store);
    })

    it("should throw if no battle exists for given id", () => {
        const battleId = new BattleId("foo");
        expect(() => repository.getBattle(battleId)).toThrow(new UnknownBattle())
    });

    it("should return battle with given id", () => {
        const battleId = new BattleId("foo");
        store.store(new BattleCreated(battleId));
        const battle = repository.getBattle(battleId);
        expect(battle).toBeInstanceOf(Battle);
        const battleView = battle.getView();
        expect(battleView.battleId.equals(battleId));
    });
})