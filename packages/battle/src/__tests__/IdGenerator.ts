import IdGenerator from "../IdGenerator";

describe("idGenerator", () => {
    it("When generate several id Then return always different id", () => {
        const id1 = IdGenerator.generate();
        const id2 = IdGenerator.generate();

        expect(id1).not.toBe(id2);
    });
});
