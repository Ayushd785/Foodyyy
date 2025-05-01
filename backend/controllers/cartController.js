const Cart = require("../models/Cart");

// add items to cart
const addToCart = async (req, res) => {
  try {
    const { menuItem, quantity } = req.body;

    let cart = await Cart.findOne({ customerId: req.user.userId });

    if (!cart) {
      cart = new Cart({
        customerId: req.user.userId,
        items: [{ menuItem, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.menuItem.toString() === menuItem
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ menuItem, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ msg: "Item added to cart", cart });
  } catch (err) {
    res.status(500).json({
      msg: "Server down",
      error: err.message,
    });
  }
};

// get the cart

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customerId: req.user.userId }).populate({
      path: "items.menuItem",
      populate: {
        path: "restaurantId",
        select: "name address",
      },
    });
    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        msg: "Cart is empty",
        cart: cart || { items: [] },
      });
    }
    res.status(200).json({
      cart,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server down",
      error: err.message,
    });
  }
};

// remove item from cart

const removeItem = async (req, res) => {
  try {
    const { menuItem } = req.params;
    const customerId = req.user.userId;

    const cart = await Cart.findOne({ customerId });
    if (!cart) {
      return res.status(404).json({
        msg: "Cart does not exist",
      });
    }
    cart.items = cart.items.filter((item) => {
      return item.menuItem.toString() !== menuItem;
    });

    await cart.save();
    res.status(200).json({
      msg: "Item removed successfully",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Internal server issue",
      error: err.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeItem,
};
