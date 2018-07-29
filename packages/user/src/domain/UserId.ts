import {ValueType} from "@cqrs-alf/common";

export class UserEmailCannotBeEmpty implements Error {
    name: string = "UserEmailCannotBeEmpty";
    message: string;
    constructor() {
        this.message = 'User id cannot be empty';
    }
}

export class UserId extends ValueType {
    public id: string;

    constructor(id: string) {
        super();
        if (!id) {
            throw new UserEmailCannotBeEmpty();
        }
        this.id = id;
    }

    public toString(): string {
        return "UserId:" + this.id;
    }

}
