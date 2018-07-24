export abstract class ValueType {

    constructor(){}

    public equals(other: any) {
        if (!other) {
            return false;
        }

        return this.toString() === other.toString();
    }

    public abstract toString(): string;

}
