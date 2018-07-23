import {EventPublisher} from "@cqrs/common";
import {EventStore} from "@cqrs/common";
import {Character, createCharacter} from "../../src/domain/core/Character";
import {UserId} from "../../src/domain/UserId";
import {CharacterRepository} from "../../src/infrastructure/CharacterRepository";

describe("CharacterLifeCycle", () => {

    const eventPublisher: EventPublisher = new EventPublisher();
    const characterRepository: CharacterRepository;
    const userId = new UserId("lc");
    const publishEvent = eventPublisher.publish;
    const eventStore: EventStore;

    beforeEach(() => {
        eventStore = new EventStore();
        characterRepository = new CharacterRepository(eventStore);
        eventPublisher.onAny(eventStore.store);
    });

    it("Lifecycle", () => {
        const characterId = createCharacter(publishEvent, userId, "Zbra", "JungleFist");
        let character: Character = characterRepository.getCharacter(characterId);
        character.gainExperience(publishEvent, 600);
        const character = characterRepository.getCharacter(characterId);
        character.gainExperience(publishEvent, 401);

        const updatedCharacter = characterRepository.getCharacter(characterId);
        const {state} = updatedCharacter.projection;

        expect(state.level).toBe(2);
    });

    it("Lifecycle direct", () => {
        const characterId = createCharacter(publishEvent, userId, "Zbra", "JungleFist");
        const character: Character = characterRepository.getCharacter(characterId);
        character.gainExperience(publishEvent, 600);
        character.gainExperience(publishEvent, 401);

        const {state} = character.projection;

        expect(state.level).toBe(2);
    });

    it("Lifecycle direct 2 levels", () => {
        const characterId = createCharacter(publishEvent, userId, "Zbra", "JungleFist");
        const character: Character = characterRepository.getCharacter(characterId);
        character.gainExperience(publishEvent, 3001);

        const {state} = character.projection;

        expect(state.level).toBe(3);
    });
});
