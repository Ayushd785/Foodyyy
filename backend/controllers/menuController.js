const Menu = require("../models/Menu");
const Restaurant = require("../models/Restaurant");

// createItem route this can only be accessed by the restaurant owner so in this route we will add the owneronly middleware

const createItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      imageUrl,
      isAvailable,
      isVegetarian,
      isSpicy,
    } = req.body;

    const restaurant = await Restaurant.findOne({ ownerId: req.user.userId });
    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant does not exist",
      });
    }
    const item = new Menu({
      restaurantId: restaurant._id,
      name,
      description,
      price,
      category,
      imageUrl,
      isAvailable,
      isVegetarian,
      isSpicy,
    });

    await item.save();
    res.status(200).json({
      msg: "Item created successfully",
      menuItem: item,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server down",
      error: err.message,
    });
  }
};

// get all the menu items this can be accessed by both owner and the customer

const getItems = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user.userId });
    if (!restaurant) {
      return res.status(404).json({
        msg: "Restaurant does not exist",
      });
    }
    const menuItems = await Menu.find({ restaurantId: restaurant._id });
    res.status(200).json({
      menuItems: menuItems,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server down",
      error: err.message,
    });
  }
};

// the owner can update the menu item this route is also OWNER ONLY route

const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Menu.findById(itemId);
    if (!item) {
      return res.status(404).json({
        msg: "Item does not exist",
      });
    }
    const restaurant = await Restaurant.findOne({ ownerId: req.user.userId });
    if (
      !restaurant ||
      restaurant._id.toString() !== item.restaurantId.toString()
    ) {
      return res.status(403).json({
        msg: "Access Denied",
      });
    }
    const updatedItem = await Menu.findByIdAndUpdate(itemId, req.body, {
      new: true,
    });
    res.status(200).json({
      msg: "Item updated successfully",
      menuItem: updatedItem,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server issue",
      error: err.message,
    });
  }
};

// the owner can delete a Item from the menu

const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Menu.findById(itemId);
    if (!item) {
      return res.status(404).json({
        msg: "Item does not exist",
      });
    }
    const restaurant = await Restaurant.findOne({ ownerId: req.user.userId });
    if (
      !restaurant ||
      restaurant._id.toString() !== item.restaurantId.toString()
    ) {
      return res.status(403).json({
        msg: "Access denied",
      });
    }
    await Menu.findByIdAndDelete(itemId);
    res.status(200).json({
      msg: "Item successfully deleted",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server down",
      error: err.message,
    });
  }
};

module.exports = {
  createItem,
  updateItem,
  getItems,
  deleteItem,
};
