# fertilizer_service.py - Fertilizer Recommendation Microservice
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
import time

app = Flask(__name__)
CORS(app)

class FertilizerRecommender:
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.loaded = False
        self.model_path = os.environ.get('MODEL_PATH', 'rfFertilizer_model.joblib')
        self.preprocessor_path = os.environ.get('PREPROCESSOR_PATH', 'fertilizer_preprocessor.joblib')
        
    def load_models(self):
        """Load model and preprocessor"""
        try:
            self.model = joblib.load(self.model_path)
            self.preprocessor = joblib.load(self.preprocessor_path)
            self.loaded = True
            print("Fertilizer model loaded successfully")
        except Exception as e:
            print("Error loading models:", e)
            self.loaded = False
            
    def predict(self, input_data):
        """Make prediction using loaded models"""
        if not self.loaded:
            self.load_models()
            if not self.loaded:
                return {"fertilizer": None, "error": "Model loading failed"}
            
        try:
            # Convert input to DataFrame
            sample_df = pd.DataFrame([input_data])
            
            # Preprocess the input
            processed_data = self.preprocessor.transform(sample_df)
            features = self.preprocessor.get_feature_names_out()
            sample_prepared = pd.DataFrame(processed_data, columns=features)
            
            # Ensure correct feature order
            sample_prepared = sample_prepared.reindex(columns=self.model.feature_names_in_, fill_value=0)
            
            # Make prediction
            prediction = self.model.predict(sample_prepared)

            if hasattr(self.model, "predict_proba"):
                probabilities = self.model.predict_proba(sample_prepared)  # Correct input
                confidence = max(probabilities[0])  # Highest confidence score
            else:
                confidence = None

            return {"fertilizer": prediction[0], "error": None, "confidence": confidence}
        except Exception as e:
            print("Prediction error:", e)
            return {"fertilizer": None, "error": str(e), "confidence": None}

# Create recommender instance
fertilizer_recommender = FertilizerRecommender()

# Routes
@app.route("/")
def home():
    return "Fertilizer Recommendation Service - Running"

@app.route("/predict", methods=['POST'])
def predict_fertilizer():
    data = request.get_json()
    
    required_fields = ['Nitrogen', 'Phosphorus', 'Potassium', 
                      'pH', 'Rainfall', 'Temperature',
                      'Soil_color', 'Crop']
    
    missing = [field for field in required_fields if field not in data]
    if missing:
        return jsonify({
            "error": f"Missing required fields: {', '.join(missing)}"
        }), 400
        
    try:
        start_time = time.time()
        result = fertilizer_recommender.predict(data)
        processing_time = time.time() - start_time
        
        if result['error']:
            return jsonify({"error": result['error']}), 500
            
        response = {
            "recommendation": result['fertilizer'],
            "confidence": result.get('confidence', None),
            "processing_time_seconds": processing_time
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=['GET'])
def health():
    status = {
        "service": "fertilizer-recommender",
        "status": "healthy",
        "model_loaded": fertilizer_recommender.loaded
    }
    return jsonify(status)

@app.route("/warmup", methods=['GET'])
def warmup():
    # Preload the model
    if not fertilizer_recommender.loaded:
        fertilizer_recommender.load_models()
    
    return jsonify({
        "message": "Model loaded successfully" if fertilizer_recommender.loaded else "Model loading failed",
        "model_loaded": fertilizer_recommender.loaded
    })

if __name__ == "__main__":
    # Load model on startup
    print("Starting Fertilizer Recommendation Service...")
    fertilizer_recommender.load_models()
    
    # Run app
    port = int(os.environ.get("PORT", 5003))
    app.run(host='0.0.0.0', port=port, debug=False)