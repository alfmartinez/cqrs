import {CharacterId} from "@fubattle/character";
import {Movement, PositionInitialized} from "../../src/domain/Movement";

describe("Movement", () => {

    const characterId = new CharacterId("foo");

    it("should initialize on PositionInitialized", () => {
        const position = {x: 100, y: 200};
        const initializeEvent = new PositionInitialized(characterId, position);
        const movement = new Movement([initializeEvent]);
        const state = movement.getView();

        const expectedFacing = {x: 1, y: 0};
        expect(state.position).toEqual(position);
        expect(state.facing).toEqual(expectedFacing);
        expect(state.moving).toBe(false);

    })
})