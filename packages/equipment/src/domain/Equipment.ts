import {DecisionProjection} from "@cqrs-alf/common";
import {CharacterClass, CharacterCreated, CharacterId} from "@fubattle/character";
import {createItemSet} from "./ItemSet";
import {Slot} from "./Slot";

export enum EquipmentLevel {
    WHITE,
    GREEN0,
    GREEN1,
    BLUE0,
    BLUE1,
    BLUE2,
    PURPLE0,
    PURPLE1,
    PURPLE2,
    PURPLE3,
}

interface IEquipment {
    characterId: CharacterId;
    className: CharacterClass;
    level: number;
    slots: any[];
}

export class SlotNotEquipped implements Error {
    public name: string = "SlotNotEquipped";
    public message: string;
    public slot: number;

    constructor(slot: number) {
        this.slot = slot;
        this.message = `Slots ${slot} not equipped`;
    }
}

export class ItemEquipped {
    public characterId: CharacterId;
    public slot: number;

    constructor(characterId: CharacterId, slot: number) {
        this.characterId = characterId;
        this.slot = slot;
    }
}

export class EquipmentUpgraded {
    public characterId: CharacterId;
    public level: EquipmentLevel;

    constructor(characterId: CharacterId, level: EquipmentLevel) {
        this.characterId = characterId;
        this.level = level;
    }
}

export class Equipment {
    private projection = new DecisionProjection<IEquipment>();

    constructor(events: any[] | any) {
        this.projection
            .register(CharacterCreated, function(this: IEquipment, evt: CharacterCreated) {
                this.characterId = evt.characterId;
                this.className = evt.className;
                this.level = EquipmentLevel.WHITE;
                this.slots = createItemSet(EquipmentLevel.WHITE);
            })
            .register(ItemEquipped, function(this: IEquipment, evt: ItemEquipped) {
                this.slots[evt.slot].equipped = true;
            })
            .apply(events);
    }

    public equipItem(publishEvent: (evt: any) => void, slotNumber: number) {
        if (this.projection.state.slots[slotNumber].equipped) {
            return;
        }
        const equipEvent = new ItemEquipped(this.projection.state.characterId, slotNumber);
        this.projection.apply(equipEvent);
        publishEvent(equipEvent);
    }

    public upgrade(publishEvent: (evt: any) => void) {
        const unequippedSlot: Slot = this.projection.state.slots.find((slot: Slot) => !slot.equipped);
        if (unequippedSlot) {
            const {index} = unequippedSlot;
            throw new SlotNotEquipped(index);
        }
        const upgradeEvent = new EquipmentUpgraded(this.projection.state.characterId, this.projection.state.level + 1);
        this.projection.apply(upgradeEvent);
        publishEvent(upgradeEvent);
    }
}
