"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@cqrs-alf/common");
var CharacterId = /** @class */ (function (_super) {
    __extends(CharacterId, _super);
    function CharacterId(id) {
        var _this = _super.call(this) || this;
        _this.id = id;
        return _this;
    }
    CharacterId.prototype.toString = function () {
        return "Character: " + this.id;
    };
    return CharacterId;
}(common_1.ValueType));
exports.CharacterId = CharacterId;
var ExperienceGained = /** @class */ (function () {
    function ExperienceGained(characterId, amount) {
        this.amount = amount;
        this.characterId = characterId;
    }
    ExperienceGained.prototype.getAggregateId = function () {
        return this.characterId;
    };
    return ExperienceGained;
}());
exports.ExperienceGained = ExperienceGained;
var LevelGained = /** @class */ (function () {
    function LevelGained(characterId) {
        this.characterId = characterId;
    }
    LevelGained.prototype.getAggregateId = function () {
        return this.characterId;
    };
    return LevelGained;
}());
exports.LevelGained = LevelGained;
var CharacterCreated = /** @class */ (function () {
    function CharacterCreated(characterId, userId, name, className) {
        this.userId = userId;
        this.name = name;
        this.className = className;
        this.characterId = characterId;
    }
    CharacterCreated.prototype.getAggregateId = function () {
        return this.characterId;
    };
    return CharacterCreated;
}());
exports.CharacterCreated = CharacterCreated;
var Character = /** @class */ (function () {
    function Character(events) {
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
    Character.prototype.gainExperience = function (publishEvent, amount) {
        var characterId = this.projection.state.id;
        var experienceGained = new ExperienceGained(characterId, amount);
        publishEvent(experienceGained);
        this.projection.apply(experienceGained);
        var levelGained;
        do {
            levelGained = this.checkLevelGained(publishEvent, characterId);
        } while (levelGained);
    };
    Character.prototype.checkLevelGained = function (publishEvent, characterId) {
        if (this.projection.state.exp >= this.projection.state.nextLevel) {
            var levelGained = new LevelGained(characterId);
            this.projection.apply(levelGained);
            publishEvent(levelGained);
            return true;
        }
        return false;
    };
    return Character;
}());
exports.Character = Character;
function createCharacter(publishEvent, userId, name, className) {
    var characterId = new CharacterId(common_1.IdGenerator.generate());
    var createdEvent = new CharacterCreated(characterId, userId, name, className);
    publishEvent(createdEvent);
    return characterId;
}
exports.createCharacter = createCharacter;
