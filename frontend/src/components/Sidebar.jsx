import { FileText, Home, LogOut, Settings, Upload, User, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar({ active }) {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const navItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Upload Scan", icon: Upload, path: "/upload-scan" },
    { name: "Report History", icon: FileText, path: "/report-history" },
    { name: "Patients", icon: Users, path: "/patients" },
    { name: "Profile", icon: User, path: "/profile" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  // ✅ Logout function
  const handleLogout = () => {
    // Clear stored auth token
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Optional: clear any state or cache
    sessionStorage.clear();

    // Redirect to login
    navigate("/");

    // (Optional) show feedback
    alert("You have been logged out successfully.");
  };

  return (
    <aside className={`w-64 shadow-lg flex flex-col justify-between rounded-r-2xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      {/* Logo Header */}
      <div>
        <div className={`p-6 flex items-center space-x-2 border-b ${isDarkMode ? "border-gray-700" : ""}`}>
          <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold text-lg">
            AI
          </div>
          <h1 className={`font-semibold text-sm leading-tight ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
            INTRACRANIAL ANEURYSM DETECTION SYSTEM
          </h1>
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.name;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center w-full px-6 py-2 font-medium transition ${
                  isActive
                    ? isDarkMode 
                      ? "text-blue-400 bg-gray-700 border-l-4 border-blue-400"
                      : "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                    : isDarkMode
                    ? "text-gray-400 hover:bg-gray-700 hover:text-blue-400"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className={`border-t p-6 flex items-center justify-between text-sm ${isDarkMode ? "border-gray-700 text-gray-400" : "text-gray-500"}`}>
        <span>Prefuogee</span>
        <button
          onClick={handleLogout}
          className={`flex items-center transition ${isDarkMode ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500"}`}
        >
          <LogOut className="w-4 h-4 mr-1" />
          Logout
        </button>
      </div>
    </aside>
  );
}
