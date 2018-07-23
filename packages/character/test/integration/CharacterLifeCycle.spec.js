"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@cqrs-alf/common");
var common_2 = require("@cqrs-alf/common");
var Character_1 = require("../../src/domain/core/Character");
var UserId_1 = require("../../../user/src/domain/UserId");
var CharacterRepository_1 = require("../../src/infrastructure/CharacterRepository");
describe("CharacterLifeCycle", function () {
    var eventPublisher = new common_1.EventPublisher();
    var characterRepository;
    var userId = new UserId_1.UserId("lc");
    var publishEvent = eventPublisher.publish;
    var eventStore;
    beforeEach(function () {
        eventStore = new common_2.EventStore();
        characterRepository = new CharacterRepository_1.CharacterRepository(eventStore);
        eventPublisher.onAny(eventStore.store);
    });
    it("Lifecycle", function () {
        var characterId = Character_1.createCharacter(publishEvent, userId, "Zbra", "JungleFist");
        var character = characterRepository.getCharacter(characterId);
        character.gainExperience(publishEvent, 600);
        var character = characterRepository.getCharacter(characterId);
        character.gainExperience(publishEvent, 401);
        var updatedCharacter = characterRepository.getCharacter(characterId);
        var state = updatedCharacter.projection.state;
        expect(state.level).toBe(2);
    });
    it("Lifecycle direct", function () {
        var characterId = Character_1.createCharacter(publishEvent, userId, "Zbra", "JungleFist");
        var character = characterRepository.getCharacter(characterId);
        character.gainExperience(publishEvent, 600);
        character.gainExperience(publishEvent, 401);
        var state = character.projection.state;
        expect(state.level).toBe(2);
    });
    it("Lifecycle direct 2 levels", function () {
        var characterId = Character_1.createCharacter(publishEvent, userId, "Zbra", "JungleFist");
        var character = characterRepository.getCharacter(characterId);
        character.gainExperience(publishEvent, 3001);
        var state = character.projection.state;
        expect(state.level).toBe(3);
    });
});
//# sourceMappingURL=CharacterLifeCycle.spec.js.map