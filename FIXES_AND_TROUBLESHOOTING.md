# CORS and Error Fixes - Troubleshooting Guide

## Issues Fixed ✅

### 1. CORS Error - "Response to preflight request doesn't pass access control check"
**Root Cause**: 
- Browser origin mismatch between frontend (`localhost:5173`) and backend CORS configuration
- Missing explicit allow headers and methods in CORS configuration

**Fixed**:
- Updated `backend/app.py` CORS configuration to explicitly include:
  - `http://localhost:5173` (in addition to `127.0.0.1:5173`)
  - Explicit `allow_headers`: Content-Type, Authorization
  - Explicit `methods`: GET, POST, PUT, DELETE, OPTIONS

### 2. PDF Generation Error - "pdf.autoTable is not a function"
**Root Cause**:
- jsPDF-autotable library not imported
- Package was installed but not imported in code

**Fixed**:
- Added import: `import "jspdf-autotable";` to `frontend/src/utils/pdfGenerator.js`
- Library now properly extends jsPDF with autoTable method

### 3. React Warning - "Form field without onChange handler"
**Root Cause**:
- SettingsPage had input fields with `value` prop but no `onChange` or `readOnly`

**Fixed**:
- Added `readOnly` attribute to form inputs in SettingsPage
- Inputs now properly marked as read-only fields

---

## Verification Steps

### Test CORS Fix
1. Ensure backend is running: `python app.py`
2. Open browser DevTools (F12)
3. Go to Network tab
4. Navigate to Profile page
5. Should see `/api/user-stats` request succeed (status 200)
6. Error should be gone

### Test PDF Fix
1. Upload a scan
2. View results
3. Click "Download PDF"
4. PDF should generate and download successfully
5. Check console - no errors

### Test Form Warning Fix
1. Navigate to Settings page
2. Open browser console
3. No React warning about form fields
4. Should be clean console

---

## If Issues Persist

### CORS Still Failing?
**Check 1: Is backend running?**
```bash
# In terminal with backend
python app.py
# Should show: * Running on http://127.0.0.1:5000
```

**Check 2: Verify CORS configuration**
```python
# In backend/app.py, look for CORS setup
CORS(
    app,
    resources={r"/*": {"origins": [...]}},
    supports_credentials=True,
    allow_headers=[...],
    methods=[...],
)
```

**Check 3: Try different port**
```bash
# If 5000 is in use, try:
python app.py --port 5001

# Then update frontend to use new port in axiosConfig.js
const API_URL = 'http://127.0.0.1:5001';
```

### PDF Still Not Working?
**Check 1: Verify library installed**
```bash
cd frontend
npm list jspdf jspdf-autotable
```

**Check 2: Verify imports in pdfGenerator.js**
```javascript
// Should have both imports
import jsPDF from "jspdf";
import "jspdf-autotable";
```

**Check 3: Clear browser cache**
- Press Ctrl+Shift+Delete
- Clear all cache
- Refresh page

---

## File Changes Summary

### Backend (app.py)
```python
# BEFORE
CORS(
    app,
    resources={r"/*": {"origins": [FRONTEND_ORIGIN, "http://localhost:5173"]}},
    supports_credentials=True,
)

# AFTER
CORS(
    app,
    resources={r"/*": {"origins": [FRONTEND_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"]}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)
```

### Frontend (pdfGenerator.js)
```javascript
// ADDED
import "jspdf-autotable";
```

### Frontend (SettingsPage.jsx)
```javascript
// BEFORE
<input type="text" value="Dr. Alice Johnson" />

// AFTER
<input type="text" value="Dr. Alice Johnson" readOnly />
```

---

## Environment Check

Make sure you have:
1. ✅ Backend running on `http://127.0.0.1:5000`
2. ✅ Frontend running on `http://localhost:5173`
3. ✅ MongoDB running and accessible
4. ✅ All npm packages installed
5. ✅ All Python packages installed

---

## Testing Checklist

- [ ] Backend starts without errors: `python app.py`
- [ ] Frontend starts without errors: `npm run dev`
- [ ] Can login successfully
- [ ] Profile page loads without CORS errors
- [ ] User stats display correctly
- [ ] Can upload and save a scan
- [ ] PDF downloads without errors
- [ ] Settings page has no React warnings
- [ ] Recent scans show in profile
- [ ] Statistics update after saving new scan

---

## Browser Console Commands (For Testing)

```javascript
// Check if token is stored
localStorage.getItem('token')

// Check API base URL
console.log(process.env.VITE_API_URL)

// Manual API test (in console)
const response = await fetch('http://127.0.0.1:5000/api/user-stats', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json'
  }
});
console.log(await response.json());
```

---

## Common CORS Solutions

### Solution 1: Restart Backend
```bash
# Press Ctrl+C to stop backend
# Then restart
python app.py
```

### Solution 2: Clear Session Storage
```javascript
// In browser console
sessionStorage.clear();
localStorage.clear();
location.reload();
```

### Solution 3: Update CORS Origins
If running on different port or domain, update:
```python
# backend/app.py
CORS(
    app,
    resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]}},
    ...
)
```

### Solution 4: Check Network Logs
```
In DevTools → Network tab:
1. Look for preflight (OPTIONS) requests
2. Check Response Headers for:
   - Access-Control-Allow-Origin
   - Access-Control-Allow-Methods
   - Access-Control-Allow-Headers
```

---

## Performance Tips

1. **Cache PDF generation** - Don't regenerate if data hasn't changed
2. **Lazy load Profile data** - Only fetch when page is active
3. **Optimize images** - Compress before uploading
4. **Use indexed queries** - Ensure MongoDB indexes on doctorId

---

## Next Steps

1. Verify all fixes are working
2. Test with multiple scans
3. Check performance with large datasets
4. Consider adding error reporting
5. Set up monitoring/logging for production

If issues still persist, check the browser console and backend logs for specific error messages.
