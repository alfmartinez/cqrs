import Victor = require("victor");
import {IPosition} from "../domain/Movement";

export function computeMovement(source: IPosition, destination: IPosition | undefined, speed: number): any {
    if (destination == null) {
        throw new Error("Destination not set");
    }
    const vSource = Victor.fromObject(source);
    const vDest = Victor.fromObject(destination);
    const vDiff = vDest.subtract(vSource);
    const facing = vDiff.normalize().toObject();
    const movement = vDiff.multiplyScalar(speed).toObject();

    return {facing, movement};
}
