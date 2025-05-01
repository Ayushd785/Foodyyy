const Menu = require("../models/Menu");
const Restaurant = require("../models/Restaurant");

// CREATE restaurant
const createRetaurant = async (req, res) => {
  try {
    const { name, address, phone, logoUrl } = req.body;

    const isExist = await Restaurant.findOne({ ownerId: req.user.userId });
    if (isExist) {
      return res.status(404).json({
        msg: "Restaurant already exists for this owner",
      });
    }

    const restaurant = new Restaurant({
      ownerId: req.user.userId, // ✅ FIXED
      name,
      address,
      phone,
      logoUrl,
    });

    await restaurant.save();

    res.status(200).json({
      msg: "Restaurant created successfully",
      restaurant,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Internal server error",
      error: err.message,
    });
  }
};

// UPDATE restaurant
const updateRestaurant = async (req, res) => {
  try {
    const updates = req.body;

    const restaurant = await Restaurant.findOneAndUpdate(
      { ownerId: req.user.userId },
      updates,
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({
        msg: "Restaurant does not exist",
      });
    }

    res.status(200).json({
      msg: "Restaurant details updated successfully",
      restaurant,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Internal server error",
      error: err.message,
    });
  }
};

// GET your restaurant
const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user.userId });

    if (!restaurant) {
      return res.status(404).json({
        msg: "Restaurant does not exist",
      });
    }

    res.status(200).json({
      restaurant,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};

// get all the restaurant mainly for Users
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.status(200).json({
      restaurants,
    });
  } catch (Err) {
    res.status(404).json({
      msg: "Server down",
      error: Err,
    });
  }
};

// get the menu of a specific restaurant

const getMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItems = await Menu.find({ restaurantId: id });

    if (!menuItems || menuItems.length == 0) {
      res.status(403).json({
        msg: "No menu exist for this restaurant",
      });
    }
    res.status(200).json({
      menuItems,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server down",
      error: err,
    });
  }
};

module.exports = {
  createRetaurant,
  updateRestaurant,
  getRestaurant,
  getRestaurants,
  getMenu,
};
