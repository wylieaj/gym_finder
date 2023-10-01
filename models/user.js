const { boolean } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  isAdmin: Boolean,
  firstName: String,
  lastName: String,
});

// ADD USERNAME AND PASSWORD FIELDS TO OUR USERSCHEMA OBJECT
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
