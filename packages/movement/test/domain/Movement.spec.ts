import {CharacterId} from "@fubattle/character";
import {DestinationSelected, Movement, MovementStarted, PositionInitialized} from "../../src/domain/Movement";
import each from "jest-each";

describe("Movement", () => {

    const characterId = new CharacterId("foo");
    const position = {x: 100, y: 200};
    const speed = 10;
    const destination = {x: 150, y: 200};
    const initializeEvent = new PositionInitialized(characterId, position, speed);
    const destinationEvent = new DestinationSelected(characterId, destination);
    const movementStartedEvent = new MovementStarted(characterId);

    it("should initialize on PositionInitialized", () => {
        const movement = new Movement([initializeEvent]);
        const state = movement.getView();

        const expectedFacing = {x: 1, y: 0};
        expect(state.position).toEqual(position);
        expect(state.facing).toEqual(expectedFacing);
        expect(state.moving).toBe(false);
        expect(state.heading).not.toBeDefined();
        expect(state.speed).toBe(10);
    });

    it("should define destination to move to on DestinationSelected", () => {
        const movement = new Movement([initializeEvent, destinationEvent]);
        const state = movement.getView();

        const expectedFacing = {x: 1, y: 0};
        expect(state.position).toEqual(position);
        expect(state.facing).toEqual(expectedFacing);
        expect(state.moving).toBe(true);
        expect(state.heading).toBe(destination);
    });

    each([
        [ {x: 150, y: 200},{x: 1, y: 0},{x: 10, y: 0} ],
        [ {x: 100, y: 300},{x: 0, y: 1},{x: 0, y: 10} ],
    ]).it("should change facing and movement on MovementStarted", (destination, expectedFacing, expectedMovement) => {
        const destinationEvent = new DestinationSelected(characterId, destination);

        const movement = new Movement([initializeEvent, destinationEvent, movementStartedEvent]);
        const state = movement.getView();

        expect(state.position).toEqual(position);
        expect(state.facing).toEqual(expectedFacing);
        expect(state.moving).toBe(true);
        expect(state.heading).toBe(destination);
        expect(state.movement).toEqual(expectedMovement);
    })
})