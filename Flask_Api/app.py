# main.py
from flask import Flask
from api.routes import disease_bp, crop_bp, fertilizer_bp, pest_bp

app = Flask(__name__)

app.register_blueprint(disease_bp, url_prefix='/api/disease')
app.register_blueprint(crop_bp, url_prefix='/api/crop')
app.register_blueprint(fertilizer_bp, url_prefix='/api/fertilizer')
app.register_blueprint(pest_bp, url_prefix='/api/pest') 

print("Registered Routes:")
for rule in app.url_map.iter_rules():
    print(rule)

import tensorflow as tf
print(tf.__version__)
print(tf.keras.utils.__file__)



import os
import requests

# File paths
MODEL_DIR = "Flask_Api/model_weights"
MODEL_URL = "https://drive.googleapis.com/uc?export=download&id=10HpNPOdHgWnrCDZtK1fMZmlA-Zs6jpve"
MODEL_PATH = os.path.join(MODEL_DIR, "disease_classification.keras")

# Create directory if missing
# if not os.path.exists(MODEL_DIR):
    # os.makedirs(MODEL_DIR, exist_ok=True)

# Download the file if it doesn’t exist
# if not os.path.exists(MODEL_PATH):
#     print("Downloading model file...")
#     response = requests.get(MODEL_URL)
#     if response.status_code == 200:
#         with open(MODEL_PATH, "wb") as f:
#             f.write(response.content)
#         print("Model downloaded successfully!")
#     else:
#         raise Exception(f"Failed to download model. Status code: {response.status_code}")
# else:
#     print("Model already exists.")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)