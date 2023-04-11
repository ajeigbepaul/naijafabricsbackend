const mongoose = require("mongoose")
const joi = require("joi");
const joypasswordcomplexity = require("joi-password-complexity");

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String, require: true },
    lastname: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    // roles: { type: String, default:'1001'},
    roles:{user:{type:Number,default:1001}, admin:Number},
    refreshToken:{type:String}

  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);
const validate = (data) => {
  const schema = joi.object({
    firstname: joi.string().required().label("First Name"),
    lastname: joi.string().required().label("Last Name"),
    email: joi.string().email().required().label("Email"),
    password: joypasswordcomplexity().required().label("Password"),
    // roles: joi.string().required().label("Role"),
  });
  return schema.validate(data);
};

module.exports = { User, validate };