from flask import Blueprint, request, jsonify
from db import users
from utils import hash_password, check_password, generate_otp, hash_otp, check_otp, now_utc, plus_minutes, make_reset_token, read_reset_token
from emailer import send_email
import re

auth = Blueprint("auth", __name__)

def validate_name(name: str) -> tuple[bool, str]:
    if not name or len(name.strip()) < 2:
        return False, "Full name must be at least 2 characters"
    if not re.match(r"^[a-zA-Z\s]+$", name.strip()):
        return False, "Full name must contain only letters and spaces"
    return True, ""

def validate_email(email: str) -> tuple[bool, str]:
    if not email:
        return False, "Email is required"
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if not re.match(pattern, email):
        return False, "Invalid email format"
    return True, ""

def validate_mobile(mobile: str) -> tuple[bool, str]:
    if not mobile:
        return False, "Mobile number is required"
    clean = mobile.replace("-", "").strip()
    if not re.match(r"^03\d{9}$", clean):
        return False, "Mobile must be 0300-0000000 format"
    return True, ""

def validate_password(password: str) -> tuple[bool, str]:
    if not password or len(password) < 8:
        return False, "Password must be at least 8 characters"
    if not re.search(r"[a-z]", password):
        return False, "Password must contain lowercase"
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain uppercase"
    if not re.search(r"[0-9]", password):
        return False, "Password must contain numbers"
    if not re.search(r"[!@#$%^&*()_+\-=\[\]{};:',.<>?]", password):
        return False, "Password must contain special characters"
    return True, ""

@auth.post("/send-otp")
def send_otp():
    try:
        data = request.get_json()
        full_name = data.get("fullName", "").strip()
        email = data.get("email", "").strip()

        valid, msg = validate_name(full_name)
        if not valid:
            return jsonify({"error": msg}), 400

        valid, msg = validate_email(email)
        if not valid:
            return jsonify({"error": msg}), 400

        if users.find_one({"email": email, "isRegistered": True}):
            return jsonify({"error": "Email already registered"}), 409

        otp = generate_otp(6)
        otp_record = {
            "email": email,
            "fullName": full_name,
            "hashedOtp": hash_otp(otp),
            "otpExpiry": plus_minutes(10),
            "otpVerified": False,
            "isRegistered": False,
            "createdAt": now_utc()
        }

        users.update_one({"email": email, "isRegistered": False}, {"$set": otp_record}, upsert=True)
        html = f"<html><body><h2>Email Verification</h2><p>Hi {full_name},</p><p>Your OTP: <h1>{otp}</h1></p><p>Expires in 10 minutes</p></body></html>"
        send_email(email, "IADS Email Verification - OTP", html)

        return jsonify({"message": "OTP sent", "email": email, "expiresIn": 600}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Failed to send OTP"}), 500

@auth.post("/verify-otp")
def verify_otp():
    try:
        data = request.get_json()
        email = data.get("email", "").strip()
        otp = data.get("otp", "").strip()

        if not email or not otp:
            return jsonify({"error": "Email and OTP required"}), 400

        otp_rec = users.find_one({"email": email, "isRegistered": False})
        if not otp_rec:
            return jsonify({"error": "No OTP request found"}), 404

        if otp_rec.get("otpExpiry") < now_utc():
            return jsonify({"error": "OTP expired"}), 400

        if not check_otp(otp, otp_rec.get("hashedOtp", "")):
            return jsonify({"error": "Invalid OTP"}), 401

        users.update_one({"email": email}, {"$set": {"otpVerified": True, "otpVerifiedAt": now_utc()}})
        return jsonify({"message": "OTP verified", "otpVerified": True}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Failed to verify OTP"}), 500

@auth.post("/register")
def register():
    try:
        data = request.get_json()
        pmdc_id = data.get("pmdcId", "").strip()
        full_name = data.get("fullName", "").strip()
        email = data.get("email", "").strip()
        mobile = data.get("mobile", "").strip()
        password = data.get("password", "").strip()

        if not pmdc_id:
            return jsonify({"error": "PMDC ID required"}), 400

        valid, msg = validate_name(full_name)
        if not valid:
            return jsonify({"error": msg}), 400

        valid, msg = validate_email(email)
        if not valid:
            return jsonify({"error": msg}), 400

        valid, msg = validate_mobile(mobile)
        if not valid:
            return jsonify({"error": msg}), 400

        valid, msg = validate_password(password)
        if not valid:
            return jsonify({"error": msg}), 400

        otp_rec = users.find_one({"email": email})
        if not otp_rec or not otp_rec.get("otpVerified"):
            return jsonify({"error": "Verify email with OTP first"}), 400

        if otp_rec.get("isRegistered"):
            return jsonify({"error": "Email already registered"}), 409

        if users.find_one({"email": email, "isRegistered": True}):
            return jsonify({"error": "Email in use"}), 409

        user_doc = {
            "pmdcId": pmdc_id,
            "fullName": full_name,
            "email": email,
            "mobile": mobile,
            "password": hash_password(password),
            "emailVerified": True,
            "isRegistered": True,
            "createdAt": now_utc(),
            "updatedAt": now_utc(),
            "lastLogin": None,
            "isActive": True
        }

        result = users.update_one({"email": email}, {"$set": user_doc}, upsert=True)
        return jsonify({"message": "Registration successful", "email": email, "userId": str(result.upserted_id if result.upserted_id else otp_rec["_id"])}), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Registration failed"}), 500
@auth.post("/login")
def login():
    """Login endpoint - authenticate with email and password"""
    try:
        data = request.get_json()
        email = (data.get("email") or "").lower().strip()
        password = data.get("password") or ""

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # Find user in database
        user = users.find_one({"email": email})
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        # Check if email is verified
        if not user.get("emailVerified"):
            return jsonify({"error": "Please verify your email first"}), 403

        # Check password
        if not check_password(password, user.get("password", "")):
            return jsonify({"error": "Invalid email or password"}), 401

        # Generate token
        token = make_reset_token(email)

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "fullName": user.get("fullName"),
                "email": user.get("email"),
                "pmdcId": user.get("pmdcId")
            }
        }), 200
    except Exception as e:
        print(f"Login Error: {e}")
        return jsonify({"error": "Login failed"}), 500

@auth.get("/me")
def get_current_user():
    try:
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing auth header"}), 401

        token = auth_header.replace("Bearer ", "").strip()
        if not token:
            return jsonify({"error": "No token"}), 401

        # Deserialize token to get email
        email = read_reset_token(token)
        if not email:
            return jsonify({"error": "Invalid or expired token"}), 401

        # Find user by email
        user = users.find_one({"email": email, "isRegistered": True})
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "userId": str(user["_id"]),
            "pmdcId": user.get("pmdcId"),
            "fullName": user.get("fullName"),
            "email": user.get("email"),
            "mobile": user.get("mobile"),
            "createdAt": user.get("createdAt").isoformat() if user.get("createdAt") else None,
            "lastLogin": user.get("lastLogin").isoformat() if user.get("lastLogin") else None
        }), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Failed to retrieve user"}), 500

@auth.post("/forgot-password")
def forgot_password():
    """Send OTP for password reset"""
    try:
        data = request.get_json()
        email = (data.get("email") or "").lower().strip()

        if not email:
            return jsonify({"error": "Email is required"}), 400

        user = users.find_one({"email": email, "isRegistered": True})
        if not user:
            return jsonify({"error": "Email not found"}), 404

        otp = generate_otp(6)
        otp_record = {
            "email": email,
            "hashedOtp": hash_otp(otp),
            "otpExpiry": plus_minutes(10),
            "otpVerified": False,
            "type": "password_reset",
            "createdAt": now_utc()
        }

        users.update_one({"email": email}, {"$set": otp_record}, upsert=True)
        html = f"<html><body><h2>Password Reset Request</h2><p>Your OTP: <h1>{otp}</h1></p><p>Expires in 10 minutes</p></body></html>"
        send_email(email, "IADS Password Reset - OTP", html)

        return jsonify({"message": "OTP sent to your email", "expiresIn": 600}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Failed to send OTP"}), 500

@auth.post("/forgot-verify-otp")
def forgot_verify_otp():
    """Verify OTP for password reset"""
    try:
        data = request.get_json()
        email = (data.get("email") or "").lower().strip()
        otp = data.get("otp", "").strip()

        if not email or not otp:
            return jsonify({"error": "Email and OTP required"}), 400

        otp_rec = users.find_one({"email": email, "type": "password_reset"})
        if not otp_rec:
            return jsonify({"error": "No OTP request found"}), 404

        if otp_rec.get("otpExpiry") < now_utc():
            return jsonify({"error": "OTP expired"}), 400

        if not check_otp(otp, otp_rec.get("hashedOtp", "")):
            return jsonify({"error": "Invalid OTP"}), 401

        users.update_one({"email": email}, {"$set": {"otpVerified": True, "otpVerifiedAt": now_utc()}})
        return jsonify({"message": "OTP verified", "otpVerified": True}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Failed to verify OTP"}), 500

@auth.post("/reset-password")
def reset_password_endpoint():
    """Reset password using token or OTP verification"""
    try:
        data = request.get_json()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "").strip()
        token = data.get("token", "").strip()

        if not password:
            return jsonify({"error": "Password is required"}), 400

        valid, msg = validate_password(password)
        if not valid:
            return jsonify({"error": msg}), 400

        # If token is provided, decode it to get email
        if token:
            try:
                decoded_email = read_reset_token(token)
                email = decoded_email.lower().strip()
            except:
                return jsonify({"error": "Invalid or expired token"}), 401

        if not email:
            return jsonify({"error": "Email is required"}), 400

        user = users.find_one({"email": email, "isRegistered": True})
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Check if OTP was verified (for forgot password flow)
        if not token and not user.get("otpVerified"):
            return jsonify({"error": "Please verify OTP first"}), 400

        # Update password
        users.update_one(
            {"email": email},
            {"$set": {"password": hash_password(password), "updatedAt": now_utc()}}
        )

        return jsonify({"message": "Password reset successful"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Failed to reset password"}), 500

@auth.post("/change-password")
def change_password():
    """Change password for authenticated user"""
    try:
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

        data = request.get_json()
        old_password = data.get("oldPassword", "").strip()
        new_password = data.get("newPassword", "").strip()

        if not old_password or not new_password:
            return jsonify({"error": "Both old and new passwords are required"}), 400

        # Verify old password
        if not check_password(old_password, user.get("password", "")):
            return jsonify({"error": "Current password is incorrect"}), 401

        # Validate new password
        valid, msg = validate_password(new_password)
        if not valid:
            return jsonify({"error": msg}), 400

        # Update password
        users.update_one(
            {"email": email},
            {"$set": {"password": hash_password(new_password), "updatedAt": now_utc()}}
        )

        print(f"✅ Password changed for user: {email}")
        return jsonify({"message": "Password changed successfully"}), 200
    except Exception as e:
        print(f"❌ Error changing password: {e}")
        return jsonify({"error": "Failed to change password"}), 500
