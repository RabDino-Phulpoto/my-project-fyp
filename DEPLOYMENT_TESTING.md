# Deployment & Testing Instructions

## 📋 Pre-Deployment Checklist

- [ ] Backup MongoDB database (just in case)
- [ ] Have access to 2+ test user accounts (created via registration)
- [ ] Backend server is not running (will restart it)
- [ ] Browser DevTools open (to monitor network requests)

---

## 🚀 Deployment Steps

### Step 1: Stop the Current Backend
```bash
# In the backend terminal window, press Ctrl+C to stop Flask
Ctrl+C

# Wait for: "Shutting down..." message
```

### Step 2: Verify Changes are Applied
The changes have already been made to `backend/app.py`. The following endpoints now require authentication:
- ✅ GET /api/patients
- ✅ GET /api/reports  
- ✅ PUT /api/patients/:id
- ✅ DELETE /api/patients/:id
- ✅ POST /api/save-report

### Step 3: Restart the Backend
```bash
# Navigate to backend directory
cd backend

# Run the Flask app
python app.py

# You should see:
# ✅ Successfully connected to Local MongoDB (Compass)
# 🚀 Flask app running on http://127.0.0.1:5000
```

### Step 4: Verify Frontend is Running
In a separate terminal:
```bash
# Navigate to frontend directory  
cd frontend

# If not already running, start it:
npm run dev

# You should see:
# ✅ VITE v... ready in ... ms
# ➜ Local: http://localhost:5173
```

---

## 🧪 Testing Phase 1: Single User

### Objective
Verify that a single doctor can see their own patients.

### Test Steps
1. Open browser to `http://localhost:5173`
2. Click "Login"
3. Enter credentials for **Doctor A** (or create new account via Register)
4. Should see dashboard with "Welcome, [Doctor A name]"
5. Click "Patient Management" in sidebar
6. Should be empty or show only Doctor A's previous patients
7. Open browser DevTools (F12) → Network tab
8. Click on network request to `GET /api/patients`
9. Should see Response has Authorization header with token
10. Response body should contain ONLY Doctor A's patients (empty if no patients created yet)

### Expected Result ✅
- Doctor A can see their dashboard
- Patient Management page loads
- No errors in console
- Network request succeeds with 200 status

---

## 🧪 Testing Phase 2: Create Test Data

### Step 1: Doctor A - Create a Patient
1. Still logged in as **Doctor A**
2. Go to "Upload Scan" (or upload page)
3. Fill patient details:
   - Patient Name: `TestPatient_DocA`
   - Age: `45`
   - Gender: `Male`
4. Upload a test image (use any medical image)
5. Wait for analysis result
6. Result page should show and have "Save" button
7. Click "Save Report"
8. Wait for confirmation "Report saved successfully"
9. Go back to "Patient Management"
10. Should now see `TestPatient_DocA` in the list

### Expected Result ✅
- Report saved without errors
- Patient appears in Doctor A's patient list
- Patient ID is auto-generated

### Step 2: Doctor A - Note Patient Details
- Patient Name: `TestPatient_DocA`
- Patient ID: `[write it down]`
- Copy this - you'll need it for testing

---

## 🧪 Testing Phase 3: Switch to Doctor B

### Step 1: Logout Doctor A
1. Click user profile icon (top right)
2. Click "Logout"
3. Should redirect to login page

### Step 2: Login as Doctor B
1. On login page, enter **Doctor B** credentials
2. Should see different dashboard with "Welcome, [Doctor B name]"

### Step 3: Check Patient Management
1. Click "Patient Management" in sidebar
2. **IMPORTANT**: `TestPatient_DocA` should **NOT** appear here ✅
3. If you see it, the fix didn't work properly

### Step 4: Open DevTools and Monitor
1. Press F12 to open DevTools
2. Go to Network tab
3. Click refresh or navigate to Patient Management
4. Look for request to `/api/patients`
5. Check Response:
   - Should be `[]` (empty array) or only have Doctor B's patients
   - Should NOT have `TestPatient_DocA`

### Expected Result ✅
- Doctor B's patient list is separate from Doctor A
- `TestPatient_DocA` is NOT visible
- Network response shows filtered data
- No console errors

---

## 🧪 Testing Phase 4: Doctor B Creates Own Patient

1. Still logged in as Doctor B
2. Go to "Upload Scan"
3. Fill details:
   - Patient Name: `TestPatient_DocB`
   - Age: `50`
   - Gender: `Female`
4. Upload image and save report
5. Go to "Patient Management"
6. Should see ONLY `TestPatient_DocB` ✅

---

## 🧪 Testing Phase 5: Authorization Verification

### Test 5A: Doctor A - Cannot Access Doctor B's Patient
1. Go back to login
2. Login as **Doctor A**
3. Go to "Patient Management"
4. Should see ONLY `TestPatient_DocA` ✅
5. Should NOT see `TestPatient_DocB` ✅

### Test 5B: Try to Manually Access Other Doctor's Patient
1. Open browser console (F12 → Console tab)
2. Get Doctor B's patient ID (from previous testing)
3. Run this command:
```javascript
// Try to fetch Doctor B's patient while logged in as Doctor A
fetch('http://127.0.0.1:5000/api/patients', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(data => console.log(data))
```
4. Response should show ONLY Doctor A's patients ✅

### Test 5C: Try to Update Other Doctor's Patient
1. Still in console as Doctor A:
```javascript
// Try to update Doctor B's patient
const doctorB_patientId = "[Patient ID from Step 4]";
fetch(`http://127.0.0.1:5000/api/patients/${doctorB_patientId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    patientName: 'Hacked Name',
    age: 99
  })
})
.then(r => r.json())
.then(data => console.log(data))
```
5. Response should show:
```json
{
  "error": "Unauthorized - patient does not belong to you"
}
```
Status: **403** ✅

### Test 5D: Try to Delete Other Doctor's Patient
1. Still in console as Doctor A:
```javascript
const doctorB_patientId = "[Patient ID from Step 4]";
fetch(`http://127.0.0.1:5000/api/patients/${doctorB_patientId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(data => console.log(data))
```
5. Response should show:
```json
{
  "error": "Unauthorized - patient does not belong to you"
}
```
Status: **403** ✅

---

## 🔍 Advanced Testing (Optional)

### Test 6: Token Expiration
1. Logout
2. Go to console
3. `localStorage.clear()` - Clear all stored data
4. Try to access Patient Management
5. Should redirect to login ✅

### Test 7: Multiple Reports for Same Patient
1. Login as Doctor A
2. Upload the SAME patient (`TestPatient_DocA`) with different scans
3. Go to Patient Management
4. `TestPatient_DocA` should still appear once (not duplicated) ✅
5. But Total Scans should increase (2, 3, etc.) ✅

### Test 8: Report History
1. Still logged in as Doctor A
2. Click "Report History"
3. Should see ONLY Doctor A's reports ✅
4. Should NOT see Doctor B's reports ✅

---

## ✅ Test Success Criteria

| Test | Expected Result | Status |
|------|-----------------|--------|
| Doctor A sees own patients | ✓ Appears | ☐ Pass |
| Doctor A sees Doctor B's patients | ✗ NOT visible | ☐ Pass |
| Doctor B sees own patients | ✓ Appears | ☐ Pass |
| Doctor B sees Doctor A's patients | ✗ NOT visible | ☐ Pass |
| Doctor A cannot update Doctor B's patient | 403 Unauthorized | ☐ Pass |
| Doctor A cannot delete Doctor B's patient | 403 Unauthorized | ☐ Pass |
| Reports filtered by user | Only user's reports | ☐ Pass |
| Patient Management shows correct count | Matches created patients | ☐ Pass |

---

## ❌ If Tests Fail

### Issue: Doctor A sees Doctor B's patients
**Solution:**
1. Check if both users have same `doctorId` in database
2. Verify token is being extracted correctly:
   ```python
   # Add this to backend for debugging
   print(f"Email: {email}, User ID: {user_id}")
   ```
3. Check MongoDB: `reports.find({doctorId: "actual_doctor_id"})`

### Issue: 401 Unauthorized Error
**Solution:**
1. Make sure you're logged in
2. Check localStorage: `localStorage.getItem('token')` in console
3. If empty, login again
4. Make sure token is being sent with each request

### Issue: 500 Error
**Solution:**
1. Check Flask backend console for error message
2. Look for Python exception traceback
3. Verify MongoDB connection is working
4. Make sure `users` and `reports` collections exist

### Issue: Empty Patient List
**Solution:**
1. Create a new patient first (upload a scan)
2. Wait for "Report saved successfully" message
3. Refresh the page
4. Try again

---

## 📊 Monitoring Checklist

While testing, monitor these:

### Browser Console (F12 → Console)
- ✓ No red errors
- ✓ Network requests succeed (200, 201, 403 expected)
- ✓ No auth token warnings

### Backend Console
- ✓ No Python exceptions
- ✓ Should see: `✅ Retrieved X patients for user [user_id]`
- ✓ Should see: `✅ Retrieved X reports for user [user_id]`

### Network Tab (F12 → Network)
- ✓ All requests have `Authorization: Bearer ...` header
- ✓ Status codes: 200, 201, 403 (not 500)
- ✓ Responses contain filtered data

---

## 📝 Documentation Files

For more information, see:
- `DATA_ISOLATION_FIX.md` - Complete technical details
- `BEFORE_AFTER_COMPARISON.md` - Visual comparison
- `QUICK_TEST_GUIDE.md` - Quick reference

---

## ✨ Final Verification

Once all tests pass:

```
✅ Data is now isolated per doctor
✅ Each doctor sees ONLY their patients  
✅ Cross-user access is blocked (403)
✅ Unauthorized modifications are prevented
✅ System is HIPAA-ready
✅ Patient privacy is protected

🎉 Deployment Successful!
```

---

## 🔄 Rollback Plan

If something goes wrong:
1. Stop Flask server (Ctrl+C)
2. Restore original `backend/app.py` from git
3. Restart Flask
4. All endpoints will work as before (but without data isolation)

**But**: Already saved reports with `doctorId` will still be protected by existing database data.

---

## 📞 Support

If you encounter issues:
1. Check error messages in Flask console
2. Check browser console (F12)
3. Verify both backend and frontend are running
4. Verify MongoDB is running
5. Check that tokens are being stored in localStorage
