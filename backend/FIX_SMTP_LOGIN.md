# 🔧 Fix: OTP Email & Login Issues

## Problem Summary

1. ❌ **OTP Send Failed** - Gmail SMTP authentication error
2. ❌ **Login Failing** - Email not verified or password mismatch

---

## 🚀 Solution: Fix Gmail SMTP

Your current `.env` has an **invalid SMTP password**. You need a **Gmail App Password**, NOT your regular Gmail password.

### **Step 1: Enable 2-Factor Authentication on Gmail**

1. Go to: https://myaccount.google.com/security
2. Click **"2-Step Verification"** on the left
3. Follow the steps to enable it
4. You'll need to verify with your phone

### **Step 2: Create Gmail App Password**

1. After 2FA is enabled, go to: https://myaccount.google.com/apppasswords
2. Select:
   - **App:** Mail
   - **Device:** Windows/Mac (or your device)
3. Google will generate a **16-character password**
4. Copy it (it looks like: `abcd efgh ijkl mnop`)

### **Step 3: Update .env File**

Replace the old password with the new App Password:

```env
# MongoDB Atlas connection
MONGO_URI=mongodb+srv://iads02026_db_user:t0GrWPWRXyLAviYM@cluster0.7j9yjva.mongodb.net/iads?appName=Cluster0

# === Gmail SMTP ===
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=iads.02026@gmail.com
SMTP_PASS=YOUR_16_CHAR_APP_PASSWORD_HERE  ← REPLACE THIS!
SMTP_FROM=IADS Support <iads.02026@gmail.com>
```

**Example** (remove spaces from the 16-char password):
```env
SMTP_PASS=abcdefghijklmnop
```

### **Step 4: Restart Flask Backend**

```bash
cd backend
venv\Scripts\activate
python app.py
```

You should see:
```
✅ SMTP Configuration:
  ✅ Host: smtp.gmail.com
  ✅ Port: 587
  ✅ User: iads.02026@gmail.com
  ✅ Password: ****...
```

---

## 🧪 Test Email Sending

### **In Browser Console** (F12):

```javascript
// Test registration OTP
await fetch('http://127.0.0.1:5000/auth/register-start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'your-email@gmail.com'
  })
})
.then(r => r.json())
.then(d => console.log(d))
```

Should show:
```json
{ "message": "OTP sent to your email" }
```

Check your email inbox for the OTP!

---

## 🔍 Common Issues & Solutions

### **Issue 1: Still getting "Failed to send OTP"**

**Solution:**
1. Check backend logs for detailed error message
2. Verify App Password has NO SPACES
3. Make sure 2FA is actually enabled
4. Try a different email address
5. Wait 5 minutes and try again (Google rate limits)

### **Issue 2: "Invalid email or password" on login**

This happens when:
- ✅ User registered but email OTP wasn't verified
- ✅ Password wasn't hashed correctly during registration
- ✅ Database doesn't have `emailVerified: true`

**Solution:**
1. Create a NEW account (complete the OTP verification)
2. Check backend console for errors
3. Try a different email address
4. Make sure you completed BOTH registration steps:
   - Step 1: Register with email (enter OTP)
   - Step 2: Confirm password (creates account)

### **Issue 3: OTP not arriving in email**

**Check:**
1. Spam/Junk folder
2. Backend console for "EMAIL SENT SUCCESSFULLY" message
3. Try a different email
4. Check if Gmail is blocking the send

---

## ✅ Complete Workflow (After Fixes)

```
1. Register Start
   └─ Enter name + email
   └─ ✅ OTP sent to email
   
2. Enter OTP
   └─ Check email, copy OTP
   └─ Enter OTP + password
   
3. Account Created ✅
   └─ emailVerified = true
   
4. Login
   └─ Enter email + password
   └─ ✅ Token generated
   └─ Redirect to Dashboard
```

---

## 📞 Debugging

### **Backend shows detailed errors now:**

Run backend and look for:
```
📤 Attempting to send email to user@example.com
   From: IADS Support <iads.02026@gmail.com>
   Subject: Your IADS verification code
   ✅ Connected to smtp.gmail.com:587
   ✅ TLS started
   ✅ Authenticated as iads.02026@gmail.com
✅ EMAIL SENT SUCCESSFULLY
```

If you see an error, it will show exactly what went wrong!

---

## 🎯 Next Steps

1. ✅ Get Gmail App Password from https://myaccount.google.com/apppasswords
2. ✅ Update `.env` with new password
3. ✅ Restart Flask: `python app.py`
4. ✅ Try registering again
5. ✅ Check your email for OTP
6. ✅ Complete registration
7. ✅ Login with your account
8. ✅ Access the dashboard!

---

**You got this! 🚀** The fixes are in place. Just get that App Password and you'll be all set!
