# disease_service.py - Disease Classification Microservice
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.utils import img_to_array
import numpy as np
from PIL import Image
import io
import os
import time

app = Flask(__name__)
CORS(app)

class DiseaseClassifier:
    def __init__(self):
        self.model = None
        self.class_names = [
            "Corn__common_rust",
            "Corn__gray_leaf_spot",
            "Corn__healthy",
            "Corn__northern_leaf_blight",
            "Cotton Aphids",
            "Cotton Army worm",
            "Cotton Bacterial blight",
            "Cotton Healthy",
            "Cotton Powdery mildew",
            "Cotton Target spot",
            "Grape Black Rot",
            "Grape ESCA",
            "Grape Healthy",
            "Grape Leaf Blight",
            "Groundnut early_leaf_spot_1",
            "Groundnut early_rust_1",
            "Groundnut healthy_leaf_1",
            "Groundnut late_leaf_spot_1",
            "Groundnut nutrition_deficiency_1",
            "Groundnut rust_1",
            "Jowar Anthracnose and Red Rot",
            "Jowar Cereal Grain molds",
            "Jowar Covered Kernel smut",
            "Jowar Head Smut",
            "Jowar Rust",
            "Jowar loose smut",
            "Potato__early_blight",
            "Potato__late_blight",
            "Rice Bacterial leaf blight",
            "Rice Brown spot",
            "Rice Leaf smut",
            "Soybean__caterpillar",
            "Soybean__diabrotica_speciosa",
            "Soybean__healthy",
            "Sugarcane__Healthy",
            "Sugarcane__Mosaic",
            "Sugarcane__RedRot",
            "Sugarcane__Rust",
            "Sugarcane__Yellow",
            "Tomato__bacterial_spot",
            "Tomato__early_blight",
            "Tomato__healthy",
            "Tomato__leaf_mold",
            "Tomato__septoria_leaf_spot",
            "Tomato__yellow_leaf_curl_virus",
            "Turmeric Aphids_Disease",
            "Turmeric Blotch",
            "Turmeric Healthy_Leaf",
            "Turmeric Leaf_Spot",
            "Urad Cercospora leaf spot",
            "Urad Healthy",
            "Urad Leaf Crinkle",
            "Urad Yellow Mosaic",
            "Wheat___Brown_Rust",
            "Wheat___Healthy",
            "Wheat___Yellow_Rust"
        ]
        self.img_size = (224, 224)
        self.loaded = False
        self.model_path = os.environ.get('MODEL_PATH', 'disease_classification.tflite')
        
    def load_model(self):
        """Load the TensorFlow Lite model"""
        try:
            # TFLite models need a different loading approach
            interpreter = tf.lite.Interpreter(model_path=self.model_path)
            interpreter.allocate_tensors()
            self.model = interpreter
            self.input_details = interpreter.get_input_details()
            self.output_details = interpreter.get_output_details()
            self.loaded = True
            print("Disease model loaded successfully")
        except Exception as e:
            print("Error loading model:", e)
            self.loaded = False
            
    def preprocess_image(self, image_bytes):
        """Preprocess uploaded image for model prediction"""
        try:
            # Open and resize image
            img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            img = img.resize(self.img_size)
            
            # Convert to array and preprocess with ResNet50 preprocessing
            img_array = img_to_array(img)
            img_array = tf.keras.applications.resnet50.preprocess_input(img_array)
            
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
            # TFLite inference
            self.model.set_tensor(self.input_details[0]['index'], processed_img)
            self.model.invoke()
            predictions = self.model.get_tensor(self.output_details[0]['index'])
            
            predicted_class = np.argmax(predictions[0])
            confidence = float(np.max(predictions[0]))
            
            return {
                "class": self.class_names[predicted_class],
                "confidence": confidence,
                "error": None
            }
        except Exception as e:
            return {"error": str(e)}

# Create classifier instance
disease_classifier = DiseaseClassifier()

# Routes
@app.route("/")
def home():
    return "Disease Classification Service - Running"

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
        result = disease_classifier.predict(image_bytes)
        
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
        "service": "disease-classifier",
        "status": "healthy",
        "model_loaded": disease_classifier.loaded
    }
    return jsonify(status)

@app.route("/warmup", methods=['GET'])
def warmup():
    # Preload the model
    if not disease_classifier.loaded:
        disease_classifier.load_model()
    
    return jsonify({
        "message": "Model loaded successfully" if disease_classifier.loaded else "Model loading failed",
        "model_loaded": disease_classifier.loaded
    })

if __name__ == "__main__":
    # Load model on startup
    print("Starting Disease Classification Service...")
    disease_classifier.load_model()
    
    # Run app
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=False)