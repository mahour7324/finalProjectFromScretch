const app = require("./app")
const dotenv = require('dotenv')
const connectDatabase = require("./config/database")
//config:
dotenv.config({path:"./backend/config/config.env"});

connectDatabase();



//listening the server
app.listen(process.env.PORT,()=>{
   console.log(`server is running on https://localhost:${process.env.PORT}`)
})