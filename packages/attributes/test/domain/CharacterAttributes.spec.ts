import {CharacterId, CharacterCreated} from "@fubattle/character";
import {UserId} from "@fubattle/user";
import {CharacterAttributes} from "../../src/domain/CharacterAttributes";

describe("CharacterAttributes", () => {
    const characterId = new CharacterId("foo");
    const userId = new UserId("bar@baz.com");
    const className = "Fighter";
    const createdEvent = new CharacterCreated(characterId, userId, 'testCharacter', className);

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
})