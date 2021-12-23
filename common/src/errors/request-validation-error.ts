import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
    public errors: ValidationError[];
    statusCode = 400;
    constructor(errors: ValidationError[]) {
        super('Request validation error');
        this.errors = errors;

        // Only because we are extending a built in class
        // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    
    serializeErrors() {
        const formattedErrors = this.errors.map(error => {
            return { message: error.msg, field: error.param }
        });
        return {
            errors: formattedErrors,
        }
    }
}
