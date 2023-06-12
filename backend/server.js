const app = require("./app") //importing express app from app.js
const dotenv = require('dotenv') //importing dotenv module
const connectDatabase = require("./config/database") // imorting database connection file
//config:
dotenv.config({path:"./backend/config/config.env"}); //config dotenv file from where to get all env values

connectDatabase(); //connecting to database



//listening the server
app.listen(process.env.PORT,()=>{
   console.log(`server is running on https://localhost:${process.env.PORT}`)
})