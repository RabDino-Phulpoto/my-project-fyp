import os
import bcrypt
import secrets
import string
import datetime as dt
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from dotenv import load_dotenv

load_dotenv()

# ✅ Initialize serializer for password reset tokens
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-in-production")
serializer = URLSafeTimedSerializer(SECRET_KEY)

# =====================================
# 🔐 PASSWORD HASHING & VERIFICATION
# =====================================
def hash_password(plain: str) -> str:
    """Hash password using bcrypt with UTF-8 encoding"""
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def check_password(plain: str, hashed_str: str) -> bool:
    """Verify password against hash"""
    try:
        if not hashed_str:
            return False
        return bcrypt.checkpw(plain.encode("utf-8"), hashed_str.encode("utf-8"))
    except Exception as e:
        print(f"❌ Password check error: {e}")
        return False

# =====================================
# 🔑 PASSWORD RESET TOKENS
# =====================================
def make_reset_token(email: str) -> str:
    """Create a signed, time-limited token for password reset"""
    return serializer.dumps(email, salt="pw-reset")

def read_reset_token(token: str, max_age_seconds: int = 604800) -> str | None:
    """Verify and extract email from password reset token (7 days default)"""
    try:
        return serializer.loads(token, salt="pw-reset", max_age=max_age_seconds)
    except (BadSignature, SignatureExpired):
        return None

# =====================================
# 🔑 OTP GENERATION & VERIFICATION
# =====================================
def generate_otp(n: int = 6) -> str:
    """Generate numeric OTP"""
    return "".join(secrets.choice(string.digits) for _ in range(n))

def hash_otp(otp: str) -> str:
    """Hash OTP using bcrypt"""
    return bcrypt.hashpw(otp.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def check_otp(otp: str, hashed: str) -> bool:
    """Verify OTP against hash"""
    try:
        if not hashed:
            return False
        return bcrypt.checkpw(otp.encode("utf-8"), hashed.encode("utf-8"))
    except Exception as e:
        print(f"❌ OTP check error: {e}")
        return False

# =====================================
# ⏰ TIME UTILITIES
# =====================================
def now_utc():
    """Get current UTC time"""
    return dt.datetime.utcnow()

def plus_minutes(m: int):
    """Get UTC time + m minutes"""
    return now_utc() + dt.timedelta(minutes=m)
