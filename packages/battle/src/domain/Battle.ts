import {ValueType,IdGenerator} from "@cqrs-alf/common";
import {IdGenerator} from "../../../cqrs-common/dist";
import {CharacterCreated, CharacterId} from "../../../character/src/domain/Character";

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

export function createBattle() {
    const battleId = new BattleId(IdGenerator.generate());
    return battleId;
}