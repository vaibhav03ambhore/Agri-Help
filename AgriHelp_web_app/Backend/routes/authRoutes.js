// authRoutes.js
import express from "express";
import { handleOTP, logout } from "../controllers/authController.js";

const router = express.Router();
router.post("/handle-otp", handleOTP);
router.post("/auth/logout", logout);

export default router;