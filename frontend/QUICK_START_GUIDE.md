# 🚀 Quick Start Guide - IADS Dashboard

## ⚡ Get Started in 5 Minutes

### **Step 1: Install Dependencies**
```bash
cd frontend
npm install
```

This installs:
- React & React Router
- Axios (HTTP client)
- Lucide React (Icons)
- jsPDF & jspdf-autotable (PDF generation)

---

### **Step 2: Start Development Server**
```bash
npm run dev
```

Your app will be running at: **http://localhost:5173**

---

### **Step 3: Login to Dashboard**
1. Go to http://localhost:5173
2. Login with your credentials (must be registered in MongoDB)
3. You'll be redirected to `/dashboard`

---

## 📱 Features Overview

### **Dashboard Home** (`/dashboard`)
- 📊 View statistics and metrics
- 🎯 Quick action shortcuts
- 📋 Recent scans overview

### **Upload & Analyze** (`/upload-scan`)
- 📤 Drag-and-drop file upload
- 🖼️ Image preview
- 🔍 AI analysis with results
- 🖼️ Side-by-side image comparison
- 📥 Download PDF reports

### **Report History** (`/report-history`)
- 🔎 Search reports by patient
- 🏷️ Filter by result type
- 📥 Download previous reports
- 🗑️ Delete reports

### **Patient Management** (`/patients`)
- 👥 View all patients
- ➕ Add new patients
- ✏️ Edit patient information
- 🗑️ Remove patients

---

## 🔌 Backend Connection

### **Required Flask Endpoints**

Your Flask backend must have these endpoints:

#### 1. **AI Analysis**
```
POST /api/analyze-scan
Content-Type: multipart/form-data
Body: { image: File }

Response:
{
  "prediction": "positive" | "negative",
  "confidence": 0.897,
  "accuracy": 0.94,
  "processing_time": 45.2,
  "image_quality": "Good"
}
```

#### 2. **Segmentation (for positive results)**
```
POST /api/segment-scan
Content-Type: multipart/form-data
Body: { image: File }

Response:
{
  "segmented_image": "base64_string_or_url"
}
```

---

## 📝 Common Tasks

### **Add a New Page**

1. Create a new file: `src/pages/MyNewPage.jsx`
```jsx
import Layout from "../components/Layout";

export default function MyNewPage() {
  return (
    <Layout active="My Page">
      <h1>My New Page</h1>
      {/* Content here */}
    </Layout>
  );
}
```

2. Add route in `App.jsx`
3. Add to sidebar in `Sidebar.jsx`

---

## 🐛 Troubleshooting

### **Issue: Routes not working**
- Check spelling in `App.jsx` and `Sidebar.jsx`
- Ensure routes wrapped with `ProtectedRoute`
- Clear browser cache

### **Issue: Icons not showing**
```bash
npm install lucide-react
```

### **Issue: PDF download not working**
```bash
npm install jspdf jspdf-autotable
```

### **Issue: Backend API not connecting**
1. Ensure Flask backend is running: `python app.py`
2. Check CORS is enabled in Flask
3. Verify API URL in components
4. Check DevTools → Network tab for errors

---

## 📦 Build for Production

```bash
npm run build
```

---

## 🎯 Your Dashboard is Ready!

✅ Clean, professional medical UI
✅ All features implemented
✅ Production-ready code
✅ Fully responsive design

**Next:** Connect your Flask backend and you're done! 🚀
