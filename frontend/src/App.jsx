import { Route, Routes } from "react-router-dom";

// Pages
import AboutHelpPage from "./pages/AboutHelpPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import NeedHelpPage from "./pages/NeedHelpPage";
import ProcessingPage from "./pages/ProcessingPage";
import RegisterPage from "./pages/RegisterPage";
import ReportHistoryPage from "./pages/ReportHistoryPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ResultPage from "./pages/ResultPage";
import SettingsPage from "./pages/SettingsPage";
import UploadScanPage from "./pages/UploadScanPage";

// 🔒 Import the ProtectedRoute component
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* ---------- Public (Auth) Routes ---------- */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* ---------- Protected Routes ---------- */}
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
