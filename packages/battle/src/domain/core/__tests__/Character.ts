import {UserId} from "../../UserId";
import {Character, CharacterCreated, CharacterId, create, ExperienceGained, ICharacterState} from "../Character";

describe("Character Aggregate", () => {

    const userId = new UserId("mix@test.fr");
    const name = "Elbrow";
    const className = "Fighter";
    const id = new CharacterId("toto");
    const level = 1;
    const exp = 0;
    const nextLevel = 1000;

    const eventsRaised = [];
    const publishEvent = (evt) => {
        eventsRaised.push(evt);
    };

    beforeEach(() => {
        eventsRaised = [];
    });

    it("Given no events, it should left state blank", () => {
        const character = new Character([]);
        expect(character.projection.state).toEqual({});
    });

    it("Given CharacterCreated, it should initialize CharacterState", () => {
        const created = new CharacterCreated(id, userId, name, className);
        const character = new Character([created]);
        expect(character.projection.state).toEqual({
            className,
            exp,
            id,
            level,
            name,
            nextLevel,
            userId,
        });
    });

    it("should gain experience", () => {
        const created = new CharacterCreated(id, userId, name, className);
        const gainedExperience  = new ExperienceGained(1);
        const character = new Character([created, gainedExperience]);
        expect(character.projection.state).toEqual({
            className,
            exp: 1,
            id,
            level,
            name,
            nextLevel,
            userId,
        });
    });

});

describe("Character factory", () => {

    const userId = new UserId("mix@test.fr");
    const name = "Elbrow";
    const className = "Fighter";

    const eventsRaised = [];
    const publishEvent = (evt) => {
        eventsRaised.push(evt);
    };

    beforeEach(() => {
        eventsRaised = [];
    });

    it("should return characterId and publishes event", () => {
        const actual = create(publishEvent, userId, name, className);
        expect(actual).toBeInstanceOf(CharacterId);
        expect(eventsRaised.length).toBe(1);
        const event = eventsRaised[0];
        expect(event.characterId).toBeDefined();
        expect(event.name).toBe(name);
        expect(event.className).toBe(className);
        expect(event.userId).toBe(userId);

    });
});
