import {DecisionProjection, IAggregable} from "@cqrs-alf/common";
import {CharacterClass, CharacterCreated, CharacterId} from "@fubattle/character";
import {Item} from "./Item";
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

export class ItemEquipped implements IAggregable {
    public characterId: CharacterId;
    public slot: number;
    public item: Item;

    constructor(characterId: CharacterId, slot: number, item: Item) {
        this.characterId = characterId;
        this.slot = slot;
        this.item = item;
    }

    public getAggregateId(): any {
        return this.characterId;
    }
}

export class EquipmentUpgraded implements IAggregable {
    public characterId: CharacterId;
    public level: EquipmentLevel;

    constructor(characterId: CharacterId, level: EquipmentLevel) {
        this.characterId = characterId;
        this.level = level;
    }

    public getAggregateId(): any {
        return this.characterId;
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
                this.slots = createItemSet(EquipmentLevel.WHITE, evt.className);
            })
            .register(ItemEquipped, function(this: IEquipment, evt: ItemEquipped) {
                this.slots[evt.slot].equipped = true;
            })
            .register(EquipmentUpgraded, function(this: IEquipment, evt: EquipmentUpgraded) {
                this.level = evt.level;
                this.slots = createItemSet(evt.level, this.className);
            })
            .apply(events);
    }

    public getView() {
        return this.projection.state;
    }

    public equipItem(publishEvent: (evt: any) => void, slotNumber: number) {
        if (this.projection.state.slots[slotNumber].equipped) {
            return;
        }
        const {item} = this.projection.state.slots[slotNumber];
        const equipEvent = new ItemEquipped(this.projection.state.characterId, slotNumber, item);
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
