const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});
//------------------------------------------------------------------------------------------------------





module.exports = mongoose.model("User", userSchema);
