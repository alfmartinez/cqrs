import {DecisionProjection} from "@cqrs-alf/common";
import {CharacterId} from "@fubattle/character";

export interface IPosition {
    readonly x: number;
    readonly y: number;
}

export class PositionInitialized {
    public characterId: CharacterId;
    public position: IPosition;
    public speed: number;

    constructor(characterId: CharacterId, point: IPosition, speed: number) {
        this.characterId = characterId;
        this.position = point;
        this.speed = speed;
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

export class MovementStarted {
    public characterId: CharacterId;

    constructor(characterId: CharacterId) {
        this.characterId = characterId;
    }
}

export interface IMovementState {
    position: IPosition;
    facing: IPosition;
    speed: number;
    heading?: IPosition;
    moving: boolean;
    movement?: IPosition;
}

export class Movement {

    public projection: DecisionProjection<IMovementState> = new DecisionProjection<IMovementState>();

    constructor(events: any[] | any) {
        this.projection
            .register(PositionInitialized, function(this: IMovementState, event: PositionInitialized) {
                this.position = event.position;
                this.facing = {x: 1, y: 0};
                this.speed = event.speed;
                this.moving = false;
            })
            .register(DestinationSelected, function(this: IMovementState, event: DestinationSelected) {
                this.heading = event.position;
                this.moving = true;
            })
            .register(MovementStarted, function(this: IMovementState, event: MovementStarted) {
                this.movement = {x: 10, y: 0};
            })
            .apply(events);
    }

    public getView(): IMovementState {
        return this.projection.state;
    }

}
