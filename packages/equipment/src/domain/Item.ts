import {ValueType} from "@cqrs-alf/common";

export class Item extends ValueType {
    private name: string;
    constructor(name: string) {
        super();
        this.name = name;
    }

    public toString(): string {
        return "Item: " + this.name;
    }
}
