"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@cqrs-alf/common");
class CharacterId extends common_1.ValueType {
    constructor(id) {
        super();
        this.id = id;
    }
    toString() {
        return "Character: " + this.id;
    }
}
exports.CharacterId = CharacterId;
class ExperienceGained {
    constructor(characterId, amount) {
        this.amount = amount;
        this.characterId = characterId;
    }
    getAggregateId() {
        return this.characterId;
    }
}
exports.ExperienceGained = ExperienceGained;
class LevelGained {
    constructor(characterId) {
        this.characterId = characterId;
    }
    getAggregateId() {
        return this.characterId;
    }
}
exports.LevelGained = LevelGained;
class CharacterCreated {
    constructor(characterId, userId, name, className) {
        this.userId = userId;
        this.name = name;
        this.className = className;
        this.characterId = characterId;
    }
    getAggregateId() {
        return this.characterId;
    }
}
exports.CharacterCreated = CharacterCreated;
class Character {
    constructor(events) {
        this.projection = new common_1.DecisionProjection();
        this.projection
            .register(CharacterCreated, function applyCharacterCreated(event) {
            this.userId = event.userId;
            this.name = event.name;
            this.className = event.className;
            this.id = event.characterId;
            this.level = 1;
            this.exp = 0;
            this.nextLevel = 1000;
        })
            .register(ExperienceGained, function applyExperienceGained(event) {
            this.exp += event.amount;
        })
            .register(LevelGained, function levelGained(event) {
            this.level++;
            this.nextLevel += this.level * 1000;
        })
            .apply(events);
    }
    getView() {
        return this.projection.state;
    }
    gainExperience(publishEvent, amount) {
        const characterId = this.projection.state.id;
        const experienceGained = new ExperienceGained(characterId, amount);
        publishEvent(experienceGained);
        this.projection.apply(experienceGained);
        let levelGained;
        do {
            levelGained = this.checkLevelGained(publishEvent, characterId);
        } while (levelGained);
    }
    checkLevelGained(publishEvent, characterId) {
        if (this.projection.state.exp >= this.projection.state.nextLevel) {
            const levelGained = new LevelGained(characterId);
            this.projection.apply(levelGained);
            publishEvent(levelGained);
            return true;
        }
        return false;
    }
}
exports.Character = Character;
function createCharacter(publishEvent, userId, name, className) {
    const characterId = new CharacterId(common_1.IdGenerator.generate());
    const createdEvent = new CharacterCreated(characterId, userId, name, className);
    publishEvent(createdEvent);
    return characterId;
}
exports.createCharacter = createCharacter;
