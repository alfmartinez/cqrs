import {EventPublisher} from "../../../infrastructure/EventPublisher";
import {UserId} from "../../UserId";
import {CharacterCreated, CharacterId} from "../Character";
import {UpdateCharacter} from "../UpdateCharacter";

describe("UpdateCharacter handler", () => {

    let eventPublisher: EventPublisher;
    let handler: UpdateCharacter;

    const characterId = new CharacterId("test");
    const userId = new UserId("testUser");
    const name = "Boo";
    const className = "Cleric";

    beforeEach(() => {
        eventPublisher = new EventPublisher();
        handler = new UpdateCharacter();
        handler.register(eventPublisher);
    });

    it("should record character creation", () => {

        const characterCreated = new CharacterCreated(characterId, userId, name, className);
        eventPublisher.publish(characterCreated);

    });
});
