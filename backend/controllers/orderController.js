const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Menu = require("../models/Menu");
const Restaurant = require("../models/Restaurant");

// Create order from cart
const createOrder = async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod, notes } = req.body;
    const customerId = req.user.userId;

    // Get user's cart
    const cart = await Cart.findOne({ customerId }).populate("items.menuItem");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        msg: "Cart is empty",
      });
    }

    // Calculate total and get restaurant ID from first item
    let totalAmount = 0;
    const restaurantId = cart.items[0].menuItem.restaurantId;

    // Verify all items are from same restaurant
    const orderItems = cart.items.map((item) => {
      if (item.menuItem.restaurantId.toString() !== restaurantId.toString()) {
        throw new Error("All items must be from the same restaurant");
      }
      const itemTotal = item.quantity * item.menuItem.price;
      totalAmount += itemTotal;

      return {
        menuItem: item.menuItem._id,
        quantity: item.quantity,
        price: item.menuItem.price,
      };
    });

    // Create order
    const order = new Order({
      customerId,
      restaurantId,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      notes,
    });

    await order.save();

    // Clear cart after successful order
    await Cart.findOneAndUpdate({ customerId }, { $set: { items: [] } });

    // Populate order details for response
    const populatedOrder = await Order.findById(order._id)
      .populate("items.menuItem")
      .populate("restaurantId", "name address")
      .populate("customerId", "name email");

    res.status(201).json({
      msg: "Order created successfully",
      order: populatedOrder,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};

// Get customer's orders
const getMyOrders = async (req, res) => {
  try {
    const customerId = req.user.userId;

    const orders = await Order.find({ customerId })
      .populate("items.menuItem")
      .populate("restaurantId", "name address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      orders,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};

// Get restaurant's orders (for owners)
const getRestaurantOrders = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    // Find restaurant owned by this user
    const restaurant = await Restaurant.findOne({ ownerId });
    if (!restaurant) {
      return res.status(404).json({
        msg: "Restaurant not found",
      });
    }

    const orders = await Order.find({ restaurantId: restaurant._id })
      .populate("items.menuItem")
      .populate("customerId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      orders,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};

// Update order status (for restaurant owners)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const ownerId = req.user.userId;

    // Find restaurant owned by this user
    const restaurant = await Restaurant.findOne({ ownerId });
    if (!restaurant) {
      return res.status(404).json({
        msg: "Restaurant not found",
      });
    }

    // Find order and verify it belongs to this restaurant
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        msg: "Order not found",
      });
    }

    if (order.restaurantId.toString() !== restaurant._id.toString()) {
      return res.status(403).json({
        msg: "Access denied",
      });
    }

    // Update order status
    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate("items.menuItem")
      .populate("customerId", "name email");

    res.status(200).json({
      msg: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getRestaurantOrders,
  updateOrderStatus,
};
