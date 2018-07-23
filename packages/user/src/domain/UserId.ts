import {ValueType} from "@cqrs-alf/common";

export class UserEmailCannotBeEmpty implements Error {
    name: string = "UserEmailCannotBeEmpty";
    message: string;
    constructor(message: string = 'User email cannot be empty') {
        this.message = message;
    }
}

export class UserId extends ValueType {
    public email: string;

    constructor(email: string) {
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
