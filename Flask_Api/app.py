# main.py
import os
from flask import Flask
from api.routes import disease_bp, crop_bp, fertilizer_bp, pest_bp
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

app.register_blueprint(disease_bp, url_prefix='/api/disease')
app.register_blueprint(crop_bp, url_prefix='/api/crop')
app.register_blueprint(fertilizer_bp, url_prefix='/api/fertilizer')
app.register_blueprint(pest_bp, url_prefix='/api/pest')

@app.route("/")
def home():
    return "Hello, homepage here! Your app is working!"


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 4000))
    app.run(host='0.0.0.0', port=port, debug=True)
