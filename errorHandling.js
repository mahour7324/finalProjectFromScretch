// 1.handling Uncought Error------------------------------------------------------------------------------------------------------------------|
process.on("uncaughtException",(err)=>{
    console.log(`Error ${err.message}`)
    console.log("Shuting down the Server due to uncoughtException")
    process.exit(1);
 })
 //used when a any undefined variable is creating problem and suddenly crashes the server this is kind of unhandled errro and so we are 
 //sutting down the server by our-self and priting the message 
//--------------------------------------------------------------------------------------------------------------------------------------------|


// 2.Unhandled Promise Rejection--------------------------------------------------------------------------------------------------------------|
process.on("unhandledRejection",(err)=>{
    console.log(`Error ${err.message}`)
    console.log("Shuting down the Server due to Unhandled Prome Rejection")
    server.close(()=>{
        process.exit(1);
    })
})
// used for wrong config and server did not creashed properly so we have to close the server by printing a message ex wrong mongd_uri in .env
// so server did not work with wrong config
//--------------------------------------------------------------------------------------------------------------------------------------------|


// 3.error handling for async functions-------------------------------------------------------------------------------------------------------| 
module.exports = theFunc => (req,res,next)=>{
    Promise.resolve(theFunc(req,res,next)).catch(next); 
}
// it takes a function and resolve it or reject if reject then catch the error and passes the control to next middleware 
//--------------------------------------------------------------------------------------------------------------------------------------------|


// creating custom class for oerror handling--------------------------------------------------------------------------------------------------|
class ErrorHandler extends Error{ //inherting from Error js built in class so, we can  create custom error objects with additional properties and behavior.
    constructor(message,statusCode){
    super(message);
    this.statusCode = statusCode

    Error.captureStackTrace(this, this.constructor)}

}
module.exports = ErrorHandler;

/*
Inside the ErrorHandler class, there is a constructor function that takes two parameters: message and statusCode. 
When a new ErrorHandler object is created, the constructor is called, and the message and statusCode values are passed.

The super(message) line calls the constructor of the parent Error class, passing the message parameter. 
This sets the error message for the ErrorHandler object.

The this.statusCode = statusCode line assigns the statusCode parameter value to the statusCode property of the ErrorHandler object. 
This allows you to associate a specific HTTP status code with the error.

The Error.captureStackTrace(this, this.constructor) line captures the stack trace of the ErrorHandler object, 
providing more information about the location where the error occurred. It helps in debugging and tracking the source of the error.
*/

// Use the error object to handle the error
const error = new ErrorHandler('An error occurred', 500);
//--------------------------------------------------------------------------------------------------------------------------------------------|


// for error handling to set appropriate responce for error-----------------------------------------------------------------------------------|
const ErrorHandler  = require("./../utils/errorhandler")

module.exports = (err,req,res,next)=>{ //exproting a middleware function with four parameters function takes eror and appriprita response sent back to the clinet
    err.statusCode = err.statusCode || 500 // sets if status code is missing then sets status code 500 to it 
    err.message = err.message || 'Internal Server Error' // and also sets message of internal server error

// Wrong mongdb Id error-------- this is for cast error of mongodb if product id is invalid|
if(err.name ="CastError"){
    const message =  `Resource not found Invalid:${err.path}`
    err = new ErrorHandler(message,400);
}
// Wrong mongdb Id error--------|

    res.status(err.statusCode).json({   
        success: false,
        error : err.message
    });
}; 
//--------------------------------------------------------------------------------------------------------------------------------------------|

