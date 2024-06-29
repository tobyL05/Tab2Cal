from flask import Flask
from flask_cors import CORS
from routes.upload.index import upload_bp

app = Flask(__name__)

# @app.route("/")
# def home():
#     return "hello world"

def register_bps():
    app.register_blueprint(upload_bp)

if __name__ == "__main__":
    app.register_blueprint(upload_bp)
    cors = CORS(app)
    # app.config['CORS_HEADERS'] = 'Content-Type'
    app.run(host="0.0.0.0", port=3000, debug=True)