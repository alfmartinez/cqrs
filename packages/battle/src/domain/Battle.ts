import {ValueType, IdGenerator, Aggregable, DecisionProjection} from "@cqrs-alf/common";

export class BattleId extends ValueType {
    battleId: string;

    constructor(id: string) {
        super();
        this.battleId = id;
    }

    toString() {
        return "Battle: " + this.id;
    }
}

export class BattleCreated implements Aggregable {
    battleId: BattleId;

    constructor(battleId: BattleId) {
        this.battleId = battleId;
    }

    getAggregateId(): any {
        return this.battleId;
    }
}

interface BattleView {
    battleId: BattleId;
}

export class Battle {
    projection: DecisionProjection<BattleView> = new DecisionProjection<BattleView>()

    constructor(events: Aggregable[] | Aggregable) {
        this.projection
            .register(BattleCreated, function (this: BattleView, evt: BattleCreated) {
                this.battleId = evt.battleId;
            })
            .apply(events);
    }

    getView() {
        return this.projection.state;
    }
}

export function createBattle(publishEvent: (evt: Aggregable) => void) {
    const battleId = new BattleId(IdGenerator.generate());
    const battleCreated = new BattleCreated(battleId);
    publishEvent(battleCreated);
    return battleId;
}