import {DecisionProjection} from "@cqrs-alf/common";
import {CharacterCreated, CharacterId} from "@fubattle/character";

export enum EquipmentLevel {
    WHITE,
    GREEN0,
    GREEN1,
    BLUE0,
    BLUE1,
    BLUE2,
    PURPLE0,
    PURPLE1,
    PURPLE2,
    PURPLE3,
}

interface IEquipment {
    characterId: CharacterId;
    className: string;
    level: number;
}

export class Equipment {
    private projection = new DecisionProjection<IEquipment>();

    constructor(events) {
        this.projection
            .register(CharacterCreated, function(this: IEquipment, evt: CharacterCreated) {
                this.characterId = evt.characterId;
                this.className = evt.className;
                this.level = EquipmentLevel.WHITE;
            })
            .apply(events);
    }
}
