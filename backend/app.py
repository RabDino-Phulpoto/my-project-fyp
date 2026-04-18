import os
import cv2
import numpy as np
from flask import Flask, jsonify, request
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

    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://127.0.0.1:5173")
    CORS(
        app,
        resources={r"/*": {"origins": [FRONTEND_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    # Add preflight handler for OPTIONS requests
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            response = jsonify({"status": "ok"})
            response.headers.add("Access-Control-Allow-Origin", request.headers.get("Origin", "*"))
            response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
            response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
            response.headers.add("Access-Control-Allow-Credentials", "true")
            return response, 200

    @app.get("/")
    def root():
        return jsonify({"message": "IADS Flask Backend Running ✅"})

    @app.post("/api/analyze-scan")
    def analyze_scan():
        if 'image' not in request.files:
            return jsonify({"error": "No scan uploaded"}), 400

        file = request.files['image']
        
        try:
            # Read Original Image
            img_bytes = np.frombuffer(file.read(), np.uint8)
            original_img = cv2.imdecode(img_bytes, cv2.IMREAD_COLOR)
            
            # Prepare RGB version (3 channels)
            rgb_224 = cv2.resize(cv2.cvtColor(original_img, cv2.COLOR_BGR2RGB), (224, 224))
            input_rgb = np.expand_dims(rgb_224 / 255.0, axis=0)

            # Prepare Grayscale version (1 channel)
            gray_224 = cv2.resize(cv2.cvtColor(original_img, cv2.COLOR_BGR2GRAY), (224, 224))
            input_gray = gray_224.reshape(1, 224, 224, 1) / 255.0

            # --- STEP 1: CLASSIFICATION ---
            # We try RGB first, if it fails, we use Grayscale
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
                # Based on your error, seg_model MANDATORY needs Grayscale (1 channel)
                # This line solves the "expected axis -1 ... value 1" error
                mask = seg_model.predict(input_gray)[0]
                
                # Cleanup mask dimensions for saving
                if len(mask.shape) == 3:
                    mask = np.squeeze(mask, axis=-1)
                
                mask_visual = (mask * 255).astype(np.uint8)
                filename = f"seg_{file.filename}.png"
                save_path = os.path.join(RESULTS_DIR, filename)
                cv2.imwrite(save_path, mask_visual)
                
                result_data["segmentation_url"] = f"http://127.0.0.1:5000/static/results/{filename}"

            return jsonify(result_data)

        except Exception as e:
            print(f"Analysis Error: {e}")
            return jsonify({"error": "Model shape mismatch. Check grayscale/RGB settings."}), 500

    @app.post("/api/save-report")
    def save_report():
        """Save scan report to patient file"""
        data = request.get_json(force=True, silent=True) or {}
        
        patient_id = data.get("patientId")
        if not patient_id:
            return jsonify({"error": "Patient ID is required"}), 400
        
        try:
            # Get doctor ID from auth token - REQUIRED
            doctor_id = None
            auth_header = request.headers.get("Authorization", "")
            if auth_header.startswith("Bearer "):
                from utils import read_reset_token
                from db import users as users_collection
                
                token = auth_header.replace("Bearer ", "").strip()
                email = read_reset_token(token)
                if email:
                    user = users_collection.find_one({"email": email, "isRegistered": True})
                    if user:
                        doctor_id = str(user["_id"])
            
            if not doctor_id:
                return jsonify({"error": "Unauthorized - token required to save report"}), 401
            
            report = {
                "patientName": data.get("patientName"),
                "patientId": patient_id,
                "doctorId": doctor_id,
                "age": data.get("age"),
                "gender": data.get("gender"),
                "result": data.get("result"),
                "confidence": data.get("confidence"),
                "scanDate": data.get("scanDate"),
                "originalImagePath": data.get("originalImagePath"),
                "segmentedImagePath": data.get("segmentedImagePath"),
                "createdAt": now_utc()
            }
            
            # Save to database
            from db import reports
            result = reports.insert_one(report)
            
            print(f"✅ Report saved for patient {patient_id} by doctor {doctor_id}")
            return jsonify({
                "message": "Report saved successfully",
                "reportId": str(result.inserted_id)
            }), 201
            
        except Exception as e:
            print(f"❌ Error saving report: {e}")
            return jsonify({"error": f"Failed to save report: {str(e)}"}), 500

    @app.get("/api/reports")
    def get_reports():
        """Retrieve all scan reports for authenticated user only"""
        try:
            from db import reports, users
            from utils import read_reset_token
            
            # Get user from token
            auth_header = request.headers.get("Authorization", "")
            if not auth_header.startswith("Bearer "):
                return jsonify({"error": "Missing auth header"}), 401

            token = auth_header.replace("Bearer ", "").strip()
            email = read_reset_token(token)
            if not email:
                return jsonify({"error": "Invalid or expired token"}), 401

            user = users.find_one({"email": email, "isRegistered": True})
            if not user:
                return jsonify({"error": "User not found"}), 404
            
            user_id = str(user["_id"])
            
            # Get query parameters
            search = request.args.get("search", "").lower()
            filter_type = request.args.get("filter", "all")  # all, positive, negative
            
            # Build query - filter by doctorId
            query = {"doctorId": user_id}
            if search:
                query["$or"] = [
                    {"patientName": {"$regex": search, "$options": "i"}},
                    {"patientId": {"$regex": search, "$options": "i"}},
                ]
            if filter_type in ["positive", "negative"]:
                query["result"] = filter_type.capitalize()
            
            # Get reports
            all_reports = list(reports.find(query).sort("createdAt", -1))
            
            # Convert ObjectId to string for JSON serialization
            for report in all_reports:
                report["_id"] = str(report["_id"])
            
            print(f"✅ Retrieved {len(all_reports)} reports for user {user_id}")
            return jsonify(all_reports), 200
            
        except Exception as e:
            print(f"❌ Error retrieving reports: {e}")
            return jsonify({"error": f"Failed to retrieve reports: {str(e)}"}), 500

    @app.get("/api/patients")
    def get_patients():
        """Retrieve all patients for authenticated user only"""
        try:
            from db import reports, users
            from utils import read_reset_token
            
            # Get user from token
            auth_header = request.headers.get("Authorization", "")
            if not auth_header.startswith("Bearer "):
                return jsonify({"error": "Missing auth header"}), 401

            token = auth_header.replace("Bearer ", "").strip()
            email = read_reset_token(token)
            if not email:
                return jsonify({"error": "Invalid or expired token"}), 401

            user = users.find_one({"email": email, "isRegistered": True})
            if not user:
                return jsonify({"error": "User not found"}), 404
            
            user_id = str(user["_id"])
            
            # Get unique patients from reports - filtered by doctorId
            pipeline = [
                {"$match": {"doctorId": user_id}},
                {
                    "$group": {
                        "_id": "$patientId",
                        "patientName": {"$first": "$patientName"},
                        "age": {"$first": "$age"},
                        "gender": {"$first": "$gender"},
                        "totalScans": {"$sum": 1},
                        "lastScan": {"$max": "$createdAt"},
                    }
                },
                {"$sort": {"lastScan": -1}},
            ]
            
            patients = list(reports.aggregate(pipeline))
            
            print(f"✅ Retrieved {len(patients)} unique patients for user {user_id}")
            return jsonify(patients), 200
            
        except Exception as e:
            print(f"❌ Error retrieving patients: {e}")
            return jsonify({"error": f"Failed to retrieve patients: {str(e)}"}), 500

    @app.put("/api/patients/<patient_id>")
    def update_patient(patient_id):
        """Update patient information (name, age, gender) - only for patient's doctor"""
        try:
            from db import reports, users
            from utils import read_reset_token
            
            # Get user from token
            auth_header = request.headers.get("Authorization", "")
            if not auth_header.startswith("Bearer "):
                return jsonify({"error": "Missing auth header"}), 401

            token = auth_header.replace("Bearer ", "").strip()
            email = read_reset_token(token)
            if not email:
                return jsonify({"error": "Invalid or expired token"}), 401

            user = users.find_one({"email": email, "isRegistered": True})
            if not user:
                return jsonify({"error": "User not found"}), 404
            
            user_id = str(user["_id"])
            
            # Verify user owns this patient
            patient_report = reports.find_one({"patientId": patient_id})
            if not patient_report:
                return jsonify({"error": "Patient not found"}), 404
            
            if patient_report.get("doctorId") != user_id:
                return jsonify({"error": "Unauthorized - patient does not belong to you"}), 403
            
            # Get JSON data with force=True to ensure parsing
            try:
                data = request.get_json(force=True, silent=True)
            except Exception:
                data = None
            
            print(f"📥 Received update request for patient: {patient_id} by user {user_id}")
            print(f"📥 Request data: {data}")
            
            if not data:
                print(f"❌ No data provided in request body")
                return jsonify({"error": "No data provided"}), 400
            
            # Prepare update data
            update_fields = {}
            if "patientName" in data and data["patientName"]:
                update_fields["patientName"] = data["patientName"]
            if "age" in data and data["age"]:
                update_fields["age"] = data["age"]
            if "gender" in data and data["gender"]:
                update_fields["gender"] = data["gender"]
            
            print(f"📝 Update fields: {update_fields}")
            
            if not update_fields:
                print(f"❌ No valid fields to update")
                return jsonify({"error": "No valid fields to update"}), 400
            
            # Update all reports for this patient (only for this user)
            result = reports.update_many(
                {"patientId": patient_id, "doctorId": user_id},
                {"$set": update_fields}
            )
            
            print(f"✅ Updated patient {patient_id}: modified {result.modified_count} reports")
            return jsonify({
                "message": "Patient updated successfully",
                "modifiedCount": result.modified_count
            }), 200
            
        except Exception as e:
            print(f"❌ Error updating patient: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({"error": f"Failed to update patient: {str(e)}"}), 500

    @app.delete("/api/patients/<patient_id>")
    def delete_patient(patient_id):
        """Delete a patient and all their associated reports - only for patient's doctor"""
        try:
            from db import reports, users
            from utils import read_reset_token
            
            # Get user from token
            auth_header = request.headers.get("Authorization", "")
            if not auth_header.startswith("Bearer "):
                return jsonify({"error": "Missing auth header"}), 401

            token = auth_header.replace("Bearer ", "").strip()
            email = read_reset_token(token)
            if not email:
                return jsonify({"error": "Invalid or expired token"}), 401

            user = users.find_one({"email": email, "isRegistered": True})
            if not user:
                return jsonify({"error": "User not found"}), 404
            
            user_id = str(user["_id"])
            
            # Verify user owns this patient
            patient_report = reports.find_one({"patientId": patient_id})
            if not patient_report:
                return jsonify({"error": "Patient not found"}), 404
            
            if patient_report.get("doctorId") != user_id:
                return jsonify({"error": "Unauthorized - patient does not belong to you"}), 403
            
            print(f"🗑️  Received delete request for patient: {patient_id} by user {user_id}")
            
            # Delete all reports for this patient (only for this user)
            result = reports.delete_many({"patientId": patient_id, "doctorId": user_id})
            
            print(f"✅ Deleted patient {patient_id}: removed {result.deleted_count} reports")
            return jsonify({
                "message": "Patient deleted successfully",
                "deletedCount": result.deleted_count
            }), 200
            
        except Exception as e:
            print(f"❌ Error deleting patient: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({"error": f"Failed to delete patient: {str(e)}"}), 500

    @app.get("/api/user-stats")
    def get_user_stats():
        """Get statistics for authenticated user's scans"""
        try:
            from db import reports, users
            from utils import read_reset_token
            
            # Get user from token
            auth_header = request.headers.get("Authorization", "")
            if not auth_header.startswith("Bearer "):
                return jsonify({"error": "Missing auth header"}), 401

            token = auth_header.replace("Bearer ", "").strip()
            email = read_reset_token(token)
            if not email:
                return jsonify({"error": "Invalid or expired token"}), 401

            user = users.find_one({"email": email, "isRegistered": True})
            if not user:
                return jsonify({"error": "User not found"}), 404
            
            user_id = str(user["_id"])
            
            # Get statistics
            user_reports = list(reports.find({"doctorId": user_id}))
            
            total_scans = len(user_reports)
            positive_scans = len([r for r in user_reports if r.get("result") == "Positive"])
            negative_scans = len([r for r in user_reports if r.get("result") == "Negative"])
            average_confidence = 0
            if user_reports:
                confidences = [r.get("confidence", 0) for r in user_reports if r.get("confidence")]
                average_confidence = sum(confidences) / len(confidences) if confidences else 0
            
            # Get recent scans (last 5)
            recent_scans = sorted(user_reports, key=lambda x: x.get("createdAt", ""), reverse=True)[:5]
            
            stats = {
                "totalScans": total_scans,
                "positiveScans": positive_scans,
                "negativeScans": negative_scans,
                "averageConfidence": round(average_confidence, 2),
                "recentScans": [
                    {
                        "_id": str(r.get("_id")),
                        "patientName": r.get("patientName"),
                        "patientId": r.get("patientId"),
                        "result": r.get("result"),
                        "confidence": r.get("confidence"),
                        "createdAt": r.get("createdAt").isoformat() if r.get("createdAt") else None
                    }
                    for r in recent_scans
                ]
            }
            
            return jsonify(stats), 200
        except Exception as e:
            print(f"❌ Error retrieving user stats: {e}")
            return jsonify({"error": f"Failed to retrieve stats: {str(e)}"}), 500

    @app.get("/api/user-reports")
    def get_user_reports():
        """Get all reports for authenticated user"""
        try:
            from db import reports, users
            from utils import read_reset_token
            
            # Get user from token
            auth_header = request.headers.get("Authorization", "")
            if not auth_header.startswith("Bearer "):
                return jsonify({"error": "Missing auth header"}), 401

            token = auth_header.replace("Bearer ", "").strip()
            email = read_reset_token(token)
            if not email:
                return jsonify({"error": "Invalid or expired token"}), 401

            user = users.find_one({"email": email, "isRegistered": True})
            if not user:
                return jsonify({"error": "User not found"}), 404
            
            user_id = str(user["_id"])
            
            # Get pagination parameters
            page = int(request.args.get("page", 1))
            limit = int(request.args.get("limit", 10))
            skip = (page - 1) * limit
            
            # Get filter
            result_filter = request.args.get("filter", "all")
            
            # Build query
            query = {"doctorId": user_id}
            if result_filter in ["positive", "negative"]:
                query["result"] = result_filter.capitalize()
            
            # Get total count
            total = reports.count_documents(query)
            
            # Get reports
            user_reports = list(
                reports.find(query)
                .sort("createdAt", -1)
                .skip(skip)
                .limit(limit)
            )
            
            # Convert ObjectId to string
            for report in user_reports:
                report["_id"] = str(report["_id"])
            
            return jsonify({
                "reports": user_reports,
                "pagination": {
                    "page": page,
                    "limit": limit,
                    "total": total,
                    "pages": (total + limit - 1) // limit
                }
            }), 200
        except Exception as e:
            print(f"❌ Error retrieving user reports: {e}")
            return jsonify({"error": f"Failed to retrieve reports: {str(e)}"}), 500

    # Register auth blueprint with /api/auth prefix
    app.register_blueprint(auth, url_prefix="/api/auth")
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, use_reloader=False)