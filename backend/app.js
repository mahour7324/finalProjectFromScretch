const express = require('express')//Imports the Express framework, allowing you to create an Express application.
const app = express()//Creates an instance of the Express application.
app.use(express.json())//Adds a middleware which parses incoming requests with JSON payloads. It allows you to access the request body as JSON.

//routes
const products = require("./routes/productRouter")//importing productrouter

app.use("/api/v1",products)//Mounts the products router on the "/api/v1" path.





module.exports = app;