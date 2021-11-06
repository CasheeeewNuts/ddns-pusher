export class InvalidRequestError extends Error {
    constructor(msg: string) {
        super(msg);
    }

    toString() {
        return `InvalidRequestError: ${this.message}`
    }
}