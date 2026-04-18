import { Bell, CheckCircle, Eye, Moon, Shield, Sun, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import Layout from "../components/Layout";
import { useTheme } from "../context/ThemeContext";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  
  // Account settings
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  
  // Preferences
  const [dataRetention, setDataRetention] = useState("7 years");
  const [autoSave, setAutoSave] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [scanAlerts, setScanAlerts] = useState(true);
  
  // Change password
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axiosInstance.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("📝 User data loaded:", res.data);
        setUser(res.data);
        setFullName(res.data.fullName || "");
        setEmail(res.data.email || "");
        setMobile(res.data.mobile || "");
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle save preferences
  const handleSavePreferences = async () => {
    try {
      const preferences = {
        dataRetention,
        autoSave,
        emailNotifications,
        scanAlerts,
      };
      
      // Save to localStorage for now
      localStorage.setItem("user-preferences", JSON.stringify(preferences));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      console.log("✅ Preferences saved");
    } catch (err) {
      console.error("Error saving preferences:", err);
      setError("Failed to save preferences");
    }
  };

  // Handle change password
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await axiosInstance.post("/api/auth/change-password", {
        oldPassword,
        newPassword,
      });

      setSaved(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSaved(false), 3000);
      console.log("✅ Password changed successfully");
    } catch (err) {
      console.error("Error changing password:", err);
      setError(err.response?.data?.error || "Failed to change password");
    }
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // TODO: Implement account deletion endpoint
      console.log("Account deletion requested");
    }
  };

  if (loading) {
    return (
      <Layout active="Settings">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout active="Settings">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Settings</h1>
        <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} mt-2`}>Manage your account and preferences</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? "bg-red-900 text-red-200" : "bg-red-50 text-red-700"}`}>
          {error}
        </div>
      )}

      {/* Success Message */}
      {saved && (
        <div className={`mb-6 flex items-center space-x-2 p-4 rounded-lg ${isDarkMode ? "bg-green-900 text-green-200" : "bg-green-50 text-green-700"}`}>
          <CheckCircle className="w-4 h-4" />
          <p className="text-sm">Changes saved successfully.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ========== ACCOUNT SETTINGS ========== */}
        <div className={`lg:col-span-2 shadow-sm rounded-xl p-6 border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <h2 className={`text-lg font-semibold mb-6 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            <Shield className="w-5 h-5" />
            Account Settings
          </h2>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-4 py-2 mt-1 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className={`w-full px-4 py-2 mt-1 rounded-lg border ${
                  isDarkMode 
                    ? "bg-gray-600 border-gray-600 text-gray-400" 
                    : "bg-gray-100 border-gray-300 text-gray-500"
                } cursor-not-allowed`}
              />
              <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Email cannot be changed</p>
            </div>

            {/* Mobile */}
            <div>
              <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Mobile Number</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className={`w-full px-4 py-2 mt-1 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* PMDC ID */}
            <div>
              <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>PMDC ID</label>
              <input
                type="text"
                value={user?.pmdcId || ""}
                disabled
                className={`w-full px-4 py-2 mt-1 rounded-lg border ${
                  isDarkMode 
                    ? "bg-gray-600 border-gray-600 text-gray-400" 
                    : "bg-gray-100 border-gray-300 text-gray-500"
                } cursor-not-allowed`}
              />
            </div>

            <hr className={isDarkMode ? "border-gray-700" : ""} />

            {/* Change Password Section */}
            <div>
              <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Change Password</h3>
              
              <div className="space-y-3">
                {/* Old Password */}
                <div className="relative">
                  <label className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Current Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className={`w-full px-4 py-2 mt-1 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>New Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full px-4 py-2 mt-1 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Confirm New Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-2 mt-1 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-8 ${isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    {showPassword ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4 opacity-50" />}
                  </button>
                </div>

                <button
                  onClick={handleChangePassword}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition mt-2"
                >
                  Change Password
                </button>
              </div>
            </div>

            <hr className={isDarkMode ? "border-gray-700" : ""} />

            {/* Danger Zone */}
            <div>
              <h3 className={`text-sm font-semibold mb-3 text-red-600`}>Danger Zone</h3>
              <button
                onClick={handleDeleteAccount}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* ========== PREFERENCES & APPEARANCE ========== */}
        <div className={`lg:col-span-1 shadow-sm rounded-xl p-6 border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <h2 className={`text-lg font-semibold mb-6 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            <Bell className="w-5 h-5" />
            Preferences
          </h2>

          <div className="space-y-5">
            
            {/* Theme Toggle */}
            <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-medium flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  Theme
                </span>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-full py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </button>
            </div>

            {/* Data Retention */}
            <div>
              <label className={`text-sm font-medium block mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Data Retention
              </label>
              <select
                value={dataRetention}
                onChange={(e) => setDataRetention(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option>1 year</option>
                <option>3 years</option>
                <option>5 years</option>
                <option>7 years</option>
              </select>
            </div>

            {/* Auto Save */}
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Auto Save Reports</span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={() => setAutoSave(!autoSave)}
                  className="sr-only peer"
                />
                <div className={`relative w-11 h-6 rounded-full transition ${isDarkMode ? (autoSave ? "bg-blue-600" : "bg-gray-600") : (autoSave ? "bg-blue-600" : "bg-gray-300")}`}>
                  <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 shadow transition-transform duration-300 ${autoSave ? "translate-x-5" : "translate-x-0"}`}></div>
                </div>
              </label>
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Email Notifications</span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                  className="sr-only peer"
                />
                <div className={`relative w-11 h-6 rounded-full transition ${isDarkMode ? (emailNotifications ? "bg-blue-600" : "bg-gray-600") : (emailNotifications ? "bg-blue-600" : "bg-gray-300")}`}>
                  <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 shadow transition-transform duration-300 ${emailNotifications ? "translate-x-5" : "translate-x-0"}`}></div>
                </div>
              </label>
            </div>

            {/* Scan Alerts */}
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Scan Alerts</span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={scanAlerts}
                  onChange={() => setScanAlerts(!scanAlerts)}
                  className="sr-only peer"
                />
                <div className={`relative w-11 h-6 rounded-full transition ${isDarkMode ? (scanAlerts ? "bg-blue-600" : "bg-gray-600") : (scanAlerts ? "bg-blue-600" : "bg-gray-300")}`}>
                  <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 shadow transition-transform duration-300 ${scanAlerts ? "translate-x-5" : "translate-x-0"}`}></div>
                </div>
              </label>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSavePreferences}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition mt-4"
            >
              Save Preferences
            </button>
          </div>
        </div>

      </div>

      {/* Footer */}
      <p className={`text-xs mt-8 text-center ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
        Prototype v1.0 | IADS © 2025
      </p>
    </Layout>
  );
}
