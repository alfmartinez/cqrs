import IdGenerator from "../../IdGenerator";
import {ValueType} from "../../ValueType";
import {DecisionProjection} from "../DecisionProjection";
import {UserId} from "../UserId";

export class CharacterId extends ValueType {
    public id: string;

    constructor(id: string) {
        this.id = id;
    }

    public toString() {
        return "Character: " + this.id;
    }
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

export class ExperienceGained {
    public characterId: CharacterId;
    public amount: number;

    constructor(characterId: CharacterId, amount: number) {
        this.amount = amount;
        this.characterId = characterId;
    }

    public getAggregateId() {
        return this.characterId;
    }
}

export class LevelGained {
    public characterId: CharacterId;

    constructor(characterId: CharacterId) {
        this.characterId = characterId;
    }

    public getAggregateId() {
        return this.characterId;
    }
}

export class CharacterCreated {
    public characterId: CharacterId;
    public userId: UserId;
    public name: string;
    public className: string;

    constructor(characterId: CharacterId, userId: UserId, name: string, className: string) {
        this.userId = userId;
        this.name = name;
        this.className = className;
        this.characterId = characterId;
    }

    public getAggregateId() {
        return this.characterId;
    }
}

export class Character {
    private projection = new DecisionProjection<ICharacterState>();

    constructor(events: any[]) {
        this.projection
            .register(CharacterCreated, function createCharacter(event) {
                this.userId = event.userId;
                this.name = event.name;
                this.className = event.className;
                this.id = event.characterId;
                this.level = 1;
                this.exp = 0;
                this.nextLevel = 1000;
            })
            .register(ExperienceGained, function experienceGained(event) {
                this.exp += event.amount;
            })
            .register(LevelGained, function levelGained(event) {
                this.level++;
                this.nextLevel += this.level * 1000;
            })
            .apply(events);
    }

    public gainExperience(publishEvent: (evt) => any, amount: number) {
        const characterId = this.projection.state.id;
        publishEvent(new ExperienceGained(characterId, amount));
        if (this.projection.state.exp + amount >= this.projection.state.nextLevel) {
            publishEvent(new LevelGained(characterId));
        }
    }
}

export function create(publishEvent, userId, name, className) {
    const characterId = new CharacterId(IdGenerator.generate());
    const createdEvent = new CharacterCreated(characterId, userId, name, className);
    publishEvent(createdEvent);
    return characterId;
}
