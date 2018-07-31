import {DecisionProjection} from "@cqrs-alf/common";
import {CharacterClass, CharacterCreated, CharacterId, LevelGained} from "@fubattle/character";
import {Bonus, ItemEquipped} from "@fubattle/equipment";

export class Energy {
    public health: number;
    public mana: number;

    constructor(health = 0, mana = 0) {
        this.health = health;
        this.mana = mana;
    }

    public add(increment: Energy) {
        this.health += increment.health;
        this.mana += increment.mana;
    }
}

export class Attributes {
    public attack: number;
    public defense: number;
    public damage: number;

    constructor(attack: number = 0, defense: number = 0, damage: number = 0) {
        this.attack = attack;
        this.defense = defense;
        this.damage = damage;
    }

    public add(increment: Attributes) {
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
                this.energy = new Energy(100, 100);
                this.normal = new Attributes(10, 10, 10);
                this.special = new Attributes(10, 10, 10);
            })
            .register(LevelGained, function(this: ICharacterAttributesView, evt: LevelGained) {
                this.energy.add(new Energy(10, 5));
                this.normal.add(new Attributes(2, 1, 2));
                this.special.add(new Attributes(1, 1, 1));
            })
            .register(ItemEquipped, function(this: ICharacterAttributesView, evt: ItemEquipped) {
                const bonus: Bonus = evt.item.bonus;
                const {value, attribute, category} = bonus;
                let increment;
                switch (bonus.category) {
                    case "energy":
                        increment = new Energy();
                        (increment as any)[attribute] = value;
                        this.energy.add(increment);
                        break;
                    case "normal":
                    case "special":
                        increment = new Attributes();
                        (increment as any)[attribute] = value;
                        (this as any)[category].add(increment);
                        break;
                }
            })
            .apply(events);

    }
    public getView(): ICharacterAttributesView {
        return this.projection.state;
    }
}
