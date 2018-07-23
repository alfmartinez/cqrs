import {DecisionProjection} from "@cqrs-alf/common";
import {CharacterCreated, CharacterId} from "@fubattle/character";
import {createItemSet} from "./ItemSet";

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
    className: string;
    level: number;
    slots: any[];
}

export class ItemEquipped {
    public characterId: CharacterId;
    public slot: number;

    constructor(characterId: CharacterId, slot: number) {
        this.characterId = characterId;
        this.slot = slot;
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
        const evt = new ItemEquipped(this.projection.state.characterId, slotNumber);
        this.projection.apply(evt);
        publishEvent(evt);
    }
}
