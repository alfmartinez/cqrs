"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@cqrs-alf/common");
var Character_1 = require("../../src/domain/core/Character");
var UserId_1 = require("../../../user/src/domain/UserId");
var CharacterRepository_1 = require("../../src/infrastructure/CharacterRepository");
describe("CharacterRepository", function () {
    var characterRepository;
    var eventStore;
    var characterId = new Character_1.CharacterId("zorglub");
    var userId = new UserId_1.UserId("testuser");
    var name = "Zorglub";
    var className = "Mastermind";
    beforeEach(function () {
        eventStore = new common_1.EventStore();
        characterRepository = new CharacterRepository_1.CharacterRepository(eventStore);
    });
    it("getCharacter throws if Character in unknown", function () {
        expect(function () { return characterRepository.getCharacter(characterId); })
            .toThrow(CharacterRepository_1.UnknownCharacter);
    });
    it("getCharacter returns Character if an event exists for character aggregate", function () {
        eventStore.store(new Character_1.CharacterCreated(characterId, userId, name, className));
        var character = characterRepository.getCharacter(characterId);
        expect(character).toBeInstanceOf(Character_1.Character);
        var state = character.projection.state;
        expect(state.name).toBe("Zorglub");
        expect(state.className).toBe("Mastermind");
    });
    it("getCharacter returns Character if multiple events exist for character aggregate", function () {
        eventStore.store(new Character_1.CharacterCreated(characterId, userId, name, className));
        eventStore.store(new Character_1.ExperienceGained(characterId, 500));
        eventStore.store(new Character_1.LevelGained(characterId));
        var character = characterRepository.getCharacter(characterId);
        expect(character).toBeInstanceOf(Character_1.Character);
        var state = character.projection.state;
        expect(state.exp).toBe(500);
        expect(state.level).toBe(2);
    });
});
//# sourceMappingURL=CharacterRepository.spec.js.map