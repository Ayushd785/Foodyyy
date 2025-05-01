const express = require("express");
const {
  getCart,
  addToCart,
  removeItem,
} = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// route to get the cart
// route to add item in cart
// route to remove item from cart

router.use(authMiddleware);
const { consumerOnly } = require("../middleware/roleMiddleware");
router.use(consumerOnly);
router.get("/", getCart);
router.post("/add", addToCart);
router.delete("/:menuItem", removeItem);

module.exports = router;
