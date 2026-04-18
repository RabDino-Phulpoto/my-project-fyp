# Quick Fix & Setup Guide - Complete Steps

## 🔴 Current Issues
1. **CORS still failing** when accessing profile
2. **Reports not showing** in dashboard/history
3. **Profile page** showing no data
4. **Backend not responding** to requests

## ✅ What Was Just Fixed

### Backend Changes (app.py)
- ✅ Added explicit OPTIONS request handler
- ✅ Added preflight handler for CORS
- ✅ Extended CORS origins list

### Frontend Changes (Dashboard, Reports)
- ✅ DashboardPage now fetches real stats
- ✅ ReportHistoryPage now fetches user's reports
- ✅ Added loading states

---

## 🚨 CRITICAL: RESTART BACKEND

The fixes won't work until the backend is restarted with the new code.

### Step 1: Stop the Backend
```bash
# In terminal where backend is running:
Press Ctrl+C
```

### Step 2: Restart the Backend
```bash
cd d:\The Final Year Project 2026\my project\backend

# Make sure you're using Python
python app.py
```

**You should see:**
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
 * Restarting with reloader
```

**Do NOT proceed until you see this message!**

---

## 🧪 Test CORS Fix

### In Browser Console (F12):
```javascript
// Test 1: Direct API call
fetch('http://127.0.0.1:5000/api/user-stats', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('✅ Success:', data))
.catch(e => console.error('❌ Error:', e));

// Test 2: Check if token exists
console.log('Token:', localStorage.getItem('token'));
```

---

## 🔄 Complete Testing Workflow

### Test 1: Login Flow
1. Go to login page
2. Enter credentials
3. Click Login
4. Should redirect to Dashboard
5. Check browser console for errors (F12)

### Test 2: Dashboard Stats
1. Navigate to Dashboard
2. Should show your real stats (not hardcoded 24, 3, 12.5)
3. Check console for errors
4. Stats should update when you save reports

### Test 3: Upload & Save Report
1. Go to "Upload Scan"
2. Upload a brain scan image
3. Click "Analyze"
4. System analyzes and shows result
5. Fill patient info
6. Click "Save Report"
7. Should see success message

### Test 4: Report History
1. Go to "Report History"
2. Should see your saved report (might take a few seconds to load)
3. Should show correct patient name, result, confidence
4. Search should work
5. Filter by positive/negative should work

### Test 5: Profile Page
1. Click "Profile" in sidebar
2. Should show:
   - User information (name, email, phone, PMDC ID)
   - User statistics (total scans, positive, negative, avg confidence)
   - Recent scans table
3. No CORS errors in console
4. All data should be real (from your saved reports)

---

## 🐛 If CORS Error Still Occurs

### Check 1: Backend Running?
```bash
# In new terminal, test if backend is running
curl http://127.0.0.1:5000/
# Should return: {"message":"IADS Flask Backend Running ✅"}
```

### Check 2: Port Not Blocked?
```bash
# If port 5000 is in use, you can change it
python app.py --port 5001
# Then update frontend to use 5001 in axiosConfig.js
```

### Check 3: Full Backend Restart
```bash
# Stop all Python processes
# Delete any .env cache
# Delete __pycache__
# Run fresh
python app.py
```

### Check 4: Browser Cache
- Clear all browser cache (Ctrl+Shift+Delete)
- Close all tabs
- Reopen in fresh browser window
- Try again

---

## 📝 Data Flow Now Works Like This

```
1. User logs in
   → Token stored in localStorage
   → axiosConfig adds token to all requests

2. User saves a report
   → save-report extracts doctorId from token
   → Report saved with doctorId linked to user

3. Dashboard loads
   → Fetches getUserStats() 
   → Backend filters reports by doctorId
   → Returns user's statistics only

4. Report History loads
   → Fetches getUserReports()
   → Backend filters reports by doctorId
   → Returns paginated list of user's reports

5. Profile page loads
   → Shows user info
   → Shows stats summary
   → Shows recent scans table
```

---

## 🔍 Debugging Commands

### If reports still don't appear:

**Check MongoDB:**
```javascript
// In MongoDB CLI
use iads
db.reports.find().pretty()
// Should show your reports with doctorId field
```

**Check if doctorId is set:**
```javascript
db.reports.find({ doctorId: null }).count()
// If this returns > 0, reports don't have doctorId
```

---

## 📋 Files Modified Today

| File | Change |
|------|--------|
| `backend/app.py` | Added OPTIONS preflight handler |
| `frontend/src/pages/DashboardPage.jsx` | Fetch real stats from API |
| `frontend/src/pages/ReportHistoryPage.jsx` | Fetch user's reports from API |
| `frontend/src/utils/pdfGenerator.js` | Added jsPDF-autotable import |
| `frontend/src/pages/SettingsPage.jsx` | Fixed form field warnings |
| `frontend/src/components/Sidebar.jsx` | Added Profile link |

---

## ✨ What Should Work Now

- ✅ Profile page loads without CORS errors
- ✅ Dashboard shows real statistics
- ✅ Report History shows saved reports
- ✅ PDF downloads work
- ✅ Form fields don't show warnings
- ✅ When you save a report, it appears in all pages
- ✅ Each user only sees their own reports/stats

---

## 🎯 Next Steps

1. **Restart backend** (this is critical!)
2. **Clear browser cache**
3. **Test the workflow** using the checklist above
4. **Check browser console** for errors (F12)
5. **Check backend logs** in terminal for Python errors
6. **Try uploading a test scan** and verify it appears everywhere

---

## 💡 Pro Tips

- **Always check browser console (F12)** when things don't work
- **Always check backend terminal** for error messages
- **Reports show under "Report History"** not "Patient Management"
- **Profile page shows YOUR stats only** (not all patients)
- **Make sure backend is fully started** before testing

---

## 🆘 If Still Stuck

1. **Restart everything**:
   ```bash
   # Stop backend (Ctrl+C)
   # Stop frontend (Ctrl+C in another terminal)
   # Close browser completely
   # Start backend again
   # Start frontend again
   # Open browser fresh
   ```

2. **Check logs**:
   - Backend: Look for Python errors in terminal
   - Frontend: Check browser console (F12)
   - Database: Check MongoDB is running

3. **Test basic connectivity**:
   ```bash
   # Backend running?
   curl http://127.0.0.1:5000/
   
   # Frontend running?
   Open http://localhost:5173 in browser
   ```

---

## ❓ Common Questions

**Q: Why don't my reports show?**
A: Backend wasn't restarted with new code. Reports need to be saved AFTER backend restart.

**Q: CORS error persists?**
A: Close ALL browser windows and tabs completely. Open fresh. Try incognito window.

**Q: Dashboard shows 0 scans?**
A: No reports saved yet OR backend not restarted. Try saving a report first.

**Q: Profile page is empty?**
A: CORS error preventing data load. Check browser console (F12) for errors.

**Q: Can't see the Profile link in sidebar?**
A: Refresh page with Ctrl+F5 or clear browser cache.

---

**Most important: RESTART THE BACKEND! This is the #1 reason fixes don't work.**
