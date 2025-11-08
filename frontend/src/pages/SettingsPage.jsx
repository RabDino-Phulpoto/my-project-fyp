import { CheckCircle } from "lucide-react";
import { useState } from "react";
import Layout from "../components/Layout";

export default function SettingsPage() {
  const [theme, setTheme] = useState("Dark Mode");
  const [retention, setRetention] = useState("7 years");
  const [autoSave, setAutoSave] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Layout active="Settings">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">Settings</h2>

      <div className="grid grid-cols-2 gap-8">
        {/* Account Settings */}
        <div className="bg-white shadow rounded-xl p-6 border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Account Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                value="Dr. Alice Johnson"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Email Address</label>
              <input
                type="email"
                value="alice.johnson@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
              Change Password
            </button>
          </div>
        </div>

        {/* System Preferences */}
        <div className="bg-white shadow rounded-xl p-6 border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            System Preferences
          </h3>

          <div className="space-y-4">
            {/* Theme */}
            <div>
              <label className="text-sm text-gray-600">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option>Light Mode</option>
                <option>Dark Mode</option>
              </select>
            </div>

            {/* Data Retention */}
            <div>
              <label className="text-sm text-gray-600">
                Data Retention Policy
              </label>
              <select
                value={retention}
                onChange={(e) => setRetention(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option>1 year</option>
                <option>3 years</option>
                <option>5 years</option>
                <option>7 years</option>
              </select>
            </div>

            {/* Auto Save */}
            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-sm text-gray-600">Auto Save Reports</span>
              <label className="inline-flex items-center cursor-pointer relative">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={() => setAutoSave(!autoSave)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 relative transition">
                  <div className="absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-all peer-checked:translate-x-5"></div>
                </div>
              </label>
            </div>

            {/* Preferences Saved */}
            {saved && (
              <div className="flex items-center space-x-2 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg px-4 py-2">
                <CheckCircle className="w-4 h-4" />
                <p className="text-sm">Preferences saved.</p>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition mt-2"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        Prototype v1.0 | IADS © 2025
      </p>
    </Layout>
  );
}
