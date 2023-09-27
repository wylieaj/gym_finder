const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gymSchema = new Schema({
  name: String,
  description: String,
  street: String,
  postcode: String,
  memberships: [
    {
      memName: String,
      memDescription: String,
      memPrice: Number,
    },
  ],
  image: String,
});

const Gym = mongoose.model("Gym", gymSchema);

module.exports = Gym;
