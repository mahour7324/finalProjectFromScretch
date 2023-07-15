const app = require("./app") //importing express app from app.js
const dotenv = require('dotenv') //importing dotenv module
const cloudinary = require("cloudinary");

const connectDatabase = require("./config/database") // imorting database connection file
//-------------------------------------------------------------------------------------------------------------------------------------//

// handling Uncought Error------------------------------------------------|
process.on("uncaughtException",(err)=>{
   console.log(`Error ${err.message}`)
   console.log("Shuting down the Server due to uncoughtException")
   process.exit(1);
})




dotenv.config({path:"./backend/config/config.env"}); //config dotenv file from where to get all env values

connectDatabase(); //connecting to database

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
 });
 

//listening the server
const server = app.listen(process.env.PORT,()=>{
   console.log(`server is running on https://localhost:${process.env.PORT}`)
})

// Unhandled Promise Rejection---------------------------------------------|
process.on("unhandledRejection",(err)=>{
   console.log(`Error ${err.message}`)
   console.log("Shuting down the Server due to Unhandled Prome Rejection")
   server.close(()=>{
      process.exit(1);
   })
})
