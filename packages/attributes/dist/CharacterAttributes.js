"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@cqrs-alf/common");
const character_1 = require("@fubattle/character");
const equipment_1 = require("@fubattle/equipment");
class Energy {
    constructor(health = 0, mana = 0) {
        this.health = health;
        this.mana = mana;
    }
    add(increment) {
        this.health += increment.health;
        this.mana += increment.mana;
    }
}
exports.Energy = Energy;
class Attributes {
    constructor(attack = 0, defense = 0, damage = 0) {
        this.attack = attack;
        this.defense = defense;
        this.damage = damage;
    }
    add(increment) {
        this.attack += increment.attack;
        this.defense += increment.defense;
        this.damage += increment.damage;
    }
}
exports.Attributes = Attributes;
class CharacterAttributes {
    constructor(events) {
        this.projection = new common_1.DecisionProjection();
        this.projection
            .register(character_1.CharacterCreated, function (evt) {
            this.characterId = evt.characterId;
            this.className = evt.className;
            this.energy = new Energy(100, 100);
            this.normal = new Attributes(10, 10, 10);
            this.special = new Attributes(10, 10, 10);
        })
            .register(character_1.LevelGained, function (evt) {
            this.energy.add(new Energy(10, 5));
            this.normal.add(new Attributes(2, 1, 2));
            this.special.add(new Attributes(1, 1, 1));
        })
            .register(equipment_1.ItemEquipped, function (evt) {
            const bonus = evt.item.bonus;
            const { value, attribute, category } = bonus;
            let increment;
            switch (bonus.category) {
                case "energy":
                    increment = new Energy();
                    increment[attribute] = value;
                    this.energy.add(increment);
                    break;
                case "normal":
                case "special":
                    increment = new Attributes();
                    increment[attribute] = value;
                    this[category].add(increment);
                    break;
            }
        })
            .apply(events);
    }
    getView() {
        return this.projection.state;
    }
}
exports.CharacterAttributes = CharacterAttributes;
