import {CharacterId} from "@fubattle/character";
import {DestinationSelected, Movement, PositionInitialized} from "../../src/domain/Movement";

describe("Movement", () => {

    const characterId = new CharacterId("foo");
    const position = {x: 100, y: 200};
    const speed = 10;
    const destination = {x: 150, y: 200};
    const initializeEvent = new PositionInitialized(characterId, position, speed);
    const destinationEvent = new DestinationSelected(characterId, destination);

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

    it("should start to move DestinationSelected", () => {
        const movement = new Movement([initializeEvent, destinationEvent]);
        const state = movement.getView();

        const expectedFacing = {x: 1, y: 0};
        expect(state.position).toEqual(position);
        expect(state.facing).toEqual(expectedFacing);
        expect(state.moving).toBe(true);
        expect(state.heading).toBe(destination);
    });
})