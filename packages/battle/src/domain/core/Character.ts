import {DecisionProjection} from "../DecisionProjection";
import {UserId} from "../UserId";

export class CharacterCreated {
    public userId: UserId;
}

export class Character {
    private projection = new DecisionProjection<CharacterState>();

    constructor(events: any[]) {
        this.projection
            .register(CharacterCreated, function createCharacter(event) {
                this.userId = event.userId;
            })
            .apply(events);
    }
}
