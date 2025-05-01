const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!["customer", "owner"].includes(role)) {
      return res.status(404).json({
        msg: "Invalid role",
      });
    }

    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(404).json({
        msg: "User already exists please consider login",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      passwordHased: hashedPassword,
      role,
    });

    await user.save();

    res.status(200).json({
      msg: "User created successfully please login",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isExist = await User.findOne({ email });
    if (!isExist) {
      return res.status(404).json({
        msg: "Incorrect email",
      });
    }
    const isValid = await bcrypt.compare(password, isExist.passwordHased);
    if (!isValid) {
      return res.status(404).json({
        msg: "Incorrect password or email",
      });
    }
    const token = jwt.sign(
      {
        userId: isExist._id,
        role: isExist.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: isExist._id,
        name: isExist.name,
        role: isExist.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = { signup, login };
