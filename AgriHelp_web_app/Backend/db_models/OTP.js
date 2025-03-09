import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, index: true },
  mobile: { type: String, index: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // Auto delete after 5 minutes
});

export default mongoose.model("OTP", otpSchema);