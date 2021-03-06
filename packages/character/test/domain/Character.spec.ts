import {UserId} from "@fubattle/user";
import {
    Character, CharacterCreated, CharacterId, CharacterOwnedByUser, createCharacter, ExperienceGained,
    LevelGained,
} from "../../src/domain/Character";
import {CharacterClass} from "../../src/domain/CharacterClass";

describe("Character Aggregate", () => {

    const userId = new UserId("mix@test.fr");
    const name = "Elbrow";
    const className = CharacterClass.FIGHTER;
    const id = new CharacterId("toto");
    const level = 1;
    const exp = 0;
    const nextLevel = 1000;

    let eventsRaised: any[];
    const publishEvent = (evt) => {
        eventsRaised.push(evt);
    };

    beforeEach(() => {
        eventsRaised = [];
    });

    it("Given no events, it should left state blank", () => {
        const character = new Character([]);
        const actual = character.getView();
        expect(actual).toEqual({});
    });

    it("Given CharacterCreated, it should initialize CharacterState", () => {
        const created = new CharacterCreated(id, name, className);
        const character = new Character([created]);
        const actual = character.getView();
        expect(actual).toEqual({
            className,
            exp,
            id,
            level,
            name,
            nextLevel
        });
    });

    it("Given ExperienceGained, amount should be added to exp", () => {
        const created = new CharacterCreated(id, name, className);
        const gainedExperience  = new ExperienceGained(id, 1);
        const character = new Character([created, gainedExperience]);
        const actual = character.getView();
        expect(actual).toEqual({
            className,
            exp: 1,
            id,
            level,
            name,
            nextLevel
        });
    });

    it("Given LevelGained, level should be increased", () => {
        const created = new CharacterCreated(id, name, className);
        const gainedExperience  = new ExperienceGained(id, 1001);
        const levelGained = new LevelGained(id);
        const character = new Character([created, gainedExperience, levelGained]);
        const actual = character.getView();
        expect(actual).toEqual({
            className,
            exp: 1001,
            id,
            level: 2,
            name,
            nextLevel: 3000
        });
    });

    it("When gainExperience method is called, Then ExperienceGained should be published", () => {
        const created = new CharacterCreated(id, name, className);
        const gainedExperience  = new ExperienceGained(id, 1);
        const character = new Character([created, gainedExperience]);
        character.gainExperience(publishEvent, 50);
        expect(eventsRaised.length).toBe(1);
        const expectedEvent = new ExperienceGained(id, 50);
        expect(eventsRaised[0]).toEqual(expectedEvent);
    });

    it("When gainExperience method is called with a sufficient amount to advance level,"
        + " Then ExperienceGained should be published and LevelGained", () => {
        const created = new CharacterCreated(id, name, className);
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

    let eventsRaised: any[];
    const publishEvent = (evt) => {
        eventsRaised.push(evt);
    };

    beforeEach(() => {
        eventsRaised = [];
    });

    it("should return characterId and publishes event", () => {
        const actual = createCharacter(publishEvent, userId, name, className);
        expect(actual).toBeInstanceOf(CharacterId);
        expect(eventsRaised.length).toBe(2);

        const createdEvent = eventsRaised[0];
        expect(createdEvent).toBeInstanceOf(CharacterCreated);
        expect(createdEvent.characterId).toBe(actual);
        expect(createdEvent.name).toBe(name);
        expect(createdEvent.className).toBe(className);

        const ownedEvent = eventsRaised[1];
        expect(ownedEvent).toBeInstanceOf(CharacterOwnedByUser);
        expect(ownedEvent.characterId).toBe(actual);
        expect(ownedEvent.userId).toBe(userId);




    });
});
