from flask import Blueprint, request, jsonify
import numpy as np
from PIL import Image
import io
from flask import Blueprint, request, jsonify
from models.fertilizer_recommendation import FertilizerRecommender
from models.disease_classification import model as disease_model
from models.crop_recommendation import CropRecommender

disease_bp = Blueprint('disease', __name__)
fertilizer_bp = Blueprint('fertilizer', __name__)
crop_bp = Blueprint('crop', __name__)

# Initialize the model
fertilizer_model = FertilizerRecommender()
crop_model = CropRecommender()


@crop_bp.route('/predict', methods=['POST'])
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
        
    result = crop_model.predict(data)
    if result['error']:
        return jsonify({"error": result['error']}), 400
        
    return jsonify({"recommendation": result['crop']})


@fertilizer_bp.route('/predict', methods=['POST'])
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
        result = fertilizer_model.predict(data)
        if result['error']:
            return jsonify({"error": result['error']}), 500
        return jsonify({"recommendation": result['fertilizer']})
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
        predicted_class = np.argmax(predictions)
        
        return jsonify({
            "predicted_disease": disease_model.get_label(predicted_class),
            "confidence": float(np.max(predictions)),
            "class_id": int(predicted_class),
            "all_predictions": predictions.tolist()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

