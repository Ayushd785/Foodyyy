const express = require("express");
const { ownerOnly } = require("../middleware/roleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createRetaurant,
  updateRestaurant,
  getRestaurant,
  getRestaurants,
  getMenu,
} = require("../controllers/restaurantController");
const router = express.Router();

// Public routes (no auth required)
router.get("/", getRestaurants); // Get all restaurants
router.get("/:id/menu", getMenu); // Get menu for a specific restaurant

// Protected routes (auth required)
router.use(authMiddleware);

router.get("/test", (req, res) => {
  res.status(200).json({
    msg: "Restaurant route is running",
  });
});

router.post("/", ownerOnly, createRetaurant);
router.put("/", ownerOnly, updateRestaurant);
router.get("/me", ownerOnly, getRestaurant);

module.exports = router;
