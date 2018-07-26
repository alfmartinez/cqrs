import {DecisionProjection} from "@cqrs-alf/common";
import {CharacterId} from "@fubattle/character";

export interface IPosition {
    readonly x: number;
    readonly y: number;
}

export class PositionInitialized {
    public characterId: CharacterId;
    public position: IPosition;

    constructor(characterId: CharacterId, point: IPosition) {
        this.characterId = characterId;
        this.position = point;
    }
}

export class DestinationSelected {
    public characterId: CharacterId;
    public position: IPosition;

    constructor(characterId: CharacterId, point: IPosition) {
        this.characterId = characterId;
        this.position = point;
    }
}

export interface IMovementState {
    position: IPosition;
    facing: IPosition;
    heading?: IPosition;
    moving: false;
}

export class Movement {

    public projection: DecisionProjection<IMovementState> = new DecisionProjection<IMovementState>();

    constructor(events: any[] | any) {
        this.projection
            .register(PositionInitialized, function(this: IMovementState, event: PositionInitialized) {
                this.position = event.position;
                this.facing = {x: 1, y: 0};
                this.moving = false;
            })
            .register(DestinationSelected, function(this: IMovementState, event: DestinationSelected) {
                this.heading = event.position;
                this.moving = true;
            })
            .apply(events);
    }

    public getView(): IMovementState {
        return this.projection.state;
    }

}
