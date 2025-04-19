export default class CustomError extends Error {
    constructor(status, message) {
        this.status = status;
        super(message);
    } 
}