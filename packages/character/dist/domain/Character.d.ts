import { ValueType } from "@cqrs-alf/common";
import { UserId } from "@fubattle/user";
export declare class CharacterId extends ValueType {
    id: string;
    constructor(id: string);
    toString(): string;
}
export interface ICharacterState {
    id: CharacterId;
    userId: UserId;
    name: string;
    className: string;
    level: number;
    exp: number;
    nextLevel: number;
}
export declare class ExperienceGained {
    characterId: CharacterId;
    amount: number;
    constructor(characterId: CharacterId, amount: number);
    getAggregateId(): CharacterId;
}
export declare class LevelGained {
    characterId: CharacterId;
    constructor(characterId: CharacterId);
    getAggregateId(): CharacterId;
}
export declare class CharacterCreated {
    characterId: CharacterId;
    userId: UserId;
    name: string;
    className: string;
    constructor(characterId: CharacterId, userId: UserId, name: string, className: string);
    getAggregateId(): CharacterId;
}
export declare class Character {
    private projection;
    constructor(events: any[]);
    gainExperience(publishEvent: (evt: any) => any, amount: number): void;
    private checkLevelGained;
}
export declare function createCharacter(publishEvent: (evt: any) => any, userId: UserId, name: string, className: string): CharacterId;