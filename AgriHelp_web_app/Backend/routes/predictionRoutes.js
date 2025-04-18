import express from 'express';
import {
  storeDiseaseResult,
  storePestResult,
  storeCropResult,
  storeFertilizerResult,

  getUserDiseaseResults,
  getUserCropResults,
  getUserFertilizerResults,
  getUserPestResults,

  getAllResults,
  getAllUserResults,
  upload
} from '../controllers/prediction-controllers.js';

import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Prediction storage
router.post('/store-disease', authenticate, upload.single('image'), storeDiseaseResult);
router.post('/store-pest', authenticate, upload.single('image'), storePestResult);
router.post('/store-crop', authenticate, storeCropResult);
router.post('/store-fertilizer', authenticate, storeFertilizerResult);

// Prediction retrieval
router.get('/get-disease-res', authenticate, getUserDiseaseResults);
router.get('/get-pest-res', authenticate, getUserPestResults);
router.get('/get-crop-res', authenticate, getUserCropResults);
router.get('/get-fertilizer-res', authenticate, getUserFertilizerResults);

router.get('/get-all-users-results', authenticate, getAllResults);
router.get('/get-all-res-of-a-user', authenticate, getAllUserResults);


export default router;