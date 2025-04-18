import mongoose from 'mongoose';

// Base schema for common fields across all prediction types
const basePredictionSchema = {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
};

// Disease Prediction Schema
const DiseasePredictionSchema = new mongoose.Schema({
  ...basePredictionSchema,
  prediction: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String, 
    default: null
  },
  originalImageName:{
    type:String,
    default:null
  },
});

// Pest Prediction Schema
const PestPredictionSchema = new mongoose.Schema({
  ...basePredictionSchema,
  prediction: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String, 
    default: null
  },
  originalImageName:{
    type:String,
    default:null
  },
});

// Crop Recommendation Schema
const CropRecommendationSchema = new mongoose.Schema({
  ...basePredictionSchema,
  recommendation: {
    type: String,
    required: true
  },
  otherParameters: {
    temperature: Number,
    pH: Number,
    rainfall: Number,
    soilColor: String,
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
    confidence: Number
  }
});

const FertilizerRecommendationSchema = new mongoose.Schema({
    ...basePredictionSchema,
    recommendation: {
      type: String,
      required: true
    },
    otherParameters: {
      temperature: Number,
      pH: Number,
      rainfall: Number,
      soilColor: String,
      cropType:String,
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number,
      confidence: Number
    }
  });

// Create models from the schemas
export const DiseasePrediction = mongoose.model('DiseasePrediction', DiseasePredictionSchema);

export const PestPrediction = mongoose.model('PestPrediction', PestPredictionSchema);

export const CropRecommendation = mongoose.model('CropRecommendation', CropRecommendationSchema);

export const FertilizerRecommendation = mongoose.model('FertilizerRecommendation', FertilizerRecommendationSchema);