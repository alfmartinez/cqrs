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
            })
            .apply(events);
    }
}
