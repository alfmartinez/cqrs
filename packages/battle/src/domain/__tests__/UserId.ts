import {UserEmailCannotBeEmpty, UserId} from "../UserId";

describe("UserId", () => {
    const email = "user@mix-it.fr";

    it("When create UserId Then toString return email", () => {
        const id = new UserId(email);

        expect(id.toString()).toBe(("UserId:" + email));
    });

    it("When create UserId with empty email Then throw UserEmailCannotBeEmpty exception", () => {
        expect(() => {
            return new UserId("");
        }).toThrow(UserEmailCannotBeEmpty);
    });
});
