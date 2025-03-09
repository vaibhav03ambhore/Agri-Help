import User from "../db_models/User.js";

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
    if (!basicInfo?.email || !basicInfo?.contactNumber) {
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