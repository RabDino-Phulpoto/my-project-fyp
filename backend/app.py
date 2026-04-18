import os
import cv2
import numpy as np
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from auth import auth
from model_loader import load_medical_models
from utils import now_utc

load_dotenv()

def create_app():
    app = Flask(__name__)

    # 1. Initialize AI Models
    clf_model, seg_model = load_medical_models()

    # 2. Configure Folders
    RESULTS_DIR = os.path.join(app.root_path, 'static', 'results')
    os.makedirs(RESULTS_DIR, exist_ok=True)

    # 3. Dynamic CORS & URLs for Production
    # On Railway, use the domain generated in Settings
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
        return jsonify({"message": "IADS Flask Backend Running ✅", "database": "Connected"})

    @app.post("/api/analyze-scan")
    def analyze_scan():
        if 'image' not in request.files:
            return jsonify({"error": "No scan uploaded"}), 400

        file = request.files['image']
        
        try:
            img_bytes = np.frombuffer(file.read(), np.uint8)
            original_img = cv2.imdecode(img_bytes, cv2.IMREAD_COLOR)
            
            # Prepare RGB (3 channels) for Classification
            rgb_224 = cv2.resize(cv2.cvtColor(original_img, cv2.COLOR_BGR2RGB), (224, 224))
            input_rgb = np.expand_dims(rgb_224 / 255.0, axis=0)

            # Prepare Grayscale (1 channel) for Segmentation
            gray_224 = cv2.resize(cv2.cvtColor(original_img, cv2.COLOR_BGR2GRAY), (224, 224))
            input_gray = gray_224.reshape(1, 224, 224, 1) / 255.0

            # --- STEP 1: CLASSIFICATION ---
            try:
                prediction = clf_model.predict(input_rgb)[0][0]
            except Exception:
                prediction = clf_model.predict(input_gray)[0][0]

            is_positive = prediction > 0.5
            
            result_data = {
                "label": "Positive" if is_positive else "Negative",
                "confidence": round(float(prediction) * 100, 2),
                "segmentation_url": None
            }

            # --- STEP 2: SEGMENTATION ---
            if is_positive:
                mask = seg_model.predict(input_gray)[0]
                
                if len(mask.shape) == 3:
                    mask = np.squeeze(mask, axis=-1)
                
                mask_visual = (mask * 255).astype(np.uint8)
                filename = f"seg_{int(now_utc().timestamp())}_{file.filename}.png"
                save_path = os.path.join(RESULTS_DIR, filename)
                cv2.imwrite(save_path, mask_visual)
                
                # Use Dynamic Backend URL
                result_data["segmentation_url"] = f"{BACKEND_URL}/static/results/{filename}"

            return jsonify(result_data)

        except Exception as e:
            print(f"Analysis Error: {e}")
            return jsonify({"error": "Processing failed"}), 500

    # ... [Rest of your report/patient endpoints remain the same] ...
    app.register_blueprint(auth, url_prefix="/api/auth")
    return app

app = create_app()

if __name__ == "__main__":
    # Use environment port for Railway
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)