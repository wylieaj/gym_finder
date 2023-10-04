const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  url: String,
  filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

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
  images: [imageSchema],
});

const Gym = mongoose.model("Gym", gymSchema);

module.exports = Gym;
