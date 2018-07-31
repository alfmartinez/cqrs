import {ValueType} from "@cqrs-alf/common";

export class SessionId extends ValueType {
    public id: string;

    constructor(id: string) {
        super();
        this.id = id;
    }

    public toString(): string {
        return "SessionId:" + this.id;
    }

}
