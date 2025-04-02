import OTP from "../db_models/OTP.js";
import User from "../db_models/User.js";
import crypto from "crypto";
import { sendEmailOTP } from "../utils/emailSender.js";
import { sendSMS } from "../utils/smsSender.js";

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

export const getStarted = async (req, res) => {
  const { type, email, mobile, otp } = req.body;

  try {
    if (type === "send") {
      // Validate input: at least one contact is required
      if (!email && !mobile) {
        return res.status(400).json({ error: "Email or mobile required" });
      }

      // Check if email exists in the database (if provided)
      if (email) {
        const existingEmail = await User.findOne({ "basicInfo.email": email });
        if (existingEmail) {
          return res.status(400).json({ 
            error: "Email already exists. Try login with that detail." 
          });
        }
      }

      // Check if mobile exists in the database (if provided)
      if (mobile) {
        const existingMobile = await User.findOne({ "basicInfo.contactNumber": mobile });
        if (existingMobile) {
          return res.status(400).json({ 
            error: "Mobile already exists. Try login with that detail." 
          });
        }
      }

      // Generate a new OTP and save it
      const newOTP = generateOTP();
      await OTP.create({
        email: email || null,
        mobile: mobile || null,
        otp: newOTP
      });

      // Attempt to send the OTP via email and/or SMS
      try {
        console.log(`OTP for ${email || mobile}: ${newOTP}`);
        if (email) {
          await sendEmailOTP(email, newOTP);
        }
        if (mobile) {
          // Format mobile number: if not already in international format, prepend default country code (e.g., +91)
          const formattedMobile = mobile.startsWith("+") ? mobile : `+91${mobile}`;
          await sendSMS(formattedMobile, `Your OTP is: ${newOTP}`);
        }
      } catch (error) {
        console.error("OTP Delivery Error:", error);
        return res.status(500).json({ error: "Failed to send OTP. Please try again." });
      }

      return res.json({ success: true, message: "OTP sent successfully" });

    } else if (type === "verify") {
      // Validate required input for verification
      if (!otp) return res.status(400).json({ error: "OTP required" });
      if (!email && !mobile) {
        return res.status(400).json({ error: "Email or mobile required for verification" });
      }

      // Find the latest matching OTP entry (if any)
      const validOTP = await OTP.findOne({
        $or: [
          { email: email || null },
          { mobile: mobile || null }
        ],
        otp
      }).sort({ createdAt: -1 });

      if (!validOTP) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      return res.json({ success: true, message: "OTP verified successfully" });
      
    } else {
      return res.status(400).json({ error: "Invalid operation type" });
    }
  } catch (error) {
    console.error("OTP Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
