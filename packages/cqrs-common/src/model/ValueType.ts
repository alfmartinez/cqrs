export abstract class ValueType {

    public equals(other: any) {
        if (!other) {
            return false;
        }

        return this.toString() === other.toString();
    }

    public abstract toString(): string;

}
