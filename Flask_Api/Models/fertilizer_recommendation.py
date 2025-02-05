import joblib
import pandas as pd
import numpy as np

# Load model and encoder
model = joblib.load('./model_weights/rfFertilizer_model.joblib')
encoder = joblib.load('./model_weights/fertilizer_encoder.joblib')  # Save encoder during training

def recommend_fertilizer(input_data):
    # Create DataFrame from input
    sample_df = pd.DataFrame([input_data])
    
    # Encode categorical features
    encoded_data = pd.DataFrame(
        encoder.transform(sample_df[['Soil_color', 'Crop']]),
        columns=encoder.get_feature_names_out(['Soil_color', 'Crop'])
    )
    
    # Combine features
    final_data = pd.concat([sample_df.drop(['Soil_color', 'Crop'], axis=1), encoded_data], axis=1)
    
    # Ensure correct feature order
    final_data = final_data.reindex(columns=model.feature_names_in_, fill_value=0)
    
    # Make prediction
    prediction = model.predict(final_data)
    return prediction[0]