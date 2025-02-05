from flask import Flask
from api.routes import disease_bp, crop_bp,fertilizer_bp

app = Flask(__name__)
app.register_blueprint(disease_bp, url_prefix='/api/disease')
app.register_blueprint(crop_bp, url_prefix='/api/crop')
app.register_blueprint(fertilizer_bp, url_prefix='/api/fertilizer')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)