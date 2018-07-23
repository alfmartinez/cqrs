import {ValueType, DecisionProjection, IdGenerator} from "@cqrs-alf/common";
import {UserId} from "@fubattle/user";

export class CharacterId extends ValueType {
    public id: string;

    constructor(id: string) {
        super();
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
            .register(CharacterCreated, function applyCharacterCreated(this: ICharacterState, event) {
                this.userId = event.userId;
                this.name = event.name;
                this.className = event.className;
                this.id = event.characterId;
                this.level = 1;
                this.exp = 0;
                this.nextLevel = 1000;
            })
            .register(ExperienceGained, function applyExperienceGained(this: ICharacterState, event) {
                this.exp += event.amount;
            })
            .register(LevelGained, function levelGained(this: ICharacterState, event) {
                this.level++;
                this.nextLevel += this.level * 1000;
            })
            .apply(events);
    }

    public gainExperience(publishEvent: (evt: any) => any, amount: number) {
        const characterId = this.projection.state.id;
        const experienceGained = new ExperienceGained(characterId, amount);
        publishEvent(experienceGained);
        this.projection.apply(experienceGained);
        let levelGained;
        do {
            levelGained = this.checkLevelGained(publishEvent, characterId);
        }
        while (levelGained);
    }

    private checkLevelGained(publishEvent: (evt: any) => any, characterId: CharacterId) {
        if (this.projection.state.exp >= this.projection.state.nextLevel) {
            const levelGained = new LevelGained(characterId);
            this.projection.apply(levelGained);
            publishEvent(levelGained);
            return true;
        }
        return false;
    }
}

export function createCharacter(publishEvent: (evt: any) => any, userId: UserId, name: string, className: string) {
    const characterId = new CharacterId(IdGenerator.generate());
    const createdEvent = new CharacterCreated(characterId, userId, name, className);
    publishEvent(createdEvent);
    return characterId;
}
