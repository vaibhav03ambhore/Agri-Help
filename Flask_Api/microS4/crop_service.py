# crop_service.py - Crop Recommendation Microservice
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import os
import time

app = Flask(__name__)
CORS(app)

class CropRecommender:
    def __init__(self):
        self.model = None
        self.loaded = False
        self.soil_mapping = {
            'Black': 1, 'Red ': 2, 'Medium Brown': 3, 'Dark Brown': 4,
            'Red': 5, 'Light Brown': 6, 'Reddish Brown': 7, 'Brown': 8, 'Reddish': 9
        }
        self.crop_mapping = {
            1: 'Sugarcane', 2: 'Jowar', 3: 'Cotton', 4: 'Rice',
            5: 'Wheat', 6: 'Groundnut', 7: 'Maize', 8: 'Potato',
            9: 'Urad', 10: 'Tomato', 11: 'Soybean', 12: 'Turmeric', 13: 'Grapes'
        }
        self.model_path = os.environ.get('MODEL_PATH', 'crop_recommendation.pkl')
        
    def load_model(self):
        """Load the trained model"""
        try:
            with open(self.model_path, 'rb') as f:
                self.model = pickle.load(f)
            self.loaded = True
            print("Crop model loaded successfully")
        except Exception as e:
            print("Error loading model:", e)
            self.loaded = False
            
    def predict(self, input_data):
        """Make crop prediction"""
        if not self.loaded:
            self.load_model()
            if not self.loaded:
                return {"crop": None, "error": "Model loading failed"}
                
        try:
            # Validate soil color
            soil_color = input_data['Soil_color']
            if soil_color not in self.soil_mapping:
                valid_colors = list(self.soil_mapping.keys())
                return {"crop": None, "error": f"Invalid Soil Color. Valid options: {valid_colors}"}
            
            # Prepare input features
            features = pd.DataFrame([[
                self.soil_mapping[soil_color],
                input_data['Nitrogen'],
                input_data['Phosphorus'],
                input_data['Potassium'],
                input_data['pH'],
                input_data['Rainfall'],
                input_data['Temperature']
            ]], columns=['Soil_color', 'Nitrogen', 'Phosphorus', 
                        'Potassium', 'pH', 'Rainfall', 'Temperature'])
            
            # Make prediction
            prediction = self.model.predict(features)
            print(prediction)
            crop_code = prediction[0]

            # Get prediction confidence (if model supports predict_proba)
            if hasattr(self.model, "predict_proba"):
                probabilities = self.model.predict_proba(features)  # Get probability distribution
                confidence = max(probabilities[0])  # Confidence of the predicted class
            else:
                confidence = None  # Confidence score is not available
            
            if crop_code not in self.crop_mapping:
                return {"crop": None, "error": "Unknown crop predicted", "confidence": None}
            
            return {"crop": self.crop_mapping[crop_code], "error": None,"confidence":confidence}
            
        except Exception as e:
            return {"crop": None, "error": str(e)}

# Create recommender instance
crop_recommender = CropRecommender()

# Routes
@app.route("/")
def home():
    return "Crop Recommendation Service - Running"

@app.route("/predict", methods=['POST'])
def predict_crop():
    data = request.get_json()
    
    required_fields = [
        'Soil_color', 'Nitrogen', 'Phosphorus',
        'Potassium', 'pH', 'Rainfall', 'Temperature'
    ]
    
    missing = [field for field in required_fields if field not in data]
    if missing:
        return jsonify({
            "error": f"Missing required fields: {', '.join(missing)}"
        }), 400
    
    start_time = time.time()
    result = crop_recommender.predict(data)
    processing_time = time.time() - start_time
    
    if result['error']:
        return jsonify({"error": result['error']}), 400
        
    response = {
        "result": result,
        "recommendation": result['crop'],
        "processing_time_seconds": processing_time
    }
    return jsonify(response)

@app.route("/health", methods=['GET'])
def health():
    status = {
        "service": "crop-recommender",
        "status": "healthy",
        "model_loaded": crop_recommender.loaded
    }
    return jsonify(status)

@app.route("/warmup", methods=['GET'])
def warmup():
    # Preload the model
    if not crop_recommender.loaded:
        crop_recommender.load_model()
    
    return jsonify({
        "message": "Model loaded successfully" if crop_recommender.loaded else "Model loading failed",
        "model_loaded": crop_recommender.loaded
    })

if __name__ == "__main__":
    # Load model on startup
    print("Starting Crop Recommendation Service...")
    crop_recommender.load_model()
    
    # Run app
    port = int(os.environ.get("PORT", 5004))
    app.run(host='0.0.0.0', port=port, debug=False)