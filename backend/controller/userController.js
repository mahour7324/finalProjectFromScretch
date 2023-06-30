const ErrorHandler = require("./../utils/errorhandler");
const catchAsyncErrors = require("./../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
const sendToken = require("../utils/jwtToken");

const crypto = require("crypto");
const cloudinary = require("cloudinary");
const {comparePassword} =  require("../models/userModel")
// console.log(User)

// Register a user--------------------------------------------------------------------------------------------------------------------------------------|
exports.registerUser = catchAsyncErrors(async (req, res) => {
  const {name,email,password} = req.body;
     

  const user = await User.create({
    name,
    email, 
    password,
    // avatar:{
      //     public_id:"demo public id",
      //     url: "demo image url" 
      // },
    });
    sendToken(user,201,res)
  });
// -----------------------------------------------------------------------------------------------------------------------------------------------------|



//  loginUser-------------------------------------------------------------------------------------------------------------------------------------------|
exports.loginUser =catchAsyncErrors (async (req,res,next) => {
    const {email, password} = req.body;
    //checking if user has given password and email both
    if(!email || !password){
        return next(new ErrorHandler("Please enter email & Password",400));
    }
    const user =await User.findOne({email}).select("+password");// selecting password becuase in schema we defined select : false
    

    if(!user){
      return next(new ErrorHandler("Wrong Email or Password",401))
    }
    const isPasswordMatched =await user.comparePassword(password)
    if(!isPasswordMatched){
      return next(new ErrorHandler("Wrong Email or Password",401))
    }
   sendToken(user,200,res)
}); 
// -----------------------------------------------------------------------------------------------------------------------------------------------------|


// Logout User------------------------------------------------------------------------------------------------------------------------------------------|
exports.logout = catchAsyncErrors(async (req, res, next) => {
  const expires =  new Date(Date.now())
    res.cookie("token", null, {
      expires,
      httpOnly: true,
      
    });
  
    res.status(200).json({ 
      success: true,
      message: "Logged Out",
      
    });
  });
// -----------------------------------------------------------------------------------------------------------------------------------------------------|


// Forgot Password--------------------------------------------------------------------------------------------------------------------------------------|
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get ResetPassword Token
  
  
  const resetToken = user.getResetPasswordToken();
  console.log("resetToken: ",resetToken)
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});
// -----------------------------------------------------------------------------------------------------------------------------------------------------|


// reset Password--------------------------------------------------------------------------------------------------------------------------------------|
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  let resetPasswordToken = req.params.token
  resetPasswordToken = resetPasswordToken.replace(/^\s+|\s+$/g, "");
//  console.log(resetPasswordToken)
const email = "shivamproject89@gmail.com"
  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
    
  });
  

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  

  sendToken(user, 200, res);
});
// -----------------------------------------------------------------------------------------------------------------------------------------------------|

