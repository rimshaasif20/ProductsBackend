// middleware/protectRoute.js

import jwt from "jsonwebtoken";
import Users from "../models/userModel.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      res.status(401).json({ message: " No token found" });
      return;
    }
    if (token && token.startsWith("bearer")) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await Users.findById(decoded.id).select("password");

      req.user = user;

      next();
    } else {
      res.status(401).json({ message: " Invalid token." });
      return;
    }
  } catch (error) {
    console.log("Protect Route Middleware Error: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export default protectRoute;
