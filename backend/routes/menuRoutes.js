const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { ownerOnly } = require("../middleware/roleMiddleware");
const {
  createItem,
  updateItem,
  getItems,
  deleteItem,
} = require("../controllers/menuController");
const router = express.Router();

router.use(authMiddleware);

router.post("/", ownerOnly, createItem);
router.put("/:itemId", ownerOnly, updateItem);
router.get("/mine", ownerOnly, getItems);
router.delete("/:itemId", ownerOnly, deleteItem);

module.exports = router;
