const ErrorHandler = require("./../utils/errorhandler");
const catchAsyncError = require("./../middleware/catchAsyncErrors");
const User =  require("../models/userModel")
const mongoose = require("mongoose")
// console.log(User)

// Register a user--------------------------------------
exports.registerUser = catchAsyncError (async (req,res)=>{
    
        const user =  await User.create(req.body

        )
        res.status(201).json({
            status:"success",
            user
        })
    }
     )
