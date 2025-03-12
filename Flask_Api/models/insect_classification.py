# flask-api/models/pest_classification.py
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
from PIL import Image
import io

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
        self.load_model()

    def load_model(self):
        """Load the trained Keras model"""
        try:
            self.model = tf.keras.models.load_model('./model_weights/insect_identification.keras')
            self.loaded = True
        except Exception as e:
            print("Error loading model:", e)
            self.loaded = False
            
    def preprocess_image(self, image_bytes):
        """Preprocess uploaded image for model prediction"""
        try:
            img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            img = img.resize(self.img_size)
            img_array = image.img_to_array(img)
            img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
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
            folder_number = self.selected_classes[predicted_index]  # Use self.selected_classes
            pest_name = self.selected_pest_mapping[folder_number]
            confidence = float(np.max(predictions[0]))
    
            return {
                "class": pest_name,
                "confidence": confidence,
                "error": None
            }
        except Exception as e:
            return {"error": str(e)}
