const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const config = require("../config");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      console.log("Verify token: No token provided");
      return res.status(403).send({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.userId, { password: 0 });
    if (!user) {
      return res.status(404).send({ message: "No user found" });
    }
    if (user.role === "admin") {
      req.isAdmin = true;
    }

    next();
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.isAdmin) {
    console.log("Is Admin: Require Admin Role!");
    return res.status(403).send({ message: 'Require Admin Role!' });
  }
  next();
};

const authentication = { verifyToken, isAdmin };
module.exports = authentication;