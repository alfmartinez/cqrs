import {Equipment, EquipmentLevel} from "../../src/domain/Equipment";
import {CharacterId, CharacterCreated} from "@fubattle/character";
import {UserId} from "@fubattle/user";

describe('Equipment', () => {

    const characterId = new CharacterId("foo");
    const userId = new UserId("bar@baz.com");
    const className = "Fighter";
    const createdEvent = new CharacterCreated(characterId, userId, 'testCharacter', className);

    it('should publish creation event', () => {
        const equipment = new Equipment(createdEvent);
        expect(equipment.projection.state.characterId).toEqual(characterId);
        expect(equipment.projection.state.className).toEqual(className);
        expect(equipment.projection.state.level).toEqual(EquipmentLevel.WHITE);
    })
})