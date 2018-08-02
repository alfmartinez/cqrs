import {DecisionProjection, IAggregable, IdGenerator, ValueType} from "@cqrs-alf/common";

export class BattleId extends ValueType {
    public battleId: string;

    constructor(id: string) {
        super();
        this.battleId = id;
    }

    public toString() {
        return "Battle: " + this.battleId;
    }
}

export class BattleCreated implements IAggregable {
    public battleId: BattleId;

    constructor(battleId: BattleId) {
        this.battleId = battleId;
    }

    public getAggregateId(): any {
        return this.battleId;
    }
}

interface IBattleView {
    battleId: BattleId;
}

export class Battle {
    public projection: DecisionProjection<IBattleView> = new DecisionProjection<IBattleView>();

    constructor(events: IAggregable[] | IAggregable) {
        this.projection
            .register(BattleCreated, function(this: IBattleView, evt: BattleCreated) {
                this.battleId = evt.battleId;
            })
            .apply(events);
    }

    public getView() {
        return this.projection.state;
    }
}

export function createBattle(publishEvent: (evt: IAggregable) => void) {
    const battleId = new BattleId(IdGenerator.generate());
    const battleCreated = new BattleCreated(battleId);
    publishEvent(battleCreated);
    return battleId;
}
