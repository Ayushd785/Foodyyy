const express = require("express");
const {
  getMenu,
  getRestaurants,
} = require("../controllers/restaurantController");
const router = express.Router();

// test route
router.get("/test", (req, res) => {
  res.status(200).json({
    msg: "User route is running",
  });
});

router.get("/restaurant", getRestaurants);
router.get("/restaurant/:id/menu", getMenu);

module.exports = router;
