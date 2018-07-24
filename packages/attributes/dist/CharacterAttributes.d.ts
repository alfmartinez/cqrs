import { CharacterClass, CharacterId } from "@fubattle/character";
export declare class Energy {
    health: number;
    mana: number;
    add(increment: Energy): void;
}
export declare class Attributes {
    attack: number;
    defense: number;
    damage: number;
    add(increment: Attributes): void;
}
export interface ICharacterAttributesView {
    characterId: CharacterId;
    className: CharacterClass;
    energy: Energy;
    normal: Attributes;
    special: Attributes;
}
export declare class CharacterAttributes {
    private projection;
    constructor(events: any[]);
    getView(): ICharacterAttributesView;
}
