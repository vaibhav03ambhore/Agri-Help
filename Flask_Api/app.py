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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)