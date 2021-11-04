import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    reason = 'Error connecting to the database';
    statusCode = 500;
    constructor() {
        super('Error connecting to the database');

        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    serializeErrors() {
        return {
            errors: [{
                message: this.reason,
            }]
        }
    }
}