import {ValueType} from "./ValueType";

class Foo extends ValueType {
    private value: string;

    constructor(value: string) {
        super();
        this.value = value;
    }

    toString(): string {
        return "Foo: "+this.value;
    }
}

describe("ValueType", () => {
    it("should tell two instances are equal", () => {
        const valueA = new Foo("A");
        const otherValueA = new Foo("A");

        expect(valueA.equals(otherValueA)).toBeTruthy();
    });


    it("should tell two instances are not equal", () => {
        const valueA = new Foo("A");
        const valueB = new Foo("B");

        expect(valueA.equals(valueB)).toBeFalsy();
    })
})