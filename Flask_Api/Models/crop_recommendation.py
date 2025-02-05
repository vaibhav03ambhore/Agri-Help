import pickle
import numpy as np

# Load model and scaler
with open('./model_weights/crop_recom_model.pkl', 'rb') as f:
    model = pickle.load(f)
with open('./model_weights/scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

crop_dict = {
    'rice': 1, 'maize': 2, 'chickpea': 3, 'kidneybeans': 4,
    'pigeonpeas': 5, 'mothbeans': 6, 'mungbean': 7, 'blackgram': 8,
    'lentil': 9, 'pomegranate': 10, 'banana': 11, 'mango': 12,
    'grapes': 13, 'watermelon': 14, 'muskmelon': 15, 'apple': 16,
    'orange': 17, 'papaya': 18, 'coconut': 19, 'cotton': 20,
    'jute': 21, 'coffee': 22
}
reverse_crop_dict = {v: k for k, v in crop_dict.items()}

def recommend_crop(data):
    features = np.array([[data['N'], data['P'], data['K'], 
                        data['temperature'], data['humidity'],
                        data['ph'], data['rainfall']]])
    scaled = scaler.transform(features)
    proba = model.predict_proba(scaled)[0]
    idx = np.argmax(proba)
    return reverse_crop_dict[idx+1], proba[idx]