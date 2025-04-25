import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';

import { warmupServices } from './utils/warmupServices.js';
import { contactForm } from './utils/contactForm.js';

// Load .env file
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(cookieParser());

// Database connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
connectDB(MONGO_URI);

// Routes
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api',predictionRoutes);

app.get('/api/warmup', warmupServices);


// warmupServices();
app.post('/api/submit-contact-form',contactForm);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
