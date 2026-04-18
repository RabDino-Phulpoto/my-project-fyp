# 🧪 Complete IADS System Testing Guide

## Prerequisites

1. **Gmail App Password Setup** (for OTP emails)
   - Go to: https://myaccount.google.com/apppasswords
   - Get 16-character app password
   - Update `.env` SMTP_PASS with it

2. **Both servers running:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   python app.py
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

---

## Part 1: Authentication Testing (5 min)

### Test 1.1: Register New Account
1. Open http://localhost:5174
2. Click "Register"
3. Enter:
   - Name: `Test User`
   - Email: `your-email@gmail.com`
4. Click "Send OTP"
   - ✅ Check email for OTP
   - ✅ Backend console shows: `✅ OTP SEND SUCCESSFUL`
5. Enter OTP from email
6. Set password & confirm
7. Click "Create Account"
   - ✅ Console shows: `✅ REGISTRATION SUCCESSFUL`

### Test 1.2: Login
1. Go back to login page
2. Enter email & password
3. Click "Login"
   - ✅ Console shows: `✅ LOGIN SUCCESSFUL`
   - ✅ Redirected to Dashboard

---

## Part 2: Patient ID Generation Testing (3 min)

### Test 2.1: Auto ID Format
1. On Upload page, click "Analyze Scan"
2. PatientModal appears
3. Enter patient name: `John Doe`
   - ✅ Patient ID auto-generates: `JD202604JD00`
   - Format: First 2 letters + YYYYMM + Initials + Series
4. Try another patient: `Alice Smith`
   - ✅ ID should be: `AS202604AS00`
5. Same patient again: `John Doe`
   - ✅ ID should increment: `JD202604JD01`

---

## Part 3: Image Upload & AI Analysis Testing (2-3 min)

### Test 3.1: Upload Image
1. Get a brain MRI image (PNG or JPG, <10MB)
2. On Upload page, drag-drop or click upload
   - ✅ Image preview shows
3. Click "Analyze Scan"
4. PatientModal shows (ID auto-generates)
5. Fill in age & gender
6. Click "Continue"
   - ✅ Loading spinner appears
   - ✅ Backend console shows AI model processing
   - ⏱️ Wait 30-60 seconds

### Test 3.2: View Results
Results page should show:
- ✅ **Original Scan** (left) - your uploaded image
- ✅ **Segmented Result** (right) - highlighted area (if positive)
- ✅ **Prediction badge** - "Positive" (red) or "Negative" (green)
- ✅ **Confidence** - e.g., "87.5%"
- ✅ **Analysis details** - Prediction, Confidence, Scan Date

---

## Part 4: PDF Report Download Testing (2 min)

### Test 4.1: Download PDF
1. On Results page, click "Download Report as PDF"
   - ✅ Button shows "Generating..." with spinner
   - ✅ Message shows: "Report downloaded successfully!"
2. Check Downloads folder
   - ✅ File: `IADS_Report_JD202604JD00_1713456789.pdf`
3. Open PDF
   - ✅ Header: IADS logo & branding
   - ✅ Patient info section with ID at top
   - ✅ Analysis results (Prediction, Confidence)
   - ✅ Both images embedded (Original + Segmented)
   - ✅ Clinical impression & recommendations
   - ✅ Medical disclaimer footer

---

## Part 5: Save Report to Patient File Testing (2 min)

### Test 5.1: Save to Database
1. On Results page, click "Save to Patient File"
   - ✅ Button shows "Saving..." with spinner
   - ✅ Message shows: "Report saved to patient file successfully!"
2. Check backend console
   - ✅ Shows: `✅ Report saved for patient JD202604JD00`
   - ✅ Shows: MongoDB insert acknowledgment

### Test 5.2: View in Reports History
1. Go to "Report History" page
   - ✅ Your report appears in table
   - ✅ Shows: Patient Name, ID, Date, Result (badge), Confidence
   - ✅ Download button available
   - ✅ Delete button available

---

## Part 6: Search & Filter Testing (2 min)

### Test 6.1: Search
1. On Report History page, enter search: `John`
   - ✅ Table filters to show only John's reports
2. Search by ID: `JD202604`
   - ✅ Table shows matching reports
3. Clear search
   - ✅ All reports show again

### Test 6.2: Filter by Result
1. Click filter dropdown
2. Select "Positive"
   - ✅ Table shows only positive results
3. Select "Negative"
   - ✅ Table shows only negative results
4. Select "All"
   - ✅ All reports show

---

## Part 7: Patient Management Testing (2 min)

### Test 7.1: View Patients
1. Go to "Patient Management" page
   - ✅ Shows table of unique patients
   - ✅ Each patient shows:
     - Name, ID, Age, Email, Total Scans, Last Scan date
2. View multiple patients from different reports
   - ✅ Aggregated stats show correctly

---

## Part 8: Dashboard Statistics Testing (2 min)

### Test 8.1: Dashboard Stats
1. Go to Dashboard
2. View stat cards:
   - ✅ **Total Scans** - matches number of reports
   - ✅ **Aneurysms Detected** - counts "Positive" reports
   - ✅ **Detection Rate** - calculated percentage
   - ✅ **Patients Managed** - unique patient count
3. View recent scans table
   - ✅ Shows latest reports
   - ✅ Color-coded results (green/red)

---

## Part 9: Complete End-to-End Workflow (10 min)

### Scenario: New patient scan

**Step 1:** Upload image
- Brain MRI PNG/JPG uploaded

**Step 2:** Enter patient info
- Modal auto-generates ID
- Fill age & gender

**Step 3:** AI analysis completes
- See results on screen

**Step 4:** Download PDF
- Report includes patient ID, images, results

**Step 5:** Save to patient file
- Report saved to database

**Step 6:** View in Reports History
- Search for patient
- Filter by result

**Step 7:** Check Dashboard
- Statistics updated
- Patient shows in list

**Step 8:** Verify in Patient Management
- Patient listed with aggregated stats

✅ **Complete workflow verified!**

---

## Troubleshooting

### PDF not downloading?
- ✅ Check browser console for errors
- ✅ Verify jsPDF library loaded: `npm install jspdf jspdf-autotable`
- ✅ Check file permissions

### Images not showing in results?
- ✅ Verify backend API response has `segmentation_url`
- ✅ Check network tab - both image requests succeed
- ✅ Verify image format (PNG/JPG)

### Reports not saving?
- ✅ Check backend console for MongoDB errors
- ✅ Verify MongoDB connection in `.env`
- ✅ Check if `reports` collection exists

### Search/Filter not working?
- ✅ Verify backend endpoint returns data
- ✅ Check network tab - GET /api/reports returns 200
- ✅ Clear browser cache

### AI model not processing?
- ✅ Backend console shows model loading?
- ✅ Verify `best_aneurysm_model.keras` exists in `backend/models/`
- ✅ Check TensorFlow warnings (CPU-related, usually OK)

---

## Success Criteria Checklist

- [ ] Registration with OTP works
- [ ] Login with email/password works
- [ ] Patient ID auto-generates with correct format
- [ ] Image upload shows preview
- [ ] AI analysis completes (30-60 sec)
- [ ] Results display both images
- [ ] Prediction badge shows correctly
- [ ] PDF downloads with patient ID in filename
- [ ] PDF contains patient info and both images
- [ ] "Save to Patient File" works
- [ ] Reports appear in history
- [ ] Search finds reports by name/ID
- [ ] Filter by result type works
- [ ] Patient Management page shows unique patients
- [ ] Dashboard stats calculate correctly
- [ ] Recent scans table shows latest reports

---

## Quick Commands

```bash
# Clear browser cache (hard refresh)
Ctrl+Shift+Delete  (or Cmd+Shift+Delete on Mac)

# View backend logs
Scroll in terminal running `python app.py`

# View frontend errors
Open Developer Tools: F12 → Console tab

# Test API directly
curl http://127.0.0.1:5000/
curl http://127.0.0.1:5000/api/reports

# Restart services
# Backend: Ctrl+C in terminal, then `python app.py`
# Frontend: Ctrl+C in terminal, then `npm run dev`
```

---

## 🎉 All Tests Passing?

You're ready to:
- ✅ Deploy to production
- ✅ Add more doctor accounts
- ✅ Scan more patients
- ✅ Generate reports
- ✅ Track statistics

**Congratulations! IADS is fully operational! 🏥**

---

**Last Updated:** April 18, 2026
