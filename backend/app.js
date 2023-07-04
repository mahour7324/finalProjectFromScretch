const express = require('express')//Imports the Express framework, allowing you to create an Express application.
const app = express()//Creates an instance of the Express application.
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const  errorMiddleware = require("./middleware/error")
const fileUpload = require("express-fileupload");

// Config
// if (process.env.NODE_ENV !== "PRODUCTION") {
//     require("dotenv").config({ path: "backend/config/config.env" });
//   }

app.use(express.json())//Adds a middleware which parses incoming requests with JSON payloads. It allows you to access the request body as JSON.
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

//------------------------------------------------------------------------------
//routes
const products = require("./routes/productRouter")//importing productrouter
const users = require("./routes/userRouter")



app.use("/api/v1",products)//Mounts the products router on the "/api/v1" path.
app.use("/api/v1",users)
// Middleware for err
app.use(errorMiddleware)


module.exports = app;