import {Character, CharacterState} from "../Character";

describe("Character", () => {
    it("should return blank state if no events given", () => {
        const character = new Character([]);
        expect(character.projection.state).toEqual({});
    });
});
