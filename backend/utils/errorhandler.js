class ErrorHandler extends Error{ //inherting from Error js built in class so, we can  create custom error objects with additional properties and behavior.
    constructor(message,statusCode){
    super(message);// passing message to Error class constructor nessasry to initialized object
    this.statusCode = statusCode

    Error.captureStackTrace(this, this.constructor)} //  It captures the current call stack and attaches it to the this object (the current instance of the ErrorHandler class) helps to get more detaiils about error

}
module.exports = ErrorHandler;