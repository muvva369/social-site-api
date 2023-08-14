// defining a custom error class
class CustomError {
    constructor(errorStack) {
        this.statusCode = errorStack.statusCode;
        this.message = errorStack.message;
        this.path = errorStack.path
        this.method = errorStack.method
        this.stack = errorStack.stack
    }

    static badRequest(msg) {
        return new CustomError(400, msg);
    }

    static unknownUser(errorStack) {
        return new CustomError(errorStack);
    }

    static unknownPath(errorStack) {
        return new CustomError(errorStack);
    }

    static internal(errorStack) {
        return new CustomError(errorStack);
    }
}

module.exports = CustomError;
