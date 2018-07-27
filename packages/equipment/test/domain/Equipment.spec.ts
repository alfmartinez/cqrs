import {Equipment, EquipmentLevel, EquipmentUpgraded, ItemEquipped, SlotNotEquipped} from "../../src/domain/Equipment";
import {CharacterClass, CharacterCreated, CharacterId} from "@fubattle/character";
import {createItemSet} from "../../src/domain/ItemSet";
import each from 'jest-each';
import {createItem, Item} from "../../src/domain/Item";
import {Bonus} from "../../src/domain/Bonus";

describe('Equipment', () => {

    const characterId = new CharacterId("foo");
    const className = CharacterClass.FIGHTER;
    const createdEvent = new CharacterCreated(characterId, 'testCharacter', className);
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
        const expectedEquipment = createItemSet(EquipmentLevel.WHITE, CharacterClass.FIGHTER);
        const state = equipment.getView();

        expect(state.characterId).toEqual(characterId);
        expect(state.className).toEqual(className);
        expect(state.level).toEqual(EquipmentLevel.WHITE);
        expect(state.slots).toEqual(expectedEquipment);
    });

    each([[0, "helmet"],[1,"knife"],[2,"buckler"],[3,"cloak"],[4,"cloth"],[5,"boots"]]).it('should allow equipping of item in slot %d', (slotNumber: number, itemName: string) => {
        equipment = new Equipment(createdEvent);

        equipment.equipItem(publishEvent, slotNumber);
        const state = equipment.getView();

        expect(state.slots[slotNumber].equipped).toBeTruthy();
        const expectedItem = createItem(slotNumber, className, EquipmentLevel.WHITE);
        const expectedEvent = new ItemEquipped(characterId, slotNumber, expectedItem);
        expect(eventsRaised).toContainEqual(expectedEvent);
    });

    each([[0],[1],[2],[3],[4],[5]]).it('should not equip if already equipped slot %d', (slotNumber: number) => {
        const bonus = new Bonus('normal','defense',1);
        const item = new Item("helmet", bonus);
        const itemEquipedEvent = new ItemEquipped(characterId, slotNumber, item);
        equipment = new Equipment([createdEvent, itemEquipedEvent]);

        equipment.equipItem(publishEvent, slotNumber);
        const state = equipment.getView();
        expect(state.slots[slotNumber].equipped).toBeTruthy();

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
        const state = equipment.getView();
        expect(state.level).toBe(EquipmentLevel.GREEN0);
        [0,1,2,3,4,5].forEach((slotNumber) => {
            expect(state.slots[slotNumber].equipped).toBeFalsy();
        });
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