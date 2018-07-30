import {SessionId} from "../../src/domain/SessionId";

describe("SessionId", () => {
    it("should convert to string", () => {
        const sessionId = new SessionId("foo");
        expect(sessionId.toString()).toBe("SessionId:foo");
    })
})