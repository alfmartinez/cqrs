import {Character, createCharacter} from "../../domain/core/Character";
import {UserId} from "../../domain/UserId";
import {CharacterRepository} from "../../infrastructure/CharacterRepository";
import {EventPublisher} from "../../infrastructure/EventPublisher";
import {EventStore} from "../../infrastructure/EventStore";

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
});
