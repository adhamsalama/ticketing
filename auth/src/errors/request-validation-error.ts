import { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
    public errors: ValidationError[];
    constructor(errors: ValidationError[]) {
        super();
        this.errors = errors;

        // Only because we are extending a built in class
        // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
}
