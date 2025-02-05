from flask import Blueprint, request, jsonify
import numpy as np
from PIL import Image
import io
from models.disease_classification import model as disease_model
from models.crop_recommendation import recommend_crop
from flask import Blueprint, request, jsonify
from models.fertilizer_recommendation import recommend_fertilizer

disease_bp = Blueprint('disease', __name__)
crop_bp = Blueprint('crop', __name__)
fertilizer_bp = Blueprint('fertilizer', __name__)

@fertilizer_bp.route('/recommend', methods=['POST'])
def fertilizer_recommendation():
    try:
        data = request.json
        required_params = ['Nitrogen', 'Phosphorus', 'Potassium', 'pH', 
                          'Rainfall', 'Temperature', 'Soil_color', 'Crop']
        
        if not all(param in data for param in required_params):
            return jsonify({"error": "Missing required parameters"}), 400
        
        prediction = recommend_fertilizer({
            'Nitrogen': data['Nitrogen'],
            'Phosphorus': data['Phosphorus'],
            'Potassium': data['Potassium'],
            'pH': data['pH'],
            'Rainfall': data['Rainfall'],
            'Temperature': data['Temperature'],
            'Soil_color': data['Soil_color'],
            'Crop': data['Crop']
        })
        
        return jsonify({"recommended_fertilizer": prediction}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@disease_bp.route('/predict', methods=['POST'])
def disease_prediction():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file'].read()
        image = np.array(Image.open(io.BytesIO(file)))
        predictions = disease_model.predict(image)
        return jsonify({
            "predicted_class": int(np.argmax(predictions)),
            "predictions": predictions.tolist()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@crop_bp.route('/recommend', methods=['POST'])
def crop_recommendation():
    try:
        data = request.json
        required = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        if not all(k in data for k in required):
            return jsonify({"error": "Missing parameters"}), 400
        
        crop, prob = recommend_crop(data)
        return jsonify({
            "recommended_crop": crop,
            "probability": round(float(prob)*100, 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500