import {EventStore} from "@cqrs-alf/common";
import {CharacterCreated, CharacterId, CharacterClass} from "@fubattle/character";
import {UserId} from "@fubattle/user";
import {EquipmentRepository, UnknownCharacter} from "../../src/infrastructure/EquipmentRepository";
import {Equipment, ItemEquipped} from "../../src/domain/Equipment";

describe("EquipmentRepository", () => {

    let equipmentRepository;
    let eventStore;
    const characterId = new CharacterId("zorglub");
    const userId = new UserId("testuser");
    const name = "Zorglub";
    const className = CharacterClass.FIGHTER;

    beforeEach(() => {
        eventStore = new EventStore();
        equipmentRepository = new EquipmentRepository(eventStore);
    });

    it("getEquipment throws if Character is unknown", () => {
        expect(() => equipmentRepository.getEquipment(characterId))
            .toThrow(UnknownCharacter);
    });

    it("getEquipment returns Equipment if an event exists for equipment aggregate", () => {
        eventStore.store(new CharacterCreated(characterId, userId, name, className));
        const equipment = equipmentRepository.getEquipment(characterId);
        expect(equipment).toBeInstanceOf(Equipment);
        const state = equipment.getView();
        expect(state.className).toBe(CharacterClass.FIGHTER);

        expect(state.slots[0].equipped).toBe(false);
        expect(state.slots[1].equipped).toBe(false);
        expect(state.slots[2].equipped).toBe(false);
        expect(state.slots[3].equipped).toBe(false);
        expect(state.slots[4].equipped).toBe(false);
        expect(state.slots[5].equipped).toBe(false);
    });

    it("getEquipment returns Character if multiple events exist for equipment aggregate", () => {
        eventStore.store(new CharacterCreated(characterId, userId, name, className));
        eventStore.store(new ItemEquipped(characterId, 0));

        const equipment = equipmentRepository.getEquipment(characterId);
        expect(equipment).toBeInstanceOf(Equipment);
        const state = equipment.getView();
        expect(state.slots[0].equipped).toBe(true);
        expect(state.slots[1].equipped).toBe(false);
    });
});