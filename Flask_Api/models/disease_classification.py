# flask-api/models/disease_classification.py
import tensorflow as tf
from tensorflow.keras.utils import img_to_array
import numpy as np
from PIL import Image
import io

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
        
    def load_model(self):
        """Load the trained Keras model"""
        try:
            self.model = tf.keras.models.load_model('./model_weights/disease_classification.keras')
            self.loaded = True
        except Exception as e:
            print("Error loading model:", e)
            self.loaded = False
            
    def preprocess_image(self, image_bytes):
        """Preprocess uploaded image for model prediction"""
        try:
            img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            img = img.resize(self.img_size)
            img_array = img_to_array(img)
            img_array = tf.keras.applications.resnet50.preprocess_input(img_array)
            return np.expand_dims(img_array, axis=0)
        except Exception as e:
            print("Image processing error:", e)
            return None
            
    def predict(self, image_bytes):
        """Make prediction on processed image"""
        if not self.loaded:
            self.load_model()
            if not self.loaded:
                return {"error": "Model failed to load"}
                
        processed_img = self.preprocess_image(image_bytes)
        if processed_img is None:
            return {"error": "Invalid image file"}
            
        try:
            predictions = self.model.predict(processed_img)
            predicted_class = np.argmax(predictions[0])
            confidence = float(np.max(predictions[0]))
            
            return {
                "class": self.class_names[predicted_class],
                "confidence": confidence,
                "error": None
            }
        except Exception as e:
            return {"error": str(e)}