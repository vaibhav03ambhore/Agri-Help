# flask-api/models/fertilizer_recommendation.py
import joblib
import pandas as pd

class FertilizerRecommender:
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.loaded = False
        self.load_models()
        
    def load_models(self):
        """Load model and preprocessor"""
        try:
            self.model = joblib.load('./model_weights/rfFertilizer_model.joblib')
            self.preprocessor = joblib.load('./model_weights/fertilizer_preprocessor.joblib')
            self.loaded = True
        except Exception as e:
            print("Error loading models:", e)
            self.loaded = False
            
    def predict(self, input_data):
        """Make prediction using loaded models"""
        if not self.loaded:
            self.load_models()
            
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
            return {"fertilizer": prediction[0], "error": None}
        except Exception as e:
            print("Prediction error:", e)
            return {"fertilizer": None, "error": str(e)}
