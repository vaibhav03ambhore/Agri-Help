import express from "express";
import { authenticate } from "../middleware/auth.js";
import { createFarmerProfile } from "../controllers/userController.js";

const router = express.Router();

router.post("/create-farmer-profile", createFarmerProfile);

// Example protected route
router.get("/profile", authenticate, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;