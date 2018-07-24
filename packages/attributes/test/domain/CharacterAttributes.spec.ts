import {CharacterId, CharacterCreated, LevelGained} from "@fubattle/character";
import {UserId} from "@fubattle/user";
import {CharacterAttributes} from "../../src/domain/CharacterAttributes";

describe("CharacterAttributes", () => {
    const characterId = new CharacterId("foo");
    const userId = new UserId("bar@baz.com");
    const className = "Fighter";
    const createdEvent = new CharacterCreated(characterId, userId, 'testCharacter', className);
    const levelGained = new LevelGained(characterId);

    it('should return minimal attributes on CharacterCreated', () => {
        const attributes = new CharacterAttributes([createdEvent]);
        const actualView = attributes.getView();
        expect(actualView).toEqual({
            characterId,
            className,
            energy: {
                health: 100,
                mana: 100
            },
            normal: {
                attack: 10,
                defense: 10,
                damage: 10
            },
            special: {
                attack: 10,
                defense: 10,
                damage: 10
            }
        })
    });

    it('should return upgrade attributes on LevelGained', () => {
        const attributes = new CharacterAttributes([createdEvent, levelGained]);
        const actualView = attributes.getView();
        expect(actualView).toEqual({
            characterId,
            className,
            energy: {
                health: 110,
                mana: 105
            },
            normal: {
                attack: 12,
                defense: 11,
                damage: 12
            },
            special: {
                attack: 11,
                defense: 11,
                damage: 11
            }
        })
    });
})