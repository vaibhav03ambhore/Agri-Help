# pest_service.py - Pest Classification Microservice
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os
import time

app = Flask(__name__)
CORS(app)

class PestClassifier:
    def __init__(self):
        self.model = None
        self.selected_classes = [
            '62', '61', '56', '73', '80', '75', '65', '43', '72', '98',
            '79', '15', '81', '63', '25', '35', '96', '31', '74', '82',
            '53', '78', '94', '30', '67', '85', '36', '58', '48', '14'
        ]
        self.selected_pest_mapping = {
            '62': "Brevipoalpus lewisi McGregor",
            '61': "Colomerus vitis",
            '56': "alfalfa seed chalcid",
            '73': "Erythroneura apicalis",
            '80': "Chrysomphalus aonidum",
            '75': "Panonchus citri McGregor",
            '65': "Pseudococcus comstocki Kuwana",
            '43': "beet weevil",
            '72': "Trialeurodes vaporariorum",
            '98': "Chlumetia transversa",
            '79': "Ceroplastes rubens",
            '15': "grub",
            '81': "Parlatoria zizyphus Lucus",
            '63': "oides decempunctata",
            '25': "aphids",
            '35': "wheat sawfly",
            '96': "Salurnis marginella Guerr",
            '31': "bird cherry-oataphid",
            '74': "Papilio xuthus",
            '82': "Nipaecoccus vastalor",
            '53': "therioaphis maculata Buckton",
            '78': "Unaspis yanonensis",
            '94': "Dasineura sp",
            '30': "green bug",
            '67': "Ampelophaga",
            '85': "Dacus dorsalis(Hendel)",
            '36': "cerodonta denticornis",
            '58': "Apolygus lucorum",
            '48': "tarnished plant bug",
            '14': "rice shell pest"
        }
        self.img_size = (224, 224)
        self.loaded = False
        self.model_path = os.environ.get('MODEL_PATH', 'insect_identification.keras')

    def load_model(self):
        """Load the trained Keras model"""
        try:
            self.model = tf.keras.models.load_model(self.model_path)
            self.loaded = True
            print("Pest model loaded successfully")
        except Exception as e:
            print("Error loading model:", e)
            self.loaded = False
            
    def preprocess_image(self, image_bytes):
        """Preprocess uploaded image for model prediction"""
        try:
            img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            img = img.resize(self.img_size)
            img_array = np.array(img, dtype=np.float32)
            img_array = img_array / 255.0  # Normalize to [0,1]
            return np.expand_dims(img_array, axis=0)
        except Exception as e:
            print("Image processing error:", e)
            return None
            
    def predict(self, image_bytes):
        if not self.loaded:
            self.load_model()
            if not self.loaded:
                return {"error": "Model failed to load"}
    
        processed_img = self.preprocess_image(image_bytes)
        if processed_img is None:
            return {"error": "Invalid image file"}
    
        try:
            predictions = self.model.predict(processed_img)
            predicted_index = np.argmax(predictions[0])
            folder_number = self.selected_classes[predicted_index]
            pest_name = self.selected_pest_mapping[folder_number]
            confidence = float(np.max(predictions[0]))
    
            return {
                "class": pest_name,
                "confidence": confidence,
                "error": None
            }
        except Exception as e:
            return {"error": str(e)}

# Create classifier instance
pest_classifier = PestClassifier()

# Routes
@app.route("/")
def home():
    return "Pest Classification Service - Running"

@app.route("/predict", methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
        
    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({"error": "Empty filename"}), 400
        
    try:
        start_time = time.time()
        image_bytes = image_file.read()
        result = pest_classifier.predict(image_bytes)
        
        if result['error']:
            return jsonify({"error": result['error']}), 400
            
        processing_time = time.time() - start_time
        response = {
            "prediction": result['class'],
            "confidence": result['confidence'],
            "processing_time_seconds": processing_time
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=['GET'])
def health():
    status = {
        "service": "pest-classifier",
        "status": "healthy",
        "model_loaded": pest_classifier.loaded
    }
    return jsonify(status)

@app.route("/warmup", methods=['GET'])
def warmup():
    # Preload the model
    if not pest_classifier.loaded:
        pest_classifier.load_model()
    
    return jsonify({
        "message": "Model loaded successfully" if pest_classifier.loaded else "Model loading failed",
        "model_loaded": pest_classifier.loaded
    })

if __name__ == "__main__":
    # Load model on startup
    print("Starting Pest Classification Service...")
    pest_classifier.load_model()
    
    # Run app
    port = int(os.environ.get("PORT", 5002))
    app.run(host='0.0.0.0', port=port, debug=False)