import {UserId} from "../../UserId";
import {Character, CharacterCreated, CharacterId, ICharacterState} from "../Character";

describe("Character Aggregate", () => {

    const userId = new UserId("mix@test.fr");
    const name = "Elbrow";
    const className = "Fighter";
    const id = new CharacterId("toto");

    it("should return blank state if no events given", () => {
        const character = new Character([]);
        expect(character.projection.state).toEqual({});
    });

    it("should set userId state if CharacterCreated event given", () => {
        const created = new CharacterCreated(id, userId, name, className);
        const character = new Character([created]);
        expect(character.projection.state).toEqual({
            className,
            id,
            name,
            userId,
        });
    });

});
