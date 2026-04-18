# 🎨 Dashboard UI Architecture & Component Map

## Overview Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                         LAYOUT (Sidebar + Content)                  │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────────────────────────────┐ │
│  │   SIDEBAR        │  │          PAGE CONTENT                    │ │
│  │                  │  │                                          │ │
│  │ • Dashboard      │  │  [Dynamic Content Based on Route]        │ │
│  │ • Upload Scan    │  │                                          │ │
│  │ • Report History │  │                                          │ │
│  │ • Patients       │  │                                          │ │
│  │ • Settings       │  │                                          │ │
│  │ • Logout         │  │                                          │ │
│  └──────────────────┘  └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Page-by-Page Component Breakdown

### **1️⃣ DASHBOARD PAGE (`/dashboard`)**

```
┌──────────────────────────────────────────────────────────────────┐
│                         DASHBOARD PAGE                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                   HEADER SECTION                            │  │
│  │                                                             │  │
│  │  👋 Welcome back, Dr. Smith                               │  │
│  │  📝 Here's what's happening with your scans today        │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────┬────────┬────────┬────────┐                          │
│  │StatCard│StatCard│StatCard│StatCard│  STAT CARDS (4)         │
│  │ Scans  │Detections Rate │Patients │                         │
│  │ (24)   │ (3)    │(12.5%)│ (18)  │                         │
│  └────────┴────────┴────────┴────────┘                          │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               QUICK ACTIONS SECTION                        │  │
│  │  ┌──────────────────┐  ┌──────────────────┐               │  │
│  │  │ QuickActionCard  │  │ QuickActionCard  │  (4 Cards)   │  │
│  │  │  Analyze Scan    │  │  View Reports    │               │  │
│  │  └──────────────────┘  └──────────────────┘               │  │
│  │  ┌──────────────────┐  ┌──────────────────┐               │  │
│  │  │ QuickActionCard  │  │ QuickActionCard  │               │  │
│  │  │ Manage Patients  │  │ Recent Activity  │               │  │
│  │  └──────────────────┘  └──────────────────┘               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              RECENT SCANS TABLE                           │  │
│  │  ┌─────────────┬─────────┬──────────┬──────────────┐     │  │
│  │  │ Patient     │ Date    │ Result   │ Confidence   │     │  │
│  │  ├─────────────┼─────────┼──────────┼──────────────┤     │  │
│  │  │ John Doe    │18 Apr   │ Negative │ 94.2%        │     │  │
│  │  │ Jane Smith  │17 Apr   │ Positive │ 89.7%        │     │  │
│  │  └─────────────┴─────────┴──────────┴──────────────┘     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

### **2️⃣ UPLOAD SCAN PAGE (`/upload-scan`)**

```
┌──────────────────────────────────────────────────────────────────┐
│                    UPLOAD SCAN PAGE                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 📤 Analyze Brain Scan                                    │  │
│  │ 📝 Upload a brain MRI scan for AI-powered detection     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────┐  ┌────────────────────────┐  │
│  │    LEFT SECTION              │  │   RIGHT SECTION        │  │
│  │    (Upload & Preview)        │  │   (Results)            │  │
│  │                              │  │                        │  │
│  │ ┌────────────────────────┐   │  │ ┌──────────────────┐   │  │
│  │ │   DRAG & DROP AREA     │   │  │ │ RESULT DISPLAY   │   │  │
│  │ │   (Click or Drag)      │   │  │ │                  │   │  │
│  │ │   PNG, JPG up to 10MB  │   │  │ │ ✅ Status Badge  │   │  │
│  │ └────────────────────────┘   │  │ │    (Pos/Neg)     │   │  │
│  │                              │  │ │                  │   │  │
│  │ ┌────────────────────────┐   │  │ │ ┌──────┬──────┐  │   │  │
│  │ │    IMAGE PREVIEW       │   │  │ │ │Orig  │Segm  │  │   │  │
│  │ │  (Thumbnail)          │   │  │ │ │Image │Image │  │   │  │
│  │ └────────────────────────┘   │  │ │ └──────┴──────┘  │   │  │
│  │                              │  │ │                  │   │  │
│  │ ┌────────────────────────┐   │  │ │ Confidence: 89% │   │  │
│  │ │  \"Analyze Scan\" BTN    │   │  │ │ Accuracy: 94%  │   │  │
│  │ │  (Blue, Hover Effect)  │   │  │ │                  │   │  │
│  │ └────────────────────────┘   │  │ │ ┌──────────────┐ │   │  │
│  │                              │  │ │ │Download PDF  │ │   │  │
│  │                              │  │ │ │Save to File  │ │   │  │
│  │                              │  │ │ └──────────────┘ │   │  │
│  │                              │  │ └──────────────────┘   │  │
│  └──────────────────────────────┘  └────────────────────────┘  │
│                                                                   │
│                  PATIENT INFO MODAL                              │
│                  (Appears when \"Analyze\" clicked)               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Patient Information                             │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Patient Name: [____________]                       │  │  │
│  │  │ Patient ID:   [____________]                       │  │  │
│  │  │ Age: [______] Gender: [M/F]                        │  │  │
│  │  │                                                     │  │  │
│  │  │  [Cancel]              [Continue]                  │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

### **3️⃣ REPORT HISTORY PAGE (`/report-history`)**

```
┌──────────────────────────────────────────────────────────────────┐
│                 REPORT HISTORY PAGE                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 📋 Report History                                        │  │
│  │ 📝 View and manage all patient scan reports             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────┬──────────────────────────┐  │
│  │ [Search box]                   │ Filter: [All ▼]          │  │
│  │ Search patient name or ID      │                          │  │
│  └────────────────────────────────┴──────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    REPORTS TABLE                          │  │
│  │  ┌──────────┬──────────┬──────────┬────────┬──────────┐   │  │
│  │  │ Patient  │ ID       │ Date     │Result  │Confidence│   │  │
│  │  ├──────────┼──────────┼──────────┼────────┼──────────┤   │  │
│  │  │ John Doe │ P001     │18 Apr    │✅ Neg  │ 94.2%    │   │  │
│  │  │ Jane S.  │ P002     │17 Apr    │⚠️ Pos  │ 89.7%    │   │  │
│  │  │ Mike J.  │ P003     │16 Apr    │✅ Neg  │ 96.1%    │   │  │
│  │  └──────────┴──────────┴──────────┴────────┴──────────┘   │  │
│  │                                                             │  │
│  │  Row Actions: [👁️ View] [📥 Download] [🗑️ Delete]           │  │
│  │                                                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

### **4️⃣ PATIENT MANAGEMENT PAGE (`/patients`)**

```
┌──────────────────────────────────────────────────────────────────┐
│              PATIENT MANAGEMENT PAGE                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────┐                      │
│  │ 👥 Patient Management                 │  [+ Add New Patient]  │
│  │ 📝 View and manage all registered     │     (Blue Button)     │
│  └────────────────────────────────────────┘                      │
│                                                                   │
│  ┌──────────────────────────────────────────┐                   │
│  │ [🔍 Search by name or ID...]           │                   │
│  └──────────────────────────────────────────┘                   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  PATIENTS TABLE                           │  │
│  │  ┌────────┬────────┬─────┬───────┬────────┬──────────┐   │  │
│  │  │ Name   │ ID     │Age  │Email  │Scans   │Last Scan │   │  │
│  │  ├────────┼────────┼─────┼───────┼────────┼──────────┤   │  │
│  │  │John Doe│ P001   │ 45  │john@  │  3    │18 Apr    │   │  │
│  │  │Jane S. │ P002   │ 38  │jane@  │  5    │17 Apr    │   │  │
│  │  │Mike J. │ P003   │ 52  │mike@  │  2    │16 Apr    │   │  │
│  │  └────────┴────────┴─────┴───────┴────────┴──────────┘   │  │
│  │                                                             │  │
│  │  Row Actions: [✏️ Edit] [🗑️ Delete]                         │  │
│  │                                                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App.jsx
├── Layout (Sidebar + Content)
│   ├── Sidebar
│   │   └── NavItems (with icons)
│   │
│   └── Routes
│       ├── DashboardPage
│       │   ├── StatCard (x4)
│       │   ├── QuickActionCard (x4)
│       │   └── Recent Scans Table
│       │
│       ├── UploadScanPage
│       │   ├── File Upload Area
│       │   ├── Image Preview
│       │   ├── PatientModal
│       │   │   └── Form Fields
│       │   │       ├── Patient Name Input
│       │   │       ├── Patient ID Input
│       │   │       ├── Age Input
│       │   │       └── Gender Select
│       │   │
│       │   └── ResultDisplay
│       │       ├── Result Badge
│       │       ├── Side-by-side Images
│       │       │   ├── Original Image
│       │       │   └── Segmented Image
│       │       ├── Analysis Details (3 cards)
│       │       └── Action Buttons
│       │           ├── Download PDF Button
│       │           └── Save to Patient Button
│       │
│       ├── ReportHistoryPage
│       │   ├── Search Input
│       │   ├── Filter Select
│       │   └── Reports Table
│       │       └── Action Icons
│       │           ├── View
│       │           ├── Download
│       │           └── Delete
│       │
│       └── PatientManagementPage
│           ├── Add Patient Button
│           ├── Search Input
│           └── Patients Table
│               └── Action Icons
│                   ├── Edit
│                   └── Delete
```

---

## Color & Style Reference

### **Result Badges**
```jsx
// Positive Result
<span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
  Positive
</span>

// Negative Result
<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
  Negative
</span>
```

### **Button Styles**
```jsx
// Primary Button (Blue)
className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"

// Secondary Button (Gray)
className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-xl transition-colors"

// Icon Button
className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
```

### **Card Styles**
```jsx
// Main Card
className="bg-white rounded-2xl shadow-sm border border-gray-100"

// Stat Card
className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"

// Quick Action Card
className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-200"
```

---

## Responsive Breakpoints

```
Mobile: < 640px    → Single column layouts
Tablet: 640-1024px → 2 column layouts
Desktop: > 1024px  → 3-4 column layouts
```

### **Example Grid**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* 1 column on mobile, 2 on tablet, 4 on desktop */}
</div>
```

---

## Data Flow Example

```
USER ACTION
    ↓
Upload File
    ↓
Show Preview
    ↓
Click "Analyze Scan"
    ↓
Open PatientModal
    ↓
Submit Patient Info
    ↓
POST /api/analyze-scan (with image)
    ↓
Show Loading State
    ↓
Receive Analysis Results
    ↓
Display ResultDisplay Component
    ├─ Show Result Badge
    ├─ Show Original Image
    ├─ If Positive: POST /api/segment-scan
    │   ↓
    │   Show Segmented Image
    │
└─ Show Analysis Details & Buttons
    ├─ Download PDF
    └─ Save to Patient File
```

---

## Interactive States

### **Button States**
- **Default**: Full color, cursor pointer
- **Hover**: Darker shade, scale up slightly
- **Active**: Darker, pressed effect
- **Disabled**: Gray, no interaction

### **Input States**
- **Default**: Light border
- **Focus**: Blue ring, blue border
- **Error**: Red border
- **Disabled**: Gray background

### **Table Row States**
- **Default**: White background
- **Hover**: Light gray background
- **Active**: Light blue background

---

## Accessibility Features

✅ **Color Contrast**: All text has proper contrast ratios
✅ **Semantic HTML**: Using proper HTML tags
✅ **Icons with Text**: All icons have accompanying text
✅ **Focus States**: Visible focus indicators on all interactive elements
✅ **Keyboard Navigation**: All features accessible via keyboard
✅ **Responsive Text**: Readable on all screen sizes
✅ **Clear Labels**: All inputs have proper labels

---

This comprehensive UI architecture ensures a professional, clean, and intuitive medical dashboard experience! 🏥✨
