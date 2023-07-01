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
    // avatar: {
    //   public_id: myCloud.public_id,
    //   url: myCloud.secure_url,
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


// Get User Detail--------------------------------------------------------------------------------------------------------------------------------------|
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});
// -----------------------------------------------------------------------------------------------------------------------------------------------------|


// update User password---------------------------------------------------------------------------------------------------------------------------------|
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});
// -----------------------------------------------------------------------------------------------------------------------------------------------------|


// update User Profile==================================================================================================================================|
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // if (req.body.avatar !== "") {
  //   const user = await User.findById(req.user.id);

  //   const imageId = user.avatar.public_id;

  //   await cloudinary.v2.uploader.destroy(imageId);

  //   const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //     folder: "avatars",
  //     width: 150,
  //     crop: "scale",
  //   });

  //   newUserData.avatar = {
  //     public_id: myCloud.public_id,
  //     url: myCloud.secure_url,
  //   };
  // }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});
// =====================================================================================================================================================|


// Get all users(admin)---------------------------------------------------------------------------------------------------------------------------------|
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  
  res.status(200).json({
    success: true,
    users,
  });
});
// -----------------------------------------------------------------------------------------------------------------------------------------------------|


// Get single user (admin)------------------------------------------------------------------------------------------------------------------------------|
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});
// -----------------------------------------------------------------------------------------------------------------------------------------------------|


// update User Role -- Admin----------------------------------------------------------------------------------------------------------------------------|
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});
// -----------------------------------------------------------------------------------------------------------------------------------------------------|


// Delete User --Admin----------------------------------------------------------------------------------------------------------------------------------|
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  
  // const imageId = user.avatar.public_id;
  // await cloudinary.v2.uploader.destroy(imageId);

  user.deleteOne()

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
// -----------------------------------------------------------------------------------------------------------------------------------------------------|
