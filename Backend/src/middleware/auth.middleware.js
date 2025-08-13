const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error occurred:", error);
    console.log("Token received:", req.cookies.jwt);

    return res.status(401).json({ message: "Unauthorized, invalid token" });
  }
};

module.exports = protectRoute;
