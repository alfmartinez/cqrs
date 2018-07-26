import { ValueType, Aggregable, DecisionProjection } from "@cqrs-alf/common";
export declare class BattleId extends ValueType {
    battleId: string;
    constructor(id: string);
    toString(): string;
}
export declare class BattleCreated implements Aggregable {
    battleId: BattleId;
    constructor(battleId: BattleId);
    getAggregateId(): any;
}
interface BattleView {
    battleId: BattleId;
}
export declare class Battle {
    projection: DecisionProjection<BattleView>;
    constructor(events: Aggregable[] | Aggregable);
    getView(): BattleView;
}
export declare function createBattle(publishEvent: (evt: Aggregable) => void): BattleId;
export {};
