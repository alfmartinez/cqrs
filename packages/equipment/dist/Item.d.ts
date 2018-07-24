import { ValueType } from "@cqrs-alf/common";
export declare class Item extends ValueType {
    private name;
    constructor(name: string);
    toString(): string;
}
