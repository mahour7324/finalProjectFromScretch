const express = require('express')
const app  = express();
const dotenv = require('dotenv')
const database = require('./backend/config/database')
dotenv.config({path:"./backend/config/config.env"})
app.get("/",(req,res)=>{
    res.status(404).json({message:"code is working"})
    
})
database();

app.listen(3000,()=>{
    console.log(`server is running on https://localhost:3000`)
})