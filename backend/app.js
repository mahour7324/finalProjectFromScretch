const express = require('express')
const app = express()
app.use(express.json())

//routes
const products = require("./routes/productRouter")

app.use("/api",products)




module.exports = app;