import {Equipment, EquipmentLevel, EquipmentUpgraded, ItemEquipped, SlotNotEquipped} from "../../src/domain/Equipment";
import {CharacterId, CharacterCreated} from "@fubattle/character";
import {UserId} from "@fubattle/user";
import {createItemSet} from "../../src/domain/ItemSet";
import each from 'jest-each';

describe('Equipment', () => {

    const characterId = new CharacterId("foo");
    const userId = new UserId("bar@baz.com");
    const className = "Fighter";
    const createdEvent = new CharacterCreated(characterId, userId, 'testCharacter', className);
    let equipment: Equipment;
    let eventsRaised: any[];
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

    it('should allow upgrade if all slots are equipped', () => {
        const events: any[] = [createdEvent];
        [0,1,2,3,4,5].forEach((slotNumber) => {
            events.push(new ItemEquipped(characterId, slotNumber));
        });

        equipment = new Equipment(events);
        equipment.upgrade(publishEvent);

        const upgradeEvent = new EquipmentUpgraded(characterId,1);
        expect(eventsRaised).toContainEqual(upgradeEvent);

    })

    it('should throw if not all slots are equipped', () => {
        const events: any[] = [createdEvent];
        [0,1,3,4,5].forEach((slotNumber) => {
            events.push(new ItemEquipped(characterId, slotNumber));
        });

        equipment = new Equipment(events);
        expect(() => equipment.upgrade(publishEvent)).toThrow(new SlotNotEquipped(2));


        const upgradeEvent = new EquipmentUpgraded(characterId,1);
        expect(eventsRaised).not.toContainEqual(upgradeEvent);

    })
})