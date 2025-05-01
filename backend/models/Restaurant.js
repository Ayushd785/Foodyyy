const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "Delicious food delivered fresh to your door",
    },
    address: String,
    phone: String,
    logoUrl: String,
    cuisine: {
      type: String,
      default: "Multi-cuisine",
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    deliveryTime: {
      type: String,
      default: "30-45 mins",
    },
  },
  {
    timestamps: true,
  }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
