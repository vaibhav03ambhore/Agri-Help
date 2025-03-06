from flask import Blueprint, request, jsonify
import numpy as np
from PIL import Image
import io
from models.fertilizer_recommendation import FertilizerRecommender
from models.crop_recommendation import CropRecommender
from models.disease_classification import DiseaseClassifier
from models.insect_classification import PestClassifier

disease_bp = Blueprint('disease', __name__)
fertilizer_bp = Blueprint('fertilizer', __name__)
crop_bp = Blueprint('crop', __name__)
pest_bp = Blueprint('pest', __name__)

# Initialize the model
fertilizer_model = FertilizerRecommender()
crop_model = CropRecommender()
disease_model = DiseaseClassifier()
pest_model = PestClassifier()

@disease_bp.route('/predict', methods=['POST'])
def predict_disease():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
        
    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({"error": "Empty filename"}), 400
        
    try:
        image_bytes = image_file.read()
        result = disease_model.predict(image_bytes)
        if result['error']:
            return jsonify({"error": result['error']}), 400
            
        return jsonify({
            "prediction": result['class'],
            "confidence": result['confidence']
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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
    

@pest_bp.route('/predict', methods=['POST'])
def predict_pest():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
        
    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({"error": "Empty filename"}), 400
        
    try:
        image_bytes = image_file.read()
        result = pest_model.predict(image_bytes)
        if result['error']:
            return jsonify({"error": result['error']}), 400
            
        return jsonify({
            "prediction": result['class'],
            "confidence": result['confidence']
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500