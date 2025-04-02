import OTP from "../db_models/OTP.js";
import User from "../db_models/User.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { sendEmailOTP } from "../utils/emailSender.js";
import { sendSMS } from "../utils/smsSender.js";

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

export const handleOTP = async (req, res) => {
  const { type, email, mobile, otp } = req.body;

  try {
    if (type === "send") {
      // Validate input
      if (!email && !mobile) {
        return res.status(400).json({ error: "Email or mobile required" });
      }

      // Check user existence
      const user = await User.findOne(email ? 
        { "basicInfo.email": email } : 
        { "basicInfo.contactNumber": mobile }
      );
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Generate and save OTP
      const newOTP = generateOTP();
      await OTP.create({
        email: email || null,
        mobile: mobile || null,
        otp: newOTP
      });

      try {
        console.log(`OTP for ${email || mobile}: ${newOTP}`);
        if (email) {
          await sendEmailOTP(email, newOTP);
        } 
        
        if (mobile) {
          const fmobile = `+91${mobile}`;
          await sendSMS(
            fmobile,
            `Your AgriHelp OTP: ${newOTP} (valid for 5 minutes)`
          );
        }
    
      } catch (error) {
        console.error("OTP Delivery Error:", error);
        return res.status(500).json({ 
          error: "Failed to send OTP. Please try again." 
        });
      }
      
      return res.json({ success: true });

    } else if (type === "verify") {
      // Validate input
      if (!otp) return res.status(400).json({ error: "OTP required" });

      // Find the latest OTP
      const validOTP = await OTP.findOne({
        $or: [{ email }, { mobile }],
        otp
      }).sort({ createdAt: -1 });

      if (!validOTP) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      // Get full user details
      const user = await User.findOne(
        email ? 
        { "basicInfo.email": email } : 
        { "basicInfo.contactNumber": mobile }
      ).select("-__v -createdAt");

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Generate JWT token
      const token = generateToken(user._id);

      // Set cookie and send response
      return res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "None",
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        .json({
          success: true,
          message: "Login successful",
          user: {
            id: user._id,
            fullName: user.basicInfo.fullName,
            email: user.basicInfo.email,
            contactNumber: user.basicInfo.contactNumber
          }
        });

    } else {
      return res.status(400).json({ error: "Invalid operation type" });
    }
  } catch (error) {
    console.error("OTP Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Add this new logout function
export const logout = (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};

export { generateToken };