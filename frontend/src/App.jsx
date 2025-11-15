import { Route, Routes } from "react-router-dom";

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
import ProcessingPage from "./pages/ProcessingPage";
import ReportHistoryPage from "./pages/ReportHistoryPage";
import ResultPage from "./pages/ResultPage";
import SettingsPage from "./pages/SettingsPage";
import UploadScanPage from "./pages/UploadScanPage";

// Auth Guard
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
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
        path="/upload"
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
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportHistoryPage />
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
