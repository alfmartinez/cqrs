import {DecisionProjection} from "@cqrs-alf/common";
import {CharacterClass, CharacterCreated, CharacterId, LevelGained} from "@fubattle/character";


export class Energy {
    health: number = 100;
    mana: number = 100;

    add(increment: Energy) {
        this.health += increment.health;
        this.mana += increment.mana;
    }
}

export class Attributes {
    attack: number = 10;
    defense: number = 10;
    damage: number = 10;

    add(increment: Attributes) {
        this.attack += increment.attack;
        this.defense += increment.defense;
        this.damage += increment.damage;
    }
}

export interface ICharacterAttributesView {
    characterId: CharacterId;
    className: CharacterClass;
    energy: Energy;
    normal: Attributes;
    special: Attributes;
}

export class CharacterAttributes {
    private projection = new DecisionProjection<ICharacterAttributesView>();
    constructor(events: any[]) {
        this.projection
            .register(CharacterCreated, function(this: ICharacterAttributesView, evt: CharacterCreated) {
                this.characterId = evt.characterId;
                this.className = evt.className;
                this.energy = new Energy();
                this.normal = new Attributes();
                this.special = new Attributes();
            })
            .register(LevelGained, function(this: ICharacterAttributesView, evt: LevelGained) {
                this.energy.add({
                    health: 10,
                    mana: 5
                } as Energy);
                this.normal.add({
                    attack: 2,
                    defense: 1,

                    damage: 2
                } as Attributes);
                this.special.add({
                    attack: 1,
                    defense: 1,

                    damage: 1
                } as Attributes);
            })
            .apply(events);

    }
    public getView(): ICharacterAttributesView {
        return this.projection.state;
    }
}
