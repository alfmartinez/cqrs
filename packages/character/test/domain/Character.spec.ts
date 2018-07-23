import {UserId} from "@fubattle/user";
import {
    Character, CharacterCreated, CharacterId, createCharacter, ExperienceGained,
    LevelGained,
} from "../../src/domain/Character";

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

    it("Given ExperienceGained, amount should be added to exp", () => {
        const created = new CharacterCreated(id, userId, name, className);
        const gainedExperience  = new ExperienceGained(id, 1);
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

    it("Given LevelGained, level should be increased", () => {
        const created = new CharacterCreated(id, userId, name, className);
        const gainedExperience  = new ExperienceGained(id, 1001);
        const levelGained = new LevelGained(id);
        const character = new Character([created, gainedExperience, levelGained]);
        expect(character.projection.state).toEqual({
            className,
            exp: 1001,
            id,
            level: 2,
            name,
            nextLevel: 3000,
            userId,
        });
    });

    it("When gainExperience method is called, Then ExperienceGained should be published", () => {
        const created = new CharacterCreated(id, userId, name, className);
        const gainedExperience  = new ExperienceGained(id, 1);
        const character = new Character([created, gainedExperience]);
        character.gainExperience(publishEvent, 50);
        expect(eventsRaised.length).toBe(1);
        const expectedEvent = new ExperienceGained(id, 50);
        expect(eventsRaised[0]).toEqual(expectedEvent);
    });

    it("When gainExperience method is called with a sufficient amount to advance level,"
        + " Then ExperienceGained should be published and LevelGained", () => {
        const created = new CharacterCreated(id, userId, name, className);
        const gainedExperience  = new ExperienceGained(id, 990);
        const character = new Character([created, gainedExperience]);
        character.gainExperience(publishEvent, 50);
        expect(eventsRaised.length).toBe(2);
        const expectedXpEvent = new ExperienceGained(id, 50);
        expect(eventsRaised[0]).toEqual(expectedXpEvent);
        const expectedLevelEvent = new LevelGained(id);
        expect(eventsRaised[1]).toEqual(expectedLevelEvent);
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
        const actual = createCharacter(publishEvent, userId, name, className);
        expect(actual).toBeInstanceOf(CharacterId);
        expect(eventsRaised.length).toBe(1);
        const event = eventsRaised[0];
        expect(event.characterId).toBeDefined();
        expect(event.name).toBe(name);
        expect(event.className).toBe(className);
        expect(event.userId).toBe(userId);

    });
});
