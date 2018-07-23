import {UserEmailCannotBeEmpty, UserId} from "../../src/domain/UserId";

describe("UserId", () => {
    const email = "user@mix-it.fr";

    it("When createCharacter UserId Then toString return email", () => {
        const id = new UserId(email);

        expect(id.toString()).toBe(("UserId:" + email));
    });

    it("When createCharacter UserId with empty email Then throw UserEmailCannotBeEmpty exception", () => {
        expect(() => {
            return new UserId("");
        }).toThrow(UserEmailCannotBeEmpty);
    });
});
