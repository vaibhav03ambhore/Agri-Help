import User from "../db_models/User.js";
import {generateToken} from "./authController.js";

export const createFarmerProfile = async (req, res) => {
  try {
    const { 
        basicInfo,
        farmDetails, 
        cropSelections,
        challenges,
        goals,
        technology    
      } = req.body;

    // Validate required fields
    if (!basicInfo?.email && !basicInfo?.contactNumber) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ "basicInfo.email": basicInfo.email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const newUser = await User.create({
      basicInfo,
      farmDetails,  
      cropSelections,
      challenges,
      goals,
      technology    
    });
    const token = generateToken(newUser._id);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      user: newUser
    });

  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};





export const getFarmerProfile = async (req, res) => {
  try {
    
    const farmer = await User.findById(req.user._id)
      .select('-__v -createdAt')
      .lean();

    if (!farmer) {
      return res.status(404).json({ 
        success: false,
        error: "Farmer profile not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: farmer
    });

  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({
      success: false,
      error: "Server error while fetching profile"
    });
  }
};