import express from "express";
import { authenticate } from "../middleware/auth.js";
import { createFarmerProfile,getFarmerProfile } from "../controllers/userController.js";

const router = express.Router();

router.post("/create-farmer-profile", createFarmerProfile);
router.get("/get-farmer-profile", authenticate, getFarmerProfile);

export default router;

