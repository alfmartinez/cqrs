"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@cqrs-alf/common");
const character_1 = require("@fubattle/character");
class Energy {
    constructor() {
        this.health = 100;
        this.mana = 100;
    }
    add(increment) {
        this.health += increment.health;
        this.mana += increment.mana;
    }
}
exports.Energy = Energy;
class Attributes {
    constructor() {
        this.attack = 10;
        this.defense = 10;
        this.damage = 10;
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
            this.energy = new Energy();
            this.normal = new Attributes();
            this.special = new Attributes();
        })
            .register(character_1.LevelGained, function (evt) {
            this.energy.add({
                health: 10,
                mana: 5
            });
            this.normal.add({
                attack: 2,
                defense: 1,
                damage: 2
            });
            this.special.add({
                attack: 1,
                defense: 1,
                damage: 1
            });
        })
            .apply(events);
    }
    getView() {
        return this.projection.state;
    }
}
exports.CharacterAttributes = CharacterAttributes;
