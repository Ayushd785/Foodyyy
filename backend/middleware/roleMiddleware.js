function ownerOnly(req, res, next) {
  if (req.user.role !== "owner") {
    return res.status(404).json({
      message: "Access denied Owners only",
    });
  }
  next();
}

function consumerOnly(req, res, next) {
  if (req.user.role !== "customer") {
    return res.status(404).json({
      msg: "Only for consumers",
    });
  }
  next();
}

module.exports = { ownerOnly, consumerOnly };
