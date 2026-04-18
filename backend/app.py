import os
import requests
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from auth import auth
from utils import now_utc

load_dotenv()

def create_app():
    app = Flask(__name__)

    # 1. Configure Folders for segmentation results
    RESULTS_DIR = os.path.join(app.root_path, 'static', 'results')
    os.makedirs(RESULTS_DIR, exist_ok=True)

    # 2. Hugging Face Configuration
    HF_TOKEN = os.getenv("HF_TOKEN")
    MODEL_REPO = os.getenv("HF_MODEL_REPO", "Phulpoto/aneurysm-detection")
    API_URL = f"https://api-inference.huggingface.co/models/{MODEL_REPO}"
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}

    # 3. Dynamic CORS & URLs for Production
    BACKEND_URL = os.getenv("RAILWAY_PUBLIC_DOMAIN", "http://127.0.0.1:5000")
    if not BACKEND_URL.startswith("http"):
        BACKEND_URL = f"https://{BACKEND_URL}"

    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "*")
    
    CORS(
        app,
        resources={r"/*": {"origins": [FRONTEND_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"]}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    @app.route('/static/results/<path:filename>')
    def serve_results(filename):
        return send_from_directory(RESULTS_DIR, filename)

    @app.get("/")
    def root():
        return jsonify({
            "message": "IADS Flask Backend Running (Microservices Mode) ✅", 
            "database": "Connected",
            "ai_provider": "Hugging Face Inference API"
        })

    @app.post("/api/analyze-scan")
    def analyze_scan():
        if 'image' not in request.files:
            return jsonify({"error": "No scan uploaded"}), 400

        file = request.files['image']
        img_bytes = file.read()
        
        try:
            # --- STEP 1: PING HUGGING FACE API ---
            response = requests.post(API_URL, headers=headers, data=img_bytes)
            
            # 503 means the model is still loading on Hugging Face servers
            if response.status_code == 503:
                return jsonify({"error": "AI Model is starting up on HF, try again in 20s"}), 503
            
            if response.status_code != 200:
                print(f"HF Error: {response.text}")
                return jsonify({"error": "AI Inference failed"}), response.status_code

            # Hugging Face returns a list of predictions
            # Note: You may need to format this to match your frontend expectations
            prediction_result = response.json()

            # --- STEP 2: RETURN RESULTS ---
            return jsonify({
                "status": "success",
                "data": prediction_result,
                "timestamp": now_utc()
            })

        except Exception as e:
            print(f"Analysis Error: {e}")
            return jsonify({"error": "Processing failed"}), 500

    app.register_blueprint(auth, url_prefix="/api/auth")
    return app

# Gunicorn entry point
app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)