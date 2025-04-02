import { DiseasePrediction, PestPrediction, CropRecommendation, FertilizerRecommendation } from '../db_models/Predictions.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'agri-help-predictions',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, crop: 'scale' }]
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Disease Prediction Controller
export const storeDiseaseResult = async (req, res) => {
  try {
    const { prediction, confidence } = req.body;
    const userId = req.user.id;
    console.log('Uploaded File:', req.file);
    const newPrediction = new DiseasePrediction({
      user: userId,
      prediction,
      confidence: parseFloat(confidence),
      imageUrl: req.file?.path || null,
      originalImageName: req.file?.originalname
    });

    await newPrediction.save();
    res.status(201).json(newPrediction);
  } catch (error) {
    console.error('Error storing disease prediction:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Pest Prediction Controller
export const storePestResult = async (req, res) => {
  try {
    const { prediction, confidence } = req.body;
    const userId = req?.user?.id;

    const newPrediction = new PestPrediction({
      user: userId,
      prediction,
      confidence: parseFloat(confidence),
      imageUrl: req.file?.path || null,
      originalImageName: req.file?.originalname
    });

    await newPrediction.save();
    res.status(201).json(newPrediction);
  } catch (error) {
    console.error('Error storing pest prediction:', error);
    console.log('ERROR: in prediction-controller.js')
    res.status(500).json({ error: 'Server error' });
  }
};

// Crop Recommendation Controller (No changes)
export const storeCropResult = async (req, res) => {
  try {
    const { recommendation, ...otherParameters } = req.body; 

    console.log('Received other parameters:', otherParameters);  // FIXED: Corrected variable name
    console.log('Received recommendation:', recommendation);
    
    const userId = req.user.id;

    const formattedParameters = {
      temperature: otherParameters.Temperature,
      pH: otherParameters.pH,
      rainfall: otherParameters.Rainfall,
      soilColor: otherParameters.Soil_color,  // Fix case
      nitrogen: otherParameters.Nitrogen,
      phosphorus: otherParameters.Phosphorus,
      potassium: otherParameters.Potassium,
      confidence: otherParameters.Confidence
    };
    
    const newRecommendation = new CropRecommendation({
      user: userId,
      recommendation,
      otherParameters: formattedParameters
    });    
    
    await newRecommendation.save();
    res.status(201).json(newRecommendation);
  } catch (error) {
    console.error('Error storing crop recommendation:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const storeFertilizerResult = async (req, res) => {
    try {
      const { recommendation, ...otherParameters } = req.body; 

    console.log('Received other parameters:', otherParameters);  // FIXED: Corrected variable name
    console.log('Received recommendation:', recommendation);
    
    const userId = req.user.id;
    
    const formattedParameters = {
      temperature: otherParameters.Temperature,
      cropType:otherParameters.Crop,
      pH: otherParameters.pH,
      rainfall: otherParameters.Rainfall,
      soilColor: otherParameters.Soil_color,  // Fix case
      nitrogen: otherParameters.Nitrogen,
      phosphorus: otherParameters.Phosphorus,
      potassium: otherParameters.Potassium,
      confidence: otherParameters.Confidence
    };
    
    const newRecommendation = new FertilizerRecommendation({
      user: userId,
      recommendation,
      otherParameters: formattedParameters
    });    
    
    await newRecommendation.save();
    res.status(201).json(newRecommendation);
    } catch (error) {
      console.error('Error storing fertilizer recommendation:', error);
      res.status(500).json({ error: 'Server error' });
    }
};
  
export const getUserDiseaseResults = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    const results = await DiseasePrediction.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
    
    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error fetching disease results:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch results'
    });
  }
};

export const getUserPestResults = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;    
    const results = await PestPrediction.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
    
    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error fetching pest results:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch results'
    });
  }
};

export const getUserCropResults = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;  
    const results = await CropRecommendation.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
    
    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error fetching crop results:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch results'
    });
  }
};


export const getUserFertilizerResults = async (req, res) => {
    try {
      const userId = req.params.userId || req.user.id;
      
      const results = await FertilizerRecommendation.find({ user: userId })
        .sort({ createdAt: -1 })
        .lean();
      
      res.status(200).json({
        success: true,
        count: results.length,
        data: results
      });
    } catch (error) {
      console.error('Error fetching fertilizer results:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch results'
      });
    }
  };

// Get all results for a user combined
export const getAllUserResults = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    const [diseaseResults, pestResults, cropResults,fertilizerResults] = await Promise.all([
      DiseasePrediction.find({ user: userId }).lean(),
      PestPrediction.find({ user: userId }).lean(),
      CropRecommendation.find({ user: userId }).lean(),
      FertilizerRecommendation.find({ user: userId }).lean(),
    ]);
    
    // Add type field to distinguish between different results
    const formattedResults = [
      ...diseaseResults.map(result => ({ ...result, type: 'disease' })),
      ...pestResults.map(result => ({ ...result, type: 'pest' })),
      ...cropResults.map(result => ({ ...result, type: 'crop' })),
      ...fertilizerResults.map(result => ({ ...result, type: 'fertilizer' })),
    ];
    
    // Sort all results by creation date, most recent first
    formattedResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.status(200).json({
      success: true,
      count: formattedResults.length,
      data: formattedResults
    });
  } catch (error) {
    console.error('Error fetching all results:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch results'
    });
  }
};

// Admin endpoint to get all results
export const getAllResults = async (req, res) => {
  
  try {
    const [diseaseResults, pestResults, cropResults] = await Promise.all([
      DiseasePrediction.find().populate('user', 'name email').lean(),
      PestPrediction.find().populate('user', 'name email').lean(),
      CropRecommendation.find().populate('user', 'name email').lean()
    ]);
    
    // Add type field to distinguish between different results
    const formattedResults = [
      ...diseaseResults.map(result => ({ ...result, type: 'disease' })),
      ...pestResults.map(result => ({ ...result, type: 'pest' })),
      ...cropResults.map(result => ({ ...result, type: 'crop' }))
    ];
    
    // Sort all results by creation date, most recent first
    formattedResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.status(200).json({
      success: true,
      count: formattedResults.length,
      data: formattedResults
    });
  } catch (error) {
    console.error('Error fetching all results:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch results'
    });
  }
};
