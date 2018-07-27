import each from "jest-each";
import {computeMovement} from "../../src/utils/ComputeMovement";

describe("ComputeMovement", () => {
    const sqrt2 = Math.sqrt(2);

    each([
        [{x: 1, y: 0}, 10, {x: 1, y: 0}, {x: 10, y: 0} ],
        [{x: 0, y: 1}, 16, {x: 0, y: 1}, {x: 0, y: 16} ],
        [{x: 1, y: 1}, 9, {x: sqrt2/2, y: sqrt2/2}, {x: 9*sqrt2/2, y: 9*sqrt2/2} ]
    ]).it("should compute from origin", (destination, speed, expectedFacing, expectedMovement) => {
        const source = {x: 0, y: 0};
        const {facing, movement} = computeMovement(source, destination, speed);
        expect(facing.x).toBeCloseTo(expectedFacing.x, 8);
        expect(facing.y).toBeCloseTo(expectedFacing.y, 8);
        expect(movement.x).toBeCloseTo(expectedMovement.x, 8);
        expect(movement.y).toBeCloseTo(expectedMovement.y, 8);
    });

    it("should throw if no destination", () => {
        const source = {x: 1, y: 1};
        const expectedMessage = "Destination not set";
        expect(() => {computeMovement(source, null, 10)}).toThrow(expectedMessage)
    })
})