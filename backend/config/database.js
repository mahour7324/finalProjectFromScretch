const mongoose = require('mongoose')
// const mongoURI = "mongodb://localhost:27017/finalPro"
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };

const connectDatabase = ()=>{

    mongoose
    .connect(process.env.DB_URI, mongoOptions)
    .then((data) => {
        console.log(`mongodb connected with ${data.connection.host}` )})
        .catch((err)=>{
            console.log(`can't connect with database becuase of ${err}`)
        });
        
    }
module.exports = connectDatabase;
