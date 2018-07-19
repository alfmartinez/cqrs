export abstract class ValueType {

    public toString(): string;

    public equals(other) {
        if (!other) {
            return false;
        }

        return this.toString() === other.toString();
    }
}
