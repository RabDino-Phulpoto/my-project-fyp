# User Profile API Endpoints Documentation

## Overview
Three main endpoints handle user profile and statistics functionality.

---

## Endpoint 1: Get User Statistics

### Endpoint
```
GET /api/user-stats
```

### Authentication
**Required**: Bearer token in Authorization header

### Request Headers
```javascript
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

### Response (200 OK)
```javascript
{
  "totalScans": 12,
  "positiveScans": 3,
  "negativeScans": 9,
  "averageConfidence": 78.45,
  "recentScans": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "patientName": "John Smith",
      "patientId": "PAT001",
      "result": "Positive",
      "confidence": 85.5,
      "createdAt": "2024-01-15T10:30:00"
    },
    // ... more scans
  ]
}
```

### Error Responses

**401 Unauthorized**
```javascript
{ "error": "Missing auth header" }
{ "error": "Invalid or expired token" }
```

**404 Not Found**
```javascript
{ "error": "User not found" }
```

### Example Usage (Frontend)
```javascript
import { getUserStats } from "../api";

try {
  const response = await getUserStats();
  console.log(response.data);
  // {
  //   totalScans: 12,
  //   positiveScans: 3,
  //   negativeScans: 9,
  //   averageConfidence: 78.45,
  //   recentScans: [...]
  // }
} catch (error) {
  console.error("Failed to fetch stats:", error);
}
```

---

## Endpoint 2: Get User Reports

### Endpoint
```
GET /api/user-reports
```

### Authentication
**Required**: Bearer token in Authorization header

### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number for pagination |
| limit | number | 10 | Results per page |
| filter | string | "all" | Filter: 'all', 'positive', or 'negative' |

### Request Examples
```
GET /api/user-reports
GET /api/user-reports?page=1&limit=10
GET /api/user-reports?filter=positive&page=1
GET /api/user-reports?filter=negative&limit=20
```

### Response (200 OK)
```javascript
{
  "reports": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "patientName": "John Doe",
      "patientId": "PAT001",
      "doctorId": "doc123",
      "age": 45,
      "gender": "Male",
      "result": "Positive",
      "confidence": 85.5,
      "scanDate": "2024-01-15",
      "originalImagePath": "/path/to/image",
      "segmentedImagePath": "/path/to/segmented",
      "createdAt": "2024-01-15T10:30:00"
    },
    // ... more reports
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

### Error Responses

**401 Unauthorized**
```javascript
{ "error": "Missing auth header" }
{ "error": "Invalid or expired token" }
```

**404 Not Found**
```javascript
{ "error": "User not found" }
```

### Example Usage (Frontend)
```javascript
import { getUserReports } from "../api";

// Get first page
const response1 = await getUserReports(1, 10, "all");
console.log(response1.data.reports);

// Get page 2 with only positive results
const response2 = await getUserReports(2, 10, "positive");

// Get all negative results
const response3 = await getUserReports(1, 50, "negative");
```

---

## Endpoint 3: Save Report (Modified)

### Endpoint
```
POST /api/save-report
```

### Authentication
**Optional**: Bearer token in Authorization header (auto-associates with user)

### Request Body
```javascript
{
  "patientName": "John Doe",
  "patientId": "PAT001",
  "age": 45,
  "gender": "Male",
  "result": "Positive",
  "confidence": 85.5,
  "scanDate": "2024-01-15",
  "originalImagePath": "/path/to/original",
  "segmentedImagePath": "/path/to/segmented"
}
```

### Response (201 Created)
```javascript
{
  "message": "Report saved successfully",
  "reportId": "507f1f77bcf86cd799439011"
}
```

### What Changed
- Now automatically extracts `doctorId` from Bearer token
- Stores `doctorId` in report for future filtering
- Allows tracking which doctor performed each scan

### Error Responses

**400 Bad Request**
```javascript
{ "error": "Patient ID is required" }
{ "error": "Failed to save report: <error details>" }
```

### Example Usage (Frontend)
```javascript
import axiosInstance from "./axiosConfig";

const reportData = {
  patientName: "John Doe",
  patientId: "PAT001",
  age: 45,
  gender: "Male",
  result: "Positive",
  confidence: 85.5,
  scanDate: new Date().toISOString().split('T')[0],
  originalImagePath: "/static/results/original.jpg",
  segmentedImagePath: "/static/results/segmented.jpg"
};

try {
  const response = await axiosInstance.post("/api/save-report", reportData);
  console.log("Report saved:", response.data.reportId);
} catch (error) {
  console.error("Failed to save report:", error);
}
```

---

## Authentication & Token Management

### How Tokens Work
1. User logs in → receives token
2. Token stored in localStorage
3. Axios interceptor automatically adds token to all requests
4. Backend validates token and extracts user email
5. User data retrieved from database

### Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration
- Tokens expire based on backend configuration
- Expired tokens trigger 401 response
- Frontend redirects to login on 401

### Getting Token (Frontend)
```javascript
const token = localStorage.getItem("token");
console.log(token);
```

---

## Database Schema

### Reports Collection Fields
```javascript
{
  _id: ObjectId,
  patientName: String,
  patientId: String,
  doctorId: String,           // NEW - User's ID
  age: Number,
  gender: String,
  result: String,             // "Positive" or "Negative"
  confidence: Number,         // 0-100
  scanDate: String,
  originalImagePath: String,
  segmentedImagePath: String,
  createdAt: Date             // Auto-set by server
}
```

### Users Collection Fields (Reference)
```javascript
{
  _id: ObjectId,
  pmdcId: String,
  fullName: String,
  email: String,
  mobile: String,
  password: String,           // Hashed
  emailVerified: Boolean,
  isRegistered: Boolean,
  isActive: Boolean,
  createdAt: Date,
  lastLogin: Date
}
```

---

## Performance Considerations

### Recommended MongoDB Indexes
```javascript
// In MongoDB
db.reports.createIndex({ doctorId: 1, createdAt: -1 })
db.reports.createIndex({ doctorId: 1, result: 1 })
db.users.createIndex({ email: 1 })
```

### Query Optimization
- Statistics endpoint filters by doctorId for fast queries
- Pagination prevents loading too many results at once
- Recent scans limited to 5 for quick display

### Caching Opportunities (Future)
- Cache user stats for 5-10 minutes
- Cache recent scans list
- Invalidate cache when new report saved

---

## Error Handling

### Common Errors

| Error | Status | Meaning |
|-------|--------|---------|
| Missing auth header | 401 | No Bearer token provided |
| Invalid or expired token | 401 | Token invalid or expired |
| User not found | 404 | Token valid but user doesn't exist |
| Patient ID required | 400 | Missing patientId in request |
| Failed to save report | 500 | Database error |

### Handling in Frontend
```javascript
import { getUserStats } from "../api";
import { useNavigate } from "react-router-dom";

const fetchStats = async () => {
  try {
    const response = await getUserStats();
    setStats(response.data);
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired - redirect to login
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      setError("Failed to load data");
    }
  }
};
```

---

## Rate Limiting (Recommended for Production)

Consider implementing rate limiting:
- `/api/user-stats`: 10 requests/minute per user
- `/api/user-reports`: 5 requests/minute per user
- `/api/save-report`: 30 requests/minute per user

---

## CORS Configuration

Ensure backend CORS allows profile endpoints:
```python
CORS(
  app,
  resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}},
  supports_credentials=True,
)
```

---

## Future API Enhancements

1. **Filter by Date Range**
   ```
   GET /api/user-stats?from=2024-01-01&to=2024-01-31
   ```

2. **Export Statistics**
   ```
   GET /api/user-stats/export?format=csv
   GET /api/user-stats/export?format=pdf
   ```

3. **Detailed Report**
   ```
   GET /api/reports/:reportId
   ```

4. **Report Comments**
   ```
   POST /api/reports/:reportId/comments
   GET /api/reports/:reportId/comments
   ```

5. **Diagnostic Accuracy Tracking**
   ```
   GET /api/user-stats/accuracy
   ```
