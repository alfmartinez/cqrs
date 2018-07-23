"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserId_1 = require("../../../user/src/domain/UserId");
var Character_1 = require("../../../src/domain/core/Character");
describe("Character Aggregate", function () {
    var userId = new UserId_1.UserId("mix@test.fr");
    var name = "Elbrow";
    var className = "Fighter";
    var id = new Character_1.CharacterId("toto");
    var level = 1;
    var exp = 0;
    var nextLevel = 1000;
    var eventsRaised = [];
    var publishEvent = function (evt) {
        eventsRaised.push(evt);
    };
    beforeEach(function () {
        eventsRaised = [];
    });
    it("Given no events, it should left state blank", function () {
        var character = new Character_1.Character([]);
        expect(character.projection.state).toEqual({});
    });
    it("Given CharacterCreated, it should initialize CharacterState", function () {
        var created = new Character_1.CharacterCreated(id, userId, name, className);
        var character = new Character_1.Character([created]);
        expect(character.projection.state).toEqual({
            className: className,
            exp: exp,
            id: id,
            level: level,
            name: name,
            nextLevel: nextLevel,
            userId: userId,
        });
    });
    it("Given ExperienceGained, amount should be added to exp", function () {
        var created = new Character_1.CharacterCreated(id, userId, name, className);
        var gainedExperience = new Character_1.ExperienceGained(id, 1);
        var character = new Character_1.Character([created, gainedExperience]);
        expect(character.projection.state).toEqual({
            className: className,
            exp: 1,
            id: id,
            level: level,
            name: name,
            nextLevel: nextLevel,
            userId: userId,
        });
    });
    it("Given LevelGained, level should be increased", function () {
        var created = new Character_1.CharacterCreated(id, userId, name, className);
        var gainedExperience = new Character_1.ExperienceGained(id, 1001);
        var levelGained = new Character_1.LevelGained(id);
        var character = new Character_1.Character([created, gainedExperience, levelGained]);
        expect(character.projection.state).toEqual({
            className: className,
            exp: 1001,
            id: id,
            level: 2,
            name: name,
            nextLevel: 3000,
            userId: userId,
        });
    });
    it("When gainExperience method is called, Then ExperienceGained should be published", function () {
        var created = new Character_1.CharacterCreated(id, userId, name, className);
        var gainedExperience = new Character_1.ExperienceGained(id, 1);
        var character = new Character_1.Character([created, gainedExperience]);
        character.gainExperience(publishEvent, 50);
        expect(eventsRaised.length).toBe(1);
        var expectedEvent = new Character_1.ExperienceGained(id, 50);
        expect(eventsRaised[0]).toEqual(expectedEvent);
    });
    it("When gainExperience method is called with a sufficient amount to advance level,"
        + " Then ExperienceGained should be published and LevelGained", function () {
        var created = new Character_1.CharacterCreated(id, userId, name, className);
        var gainedExperience = new Character_1.ExperienceGained(id, 990);
        var character = new Character_1.Character([created, gainedExperience]);
        character.gainExperience(publishEvent, 50);
        expect(eventsRaised.length).toBe(2);
        var expectedXpEvent = new Character_1.ExperienceGained(id, 50);
        expect(eventsRaised[0]).toEqual(expectedXpEvent);
        var expectedLevelEvent = new Character_1.LevelGained(id);
        expect(eventsRaised[1]).toEqual(expectedLevelEvent);
    });
});
describe("Character factory", function () {
    var userId = new UserId_1.UserId("mix@test.fr");
    var name = "Elbrow";
    var className = "Fighter";
    var eventsRaised = [];
    var publishEvent = function (evt) {
        eventsRaised.push(evt);
    };
    beforeEach(function () {
        eventsRaised = [];
    });
    it("should return characterId and publishes event", function () {
        var actual = Character_1.createCharacter(publishEvent, userId, name, className);
        expect(actual).toBeInstanceOf(Character_1.CharacterId);
        expect(eventsRaised.length).toBe(1);
        var event = eventsRaised[0];
        expect(event.characterId).toBeDefined();
        expect(event.name).toBe(name);
        expect(event.className).toBe(className);
        expect(event.userId).toBe(userId);
    });
});
//# sourceMappingURL=Character.spec.js.map