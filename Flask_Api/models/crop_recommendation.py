# flask-api/models/crop_recommendation.py
import pickle
import pandas as pd

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
        self.load_model()
        
    def load_model(self):
        """Load the trained model"""
        try:
            with open('./model_weights/crop_recommendation.pkl', 'rb') as f:
                self.model = pickle.load(f)
            self.loaded = True
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
            crop_code = prediction[0]
            
            # Map to crop name
            if crop_code not in self.crop_mapping:
                return {"crop": None, "error": "Unknown crop predicted"}
            
            return {"crop": self.crop_mapping[crop_code], "error": None}
            
        except Exception as e:
            return {"crop": None, "error": str(e)}
