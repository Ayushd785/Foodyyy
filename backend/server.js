const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// Configure CORS for frontend connection
const corsOptions = {
  origin: ["http://localhost:8080", "http://127.0.0.1:8080"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json("API is running");
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Mongodb connected");
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => console.error("Mongodb connection failed", err));

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const restRoutes = require("./routes/restaurantRoutes");
app.use("/api/restaurant", restRoutes);

const menuRoutes = require("./routes/menuRoutes");
app.use("/api/menu/", menuRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

const cartRoutes = require("./routes/cartRoutes");
app.use("/api/user/cart", cartRoutes);

console.log("Loading order routes...");
const orderRoutes = require("./routes/orderRoutes");
console.log("Order routes loaded, mounting...");
app.use("/api/orders", orderRoutes);
console.log("Order routes mounted successfully");

// Debug route to test if server is working
app.get("/api/test-orders", (req, res) => {
  res.json({ message: "Order routes are accessible" });
});
