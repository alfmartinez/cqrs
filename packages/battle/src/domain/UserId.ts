import {ValueType} from "../ValueType";

export class UserEmailCannotBeEmpty implements Error {}

export class UserId extends ValueType {
    public email: string;

    constructor(email) {
        if (!email) {
            throw new UserEmailCannotBeEmpty();
        }
        this.email = email;
    }

    public toString(): string {
        return "UserId:" + this.email;
    }

}
