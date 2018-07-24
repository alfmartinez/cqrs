import {CharacterId, CharacterCreated, LevelGained} from "@fubattle/character";
import {UserId} from "@fubattle/user";
import {CharacterAttributes, Energy} from "../../src/domain/CharacterAttributes";
import {Item,Bonus,ItemEquipped} from "@fubattle/equipment";
import {CharacterClass} from "@fubattle/character";
import {Attributes} from "../../dist/CharacterAttributes";

describe("CharacterAttributes", () => {
    const characterId = new CharacterId("foo");
    const userId = new UserId("bar@baz.com");
    const className = CharacterClass.FIGHTER;
    const createdEvent = new CharacterCreated(characterId, userId, 'testCharacter', className);
    const levelGained = new LevelGained(characterId);
    const itemEquipped = new ItemEquipped(characterId, 0, new Item("knife",new Bonus("normal","attack",1)));
    const itemEnergyEquipped = new ItemEquipped(characterId, 0, new Item("cloak",new Bonus("energy","mana",10)));

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

    it('should upgrade attributes on LevelGained', () => {
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

    it('should upgrade attributes on ItemEquipped', () => {
        const attributes = new CharacterAttributes([createdEvent, itemEquipped, itemEnergyEquipped]);
        const actualView = attributes.getView();
        expect(actualView).toEqual({
            characterId,
            className,
            energy: {
                health: 100,
                mana: 110
            },
            normal: {
                attack: 11,
                defense: 10,
                damage: 10
            },
            special: {
                attack: 10,
                defense: 10,
                damage: 10
            }
        })
    })
})