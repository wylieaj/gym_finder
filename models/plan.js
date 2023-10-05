const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const planSchema = new Schema({
  name: String,
  price: Number,
  planType: {
    type: String,
    enum: ["Month", "Year", "Class"],
  },
  description: String,
  gym: { type: mongoose.Schema.Types.ObjectId, ref: "Gym" },
});

const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;
