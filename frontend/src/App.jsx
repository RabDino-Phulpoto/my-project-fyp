import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

// Public Pages
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LandingPage from "./pages/LandingPage"; // 🌟 Added for your new homepage
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Protected Pages
import AboutHelpPage from "./pages/AboutHelpPage";
import DashboardPage from "./pages/DashboardPage";
import NeedHelpPage from "./pages/NeedHelpPage";
import PatientManagementPage from "./pages/PatientManagementPage";
import ProcessingPage from "./pages/ProcessingPage";
import ProfilePage from "./pages/ProfilePage";
import ReportHistoryPage from "./pages/ReportHistoryPage";
import ResultPage from "./pages/ResultPage";
import SettingsPage from "./pages/SettingsPage";
import UploadScanPage from "./pages/UploadScanPage";

// Auth Guard
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const navigate = useNavigate();

  // Initialize token on app load and set up axios interceptor
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Set axios default header for all requests
      import("axios").then((axiosModule) => {
        axiosModule.default.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      });
    }
  }, []);

  return (
    <Routes>

      {/* -------- Public Routes (NO LOGIN NEEDED) -------- */}
      <Route path="/" element={<LandingPage />} />          {/* 🌟 New Landing Page */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* -------- Protected Routes (LOGIN REQUIRED) -------- */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload-scan"
        element={
          <ProtectedRoute>
            <UploadScanPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/results"
        element={
          <ProtectedRoute>
            <ResultPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/report-history"
        element={
          <ProtectedRoute>
            <ReportHistoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patients"
        element={
          <ProtectedRoute>
            <PatientManagementPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/processing"
        element={
          <ProtectedRoute>
            <ProcessingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <AboutHelpPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <NeedHelpPage />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
