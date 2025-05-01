const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(404).json({
      msg: "Please provide the JWT token to move forward",
    });
  }
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(404).json({ msg: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(500).json({
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleware;
