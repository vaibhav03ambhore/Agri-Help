import jwt from "jsonwebtoken";
import User from "../db_models/User.js";

export const authenticate = async (req, res, next) => {
  try {
    // 1. Get token from cookies
    const token = req.cookies.access_token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized - No token provided"
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Find user in database
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found"
      });
    }

    // 4. Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(401).json({
      success: false,
      error: "Unauthorized - Invalid token"
    });
  }
};