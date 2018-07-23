import {EventStore} from "../../../cqrs-common/src/EventStore";
import {Character, CharacterCreated, CharacterId, ExperienceGained, LevelGained} from "../../src/domain/core/Character";
import {UserId} from "../../src/domain/UserId";
import {CharacterRepository, UnknownCharacter} from "../../src/infrastructure/CharacterRepository";

describe("CharacterRepository", () => {

    let characterRepository;
    let eventStore;
    const characterId = new CharacterId("zorglub");
    const userId = new UserId("testuser");
    const name = "Zorglub";
    const className = "Mastermind";

    beforeEach(() => {
        eventStore = new EventStore();
        characterRepository = new CharacterRepository(eventStore);
    });

    it("getCharacter throws if Character in unknown", () => {
        expect(() => characterRepository.getCharacter(characterId))
            .toThrow(UnknownCharacter);
    });

    it("getCharacter returns Character if an event exists for character aggregate", () => {
        eventStore.store(new CharacterCreated(characterId, userId, name, className));
        const character = characterRepository.getCharacter(characterId);
        expect(character).toBeInstanceOf(Character);
        const state = character.projection.state;
        expect(state.name).toBe("Zorglub");
        expect(state.className).toBe("Mastermind");
    });

    it("getCharacter returns Character if multiple events exist for character aggregate", () => {
        eventStore.store(new CharacterCreated(characterId, userId, name, className));
        eventStore.store(new ExperienceGained(characterId, 500));
        eventStore.store(new LevelGained(characterId));

        const character = characterRepository.getCharacter(characterId);
        expect(character).toBeInstanceOf(Character);
        const state = character.projection.state;
        expect(state.exp).toBe(500);
        expect(state.level).toBe(2);
    });
});
