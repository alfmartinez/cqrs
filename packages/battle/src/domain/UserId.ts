import {ValueType} from "@cqrs/common";

export class UserEmailCannotBeEmpty implements Error {}

export class UserId extends ValueType {
    public email: string;

    constructor(email) {
        super();
        if (!email) {
            throw new UserEmailCannotBeEmpty();
        }
        this.email = email;
    }

    public toString(): string {
        return "UserId:" + this.email;
    }

}
