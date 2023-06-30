const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    //------------------------------------------------------------------------------------------------------
    name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Character should not be greater than 30"],
    minLength: [3, "Character should not be less than 3"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a correct email"],
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  avatar: [
    {
      public_ID: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken:{type:String},
  resetPasswordExpire:{type:Date}
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});
//------------------------------------------------------------------------------------------------------
// jwt token ---------------------------------------------|
userSchema.methods.getJWTToken = function(){
  return jwt.sign({id:this._id},process.env.JWT_SECRET,{
      expiresIn:   process.env.JWT_EXPIRE
      
     
  });
};

// compare password ---------------------------------------------|
userSchema.methods.comparePassword = async function(enteredPassword) {
  const result = await  bcrypt.compare(enteredPassword,this.password);
  return result;
}


// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  // return resetToken;
  return this.resetPasswordToken;
};


module.exports = mongoose.model("User", userSchema);
