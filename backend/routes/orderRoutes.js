const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { ownerOnly, consumerOnly } = require("../middleware/roleMiddleware");
const {
  createOrder,
  getMyOrders,
  getRestaurantOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const router = express.Router();

router.use(authMiddleware);

// Customer routes
router.post("/", consumerOnly, createOrder);
router.get("/my-orders", consumerOnly, getMyOrders);

// Owner routes
router.get("/restaurant-orders", ownerOnly, getRestaurantOrders);
router.put("/:orderId/status", ownerOnly, updateOrderStatus);

module.exports = router;
