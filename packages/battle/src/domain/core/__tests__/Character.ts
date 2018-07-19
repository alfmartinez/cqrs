import {UserId} from "../../UserId";
import {Character, CharacterCreated, CharacterState} from "../Character";

describe("Character Aggregate", () => {

    const userId = new UserId("mix@test.fr");

    it("should return blank state if no events given", () => {
        const character = new Character([]);
        expect(character.projection.state).toEqual({});
    });

    it("should set userId state if CharacterCreated event given", () => {
        const created = new CharacterCreated(userId);
        const character = new Character([created]);
        expect(character.projection.state.userId).toEqual(userId);
    });

});
