class ErrorHandler extends Error{ //inherting from Error js built in class so, we can  create custom error objects with additional properties and behavior.
    constructor(message,statusCode){
    super(message);
    this.statusCode = statusCode

    Error.captureStackTrace(this, this.constructor)}

}
module.exports = ErrorHandler;