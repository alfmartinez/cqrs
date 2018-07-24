import {DecisionProjection} from "@cqrs-alf/common";
import {CharacterCreated, CharacterId} from "@fubattle/character";

export interface ICharacterAttributes {
    characterId: CharacterId,
    className: string,
    energy: {
        health: number,
        mana: number
    },
    normal : {
        attack: number,
        defense: number,
        damage: number
    },
    special : {
        attack: number,
        defense: number,
        damage: number
    }
}

export class CharacterAttributes {
    private projection = new DecisionProjection<ICharacterAttributes>();
    constructor(events: any[]) {
        this.projection
            .register(CharacterCreated, function(this: ICharacterAttributes, evt: CharacterCreated) {
                this.characterId = evt.characterId;
                this.className = evt.className;
                this.energy = {
                    health: 100,
                    mana: 100
                };
                this.normal = {
                    attack: 10,
                    defense: 10,
                    damage: 10
                };
                this.special = {
                    attack: 10,
                    defense: 10,
                    damage: 10
                };
            })
            .apply(events);

    }
    getView(): ICharacterAttributes {
        return this.projection.state;
    }
}