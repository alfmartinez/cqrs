"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@cqrs-alf/common");
class BattleId extends common_1.ValueType {
    constructor(id) {
        super();
        this.battleId = id;
    }
    toString() {
        return "Battle: " + this.battleId;
    }
}
exports.BattleId = BattleId;
class BattleCreated {
    constructor(battleId) {
        this.battleId = battleId;
    }
    getAggregateId() {
        return this.battleId;
    }
}
exports.BattleCreated = BattleCreated;
class Battle {
    constructor(events) {
        this.projection = new common_1.DecisionProjection();
        this.projection
            .register(BattleCreated, function (evt) {
            this.battleId = evt.battleId;
        })
            .apply(events);
    }
    getView() {
        return this.projection.state;
    }
}
exports.Battle = Battle;
function createBattle(publishEvent) {
    const battleId = new BattleId(common_1.IdGenerator.generate());
    const battleCreated = new BattleCreated(battleId);
    publishEvent(battleCreated);
    return battleId;
}
exports.createBattle = createBattle;
