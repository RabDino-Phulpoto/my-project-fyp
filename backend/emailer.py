import smtplib
from email.mime.text import MIMEText
from email.utils import formataddr
import os
from dotenv import load_dotenv

load_dotenv()

# ✅ Read SMTP settings
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER or "IADS Support <no-reply@iads.local>")

print("=" * 60)
print("📧 SMTP Configuration:")
print(f"  ✅ Host: {SMTP_HOST}")
print(f"  ✅ Port: {SMTP_PORT}")
print(f"  ✅ User: {SMTP_USER}")
print(f"  ✅ From: {SMTP_FROM}")
if not SMTP_PASS:
    print(f"  ❌ ERROR: SMTP_PASS is not set in .env")
else:
    print(f"  ✅ Password: {'*' * len(SMTP_PASS)}")
print("=" * 60)

def send_email(to_email: str, subject: str, html: str):
    """
    Sends an HTML email via Gmail SMTP using credentials in .env
    """
    if not SMTP_USER or not SMTP_PASS:
        error_msg = "❌ Missing SMTP_USER or SMTP_PASS in .env"
        print(error_msg)
        raise Exception(error_msg)

    msg = MIMEText(html, "html")

    # Properly format 'From' header
    name, addr = (SMTP_FROM.split(" ", 1) + [""])[:2]
    msg["From"] = formataddr((name.replace("<", "").replace(">", ""), addr.strip("<>") or SMTP_FROM))
    msg["To"] = to_email
    msg["Subject"] = subject

    try:
        print(f"\n📤 Attempting to send email to {to_email}")
        print(f"   From: {msg['From']}")
        print(f"   Subject: {subject}")
        
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
            server.set_debuglevel(1)  # Enable debug output
            print(f"   ✅ Connected to {SMTP_HOST}:{SMTP_PORT}")
            
            server.starttls()
            print(f"   ✅ TLS started")
            
            server.login(SMTP_USER, SMTP_PASS)
            print(f"   ✅ Authenticated as {SMTP_USER}")
            
            server.send_message(msg)
            print(f"✅ EMAIL SENT SUCCESSFULLY to {to_email}\n")
            
    except smtplib.SMTPAuthenticationError as e:
        error_msg = (
            f"❌ AUTHENTICATION FAILED: Gmail rejected the credentials.\n"
            f"   This usually means:\n"
            f"   1. SMTP_PASS in .env is wrong (NOT your Gmail password!)\n"
            f"   2. 2-Factor Authentication is enabled (required for App Passwords)\n"
            f"   3. You need to generate a Gmail App Password\n\n"
            f"   Error: {e}"
        )
        print(error_msg)
        raise Exception(error_msg)
        
    except smtplib.SMTPException as e:
        error_msg = f"❌ SMTP ERROR: {e}"
        print(error_msg)
        raise Exception(error_msg)
        
    except Exception as e:
        error_msg = f"❌ Email sending failed: {e}"
        print(error_msg)
        raise
