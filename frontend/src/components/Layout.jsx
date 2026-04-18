import { useTheme } from "../context/ThemeContext";
import Sidebar from "./Sidebar";

export default function Layout({ children, active }) {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen flex ${isDarkMode ? "bg-gray-900" : "bg-gradient-to-br from-slate-50 via-blue-50/40 to-blue-100/60"}`}>
      <Sidebar active={active} />
      <main className={`flex-1 p-6 md:p-10 overflow-auto ${isDarkMode ? "bg-gray-900 text-white" : ""}`}>
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
