import {Equipment, EquipmentLevel, ItemEquipped} from "../../src/domain/Equipment";
import {CharacterId, CharacterCreated} from "@fubattle/character";
import {UserId} from "@fubattle/user";
import {Item} from "../../src/domain/Item";
import {createItemSet} from "../../src/domain/ItemSet";
import each from 'jest-each';

describe('Equipment', () => {

    const characterId = new CharacterId("foo");
    const userId = new UserId("bar@baz.com");
    const className = "Fighter";
    const createdEvent = new CharacterCreated(characterId, userId, 'testCharacter', className);
    let equipment: Equipment;
    const eventsRaised: any[];
    const publishEvent = (evt) => {
        eventsRaised.push(evt);
    };

    beforeEach(() => {
        eventsRaised = [];
    })

    it('should be created with character', () => {
        equipment = new Equipment(createdEvent);
        const expectedEquipment = createItemSet(EquipmentLevel.WHITE);
        expect(equipment.projection.state.characterId).toEqual(characterId);
        expect(equipment.projection.state.className).toEqual(className);
        expect(equipment.projection.state.level).toEqual(EquipmentLevel.WHITE);
        expect(equipment.projection.state.slots).toEqual(expectedEquipment);
    });

    each([[0],[1],[2],[3],[4],[5]]).it('should allow equipping of item in slot %d', (slotNumber: number) => {
        equipment = new Equipment(createdEvent);

        equipment.equipItem(publishEvent, slotNumber);
        expect(equipment.projection.state.slots[slotNumber].equipped).toBeTruthy();

        const expectedEvent = new ItemEquipped(characterId, slotNumber);
        expect(eventsRaised).toContainEqual(expectedEvent);
    });

    each([[0],[1],[2],[3],[4],[5]]).it('should not equip if already equipped slot %d', (slotNumber: number) => {
        const itemEquipedEvent = new ItemEquipped(characterId, slotNumber);
        equipment = new Equipment([createdEvent, itemEquipedEvent]);

        equipment.equipItem(publishEvent, slotNumber);
        expect(equipment.projection.state.slots[slotNumber].equipped).toBeTruthy();

        expect(eventsRaised.length).toBe(0);
    });
})