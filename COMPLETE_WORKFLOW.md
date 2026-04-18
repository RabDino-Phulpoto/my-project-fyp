# 🏥 IADS Complete Workflow Implementation

## Overview

This document explains the complete end-to-end workflow of the Intracranial Aneurysm Detection System (IADS).

---

## 1️⃣ Patient Registration & Auto ID Generation

### Auto-Patient-ID Format
```
[2-Letter Name][YYYYMM][Initials][Series]
```

**Example:** `JD202604JD00`
- `JD` = First letter of first name + last name (John Doe)
- `202604` = April 2026 (Year-Month)
- `JD` = Initials (John Doe)
- `00` = Unique series number (increments automatically)

### Implementation
- **File:** `frontend/src/utils/patientIdGenerator.js`
- **Function:** `generatePatientId(patientName)`
- **Auto-generates** when user types patient name in PatientModal
- **Editable** if needed, but pre-populated automatically

---

## 2️⃣ Image Upload & AI Analysis Workflow

### Step 1: Upload Brain MRI Image
- **Supported formats:** PNG, JPG
- **Max size:** 10MB
- **Drag-and-drop** or click to upload
- **Preview** shown before analysis

### Step 2: Enter Patient Information
When user clicks "Analyze Scan":
1. PatientModal pops up
2. User enters **patient name** (ID auto-generates)
3. User enters **age** and **gender**
4. Clicks "Continue"

### Step 3: AI Analysis
Image sent to backend → `/api/analyze-scan` endpoint

**Request:**
```json
{
  "image": <binary image>,
  "patientName": "John Doe",
  "patientId": "JD202604JD00"
}
```

**Response:**
```json
{
  "label": "Positive|Negative",
  "confidence": 87.5,
  "segmentation_url": "http://127.0.0.1:5000/static/results/seg_image.png"
}
```

### Step 4: Backend AI Models
- **Model 1:** `best_aneurysm_model.keras`
  - Input: Brain MRI (224x224 RGB or Grayscale)
  - Output: Classification (positive/negative) + confidence
  
- **Model 2:** `unet_segmenter.keras` (if positive)
  - Input: Original brain scan
  - Output: Segmentation mask (highlighted aneurysm area)
  - Automatically triggered if Model 1 = Positive

### Step 5: Display Results
Results shown on screen:
- ✅ **Original Scan** (left image)
- ✅ **Segmentation Result** (right image) - only if positive
- ✅ **Prediction badge** (Positive/Negative with color)
- ✅ **Confidence score** (e.g., 87.5%)
- ✅ **Analysis details** table

---

## 3️⃣ PDF Report Generation & Download

### When User Clicks "Download Report as PDF"

**File:** `frontend/src/utils/pdfGenerator.js`
**Function:** `downloadReportPDF(patientInfo, analysisResults, originalImage, segmentedImage)`

### PDF Contents:
1. **Header** (IADS branding, date)
2. **Patient Information** (name, ID, age, gender)
3. **Analysis Results** (prediction, confidence)
4. **Scan Images** (both original and segmented)
5. **Clinical Impression** (interpretation based on result)
6. **Recommendations** (different for positive/negative)
7. **Medical Disclaimer** (HIPAA compliance)

### PDF File Naming
```
IADS_Report_JD202604JD00_1713456789012.pdf
```

### Technical Details
- Uses **jsPDF** library for PDF generation
- Includes both images as embedded PNGs
- Professional medical formatting
- Auto-downloads to user's Downloads folder

---

## 4️⃣ Save Report to Patient File

### When User Clicks "Save to Patient File"

**Endpoint:** `POST /api/save-report`

**Request:**
```json
{
  "patientName": "John Doe",
  "patientId": "JD202604JD00",
  "age": 45,
  "gender": "M",
  "result": "Positive",
  "confidence": 87.5,
  "scanDate": "2026-04-18T10:30:00Z",
  "originalImagePath": <base64 or URL>,
  "segmentedImagePath": <base64 or URL>
}
```

**Response:**
```json
{
  "message": "Report saved successfully",
  "reportId": "507f1f77bcf86cd799439011"
}
```

### Database Storage
- **Collection:** `reports` (MongoDB)
- **Fields:** Patient info, results, images, timestamp
- **Auto-indexed:** By patientId, createdAt, result

---

## 5️⃣ View Reports History

### Dashboard Integration

#### ReportHistoryPage
- **Endpoint:** `GET /api/reports`
- **Query params:** `?search=name&filter=all|positive|negative`
- **Returns:** All saved reports with search/filter applied

#### Features
- 📋 Table view with columns:
  - Patient Name
  - Patient ID
  - Scan Date
  - Result (badge color-coded)
  - Confidence
- 🔍 Search by name or ID
- 🔽 Filter by result type
- 📥 Download report PDF
- ❌ Delete report

### DashboardPage Statistics
- **Total Scans:** Count of all reports
- **Aneurysms Detected:** Count of "Positive" results
- **Detection Rate:** (Positive / Total) × 100%
- **Patients Managed:** Unique patients

---

## 6️⃣ Patient Management

### PatientsPage
- **Endpoint:** `GET /api/patients`
- **Returns:** Unique patients with aggregated data

#### Features
- 👥 List all patients
- 📊 Stats per patient:
  - Name & ID
  - Age & Gender
  - Total scans
  - Last scan date
- ✏️ Edit patient info
- 🗑️ Delete patient record
- ➕ Add new patient

---

## 🔄 Complete Flow Diagram

```
┌─────────────────┐
│  Upload Image   │
└────────┬────────┘
         │
         ▼
┌──────────────────┐
│ Show PatientModal│
│ (Auto-gen ID)    │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────┐
│ POST /api/analyze-scan  │
│ (best_aneurysm_model)   │
└────────┬────────────────┘
         │
    ┌────▼───────────────────┐
    │ Positive?              │
    │                        │
    ├──YES──┐          ┌─NO──┤
    │       │          │     │
    │       ▼          ▼     │
    │  Segment     Show      │
    │  (unet)      Results   │
    │       │          │     │
    │       └──┬───────┘     │
    │          │             │
    └──────────┼─────────────┘
               │
         ┌─────▼──────────────────┐
         │ Display Results Screen │
         │ - Original Image       │
         │ - Segmented Image      │
         │ - Confidence %         │
         │ - Prediction badge     │
         └─────┬─────────┬────────┘
               │         │
        ┌──────▼─┐   ┌───▼────────┐
        │Download│   │Save Report │
        │  PDF   │   │ to Patient │
        └────────┘   │   File     │
                     └─────┬──────┘
                           │
                     ┌─────▼──────────────┐
                     │POST /api/save-    │
                     │report (MongoDB)   │
                     └─────┬──────────────┘
                           │
                     ┌─────▼──────────────┐
                     │Show in Dashboard   │
                     │- Reports History   │
                     │- Patient List      │
                     │- Statistics        │
                     └────────────────────┘
```

---

## 📱 Frontend Components

### PatientModal.jsx
- Auto-generates patient ID from name
- Collects age & gender
- Validates required fields

### ResultDisplay.jsx
- Displays analysis results
- Shows side-by-side images (original vs segmented)
- Download PDF button
- Save to patient file button
- Status messages

### UploadScanPage.jsx
- Drag-drop file upload
- Calls PatientModal on analyze
- Sends image to AI backend
- Loads segmented image if positive
- Displays ResultDisplay component

### ReportHistoryPage.jsx
- Fetches reports from backend
- Search & filter functionality
- Display reports in table
- Download/delete actions

### DashboardPage.jsx
- Shows statistics cards
- Recent scans table
- Quick action cards

---

## 🖥️ Backend Endpoints

### Analysis
- `POST /api/analyze-scan` → Run AI detection model
- `GET /static/results/{filename}` → Download segmentation image

### Reports
- `POST /api/save-report` → Save report to database
- `GET /api/reports` → Retrieve all reports with search/filter
- `GET /api/patients` → Get unique patients with stats

### Authentication
- `POST /auth/register-start` → Send OTP to email
- `POST /auth/register-complete` → Verify OTP & create account
- `POST /auth/login` → Login with email/password
- `POST /auth/forgot-start` → Send password reset OTP

---

## 🗄️ Database Collections

### users
- Email verification
- Login credentials
- Account details

### reports
```json
{
  "patientName": "John Doe",
  "patientId": "JD202604JD00",
  "age": 45,
  "gender": "M",
  "result": "Positive",
  "confidence": 87.5,
  "scanDate": "2026-04-18T10:30:00Z",
  "originalImagePath": "...",
  "segmentedImagePath": "...",
  "createdAt": "2026-04-18T10:35:00Z"
}
```

### patients (aggregated from reports)
```json
{
  "patientName": "John Doe",
  "patientId": "JD202604JD00",
  "age": 45,
  "gender": "M",
  "totalScans": 3,
  "lastScan": "2026-04-18T10:35:00Z"
}
```

---

## 🧪 Testing the Complete Workflow

### 1. Start Backend
```bash
cd backend
python app.py
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Register Account
- Go to http://localhost:5174
- Register with email (get OTP from email)
- Verify OTP, set password

### 4. Upload & Analyze
- Click "Analyze Brain Scan"
- Drag-drop or upload brain MRI image
- Enter patient name (ID auto-generates)
- Enter age & gender
- Wait 30-60 seconds for analysis
- See results on screen

### 5. Download Report
- Click "Download Report as PDF"
- Check Downloads folder for PDF

### 6. Save to Patient File
- Click "Save to Patient File"
- View in Reports History
- Check Dashboard statistics

### 7. View History & Patients
- Go to "Report History" page
- Search & filter reports
- View patient management page
- See aggregated patient statistics

---

## 📝 Key Features

✅ **Auto Patient ID** - System generates unique IDs  
✅ **AI Detection** - Real-time aneurysm detection  
✅ **AI Segmentation** - Shows highlighted detection area  
✅ **PDF Reports** - Professional medical reports with images  
✅ **Database Storage** - All reports saved in MongoDB  
✅ **Search & Filter** - Find reports quickly  
✅ **Patient Dashboard** - Manage patient records  
✅ **Statistics** - Real-time analytics  
✅ **Mobile Responsive** - Works on all devices  
✅ **Medical Compliant** - HIPAA disclaimers included  

---

## 🚀 Ready to Use!

The complete IADS system is now fully implemented and ready for:
- Doctor login
- Patient management
- Brain scan upload
- AI-powered analysis
- PDF report generation
- Report history tracking
- Patient statistics dashboard

**Next steps:**
1. Get Gmail App Password
2. Update .env with SMTP credentials
3. Test the complete workflow
4. Deploy to production

---

**Last Updated:** April 18, 2026
**Version:** 1.0 - Complete Implementation
