import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    basicInfo: {
      fullName: { type: String, required: true },
      email: { type: String, unique: true },
      contactNumber: { type: String  },
      location: { type: String, required: true }
    },
    farmDetails: {
      farmSize: Number,
      farmSizeUnit: { type: String, default: "acres" },
      farmingType: String,
      currentCrops: [String],
      plannedCrops: [String],
      growingSeason: String
    },
    cropSelections: [{
      name: String,
      isCurrent: Boolean,
      isPlanned: Boolean,
      growingSeason: String
    }],
    challenges: [{
      type: { type: String },
      details: String
    }],
    goals: [{
      type: { type: String },
      priority: Number
    }],
    technology: [String],
    createdAt: { type: Date, default: Date.now }
  });
                         
export default mongoose.model("User", userSchema);