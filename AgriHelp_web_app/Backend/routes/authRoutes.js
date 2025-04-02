// authRoutes.js
import express from "express";
import { handleOTP, logout } from "../controllers/authController.js";
import { getStarted } from "../controllers/getStartedController.js";

const router = express.Router();
router.post("/handle-otp", handleOTP);
router.post("/auth/logout", logout);
router.post("/get-started",getStarted);

export default router;