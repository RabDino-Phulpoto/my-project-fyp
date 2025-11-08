import { BarChart2, FileText, Home, LogOut, Settings, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ active }) {
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Upload Scan", icon: Upload, path: "/upload" },
    { name: "Results", icon: BarChart2, path: "/results" },
    { name: "Reports", icon: FileText, path: "/reports" },
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
    <aside className="w-64 bg-white shadow-lg flex flex-col justify-between rounded-r-2xl">
      {/* Logo Header */}
      <div>
        <div className="p-6 flex items-center space-x-2 border-b">
          <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold text-lg">
            AI
          </div>
          <h1 className="font-semibold text-sm text-gray-700 leading-tight">
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
                    ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
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
      <div className="border-t p-6 flex items-center justify-between text-gray-500 text-sm">
        <span>Prefuogee</span>
        <button
          onClick={handleLogout}
          className="flex items-center text-gray-500 hover:text-red-500 transition"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Logout
        </button>
      </div>
    </aside>
  );
}
