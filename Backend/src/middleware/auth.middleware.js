const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies.jwt || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized, no token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId)
      .select("-password").populate('contacts');
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error occurred in protectRoute:", error.message);
    return res.status(401).json({ message: "Unauthorized, invalid token" });
  }
};

module.exports = protectRoute;
