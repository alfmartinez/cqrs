import { ValueType } from "@cqrs-alf/common";
export declare class UserEmailCannotBeEmpty implements Error {
    name: string;
    message: string;
    constructor();
}
export declare class UserId extends ValueType {
    email: string;
    constructor(email: string);
    toString(): string;
}
