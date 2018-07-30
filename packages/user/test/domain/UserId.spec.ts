import {UserEmailCannotBeEmpty, UserId} from "../../src/domain/UserId";

describe("UserId", () => {
    const email = "user@mix-it.fr";

    it("When createCharacter UserId Then toString return id", () => {
        const id = new UserId(email);

        expect(id.toString()).toBe("UserId:" + email);
    });

    it("When createCharacter UserId with empty id Then throw UserEmailCannotBeEmpty exception", () => {
        expect(() => {
            return new UserId("");
        }).toThrow(new UserEmailCannotBeEmpty());
    });

    it("should be same as other UserId with same value", () => {
        const userId = new UserId("foo");
        const other = new UserId("foo");
        expect(userId.equals(other)).toBe(true);
    });

    it("should be different of other UserId with different value", () => {
        const userId = new UserId("foo");
        const other = new UserId("baz");
        expect(userId.equals(other)).toBe(false);
    });
});
