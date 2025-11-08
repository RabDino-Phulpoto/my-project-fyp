import {
    Brain,
    FileText,
    LogOut,
    UploadCloud,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function ProcessingPage() {
  const [progress, setProgress] = useState(0);

  // Simulate progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col justify-between rounded-r-2xl">
        <div>
          <div className="p-6 flex items-center space-x-3 border-b border-blue-800">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              AI
            </div>
            <h1 className="text-sm font-medium leading-tight">
              INTRACRANIAL ANEURYSM DETECTION SYSTEM (IADS)
            </h1>
          </div>

          {/* Navigation */}
          <nav className="mt-6 space-y-3">
            <button className="flex items-center w-full px-6 py-2 text-blue-200 hover:text-white transition">
              <UploadCloud className="w-4 h-4 mr-3" />
              Upload Scan
            </button>
            <button className="flex items-center w-full px-6 py-2 text-blue-200 hover:text-white transition">
              <FileText className="w-4 h-4 mr-3" />
              Results
            </button>
            <button className="flex items-center w-full px-6 py-2 text-blue-200 hover:text-white transition">
              <FileText className="w-4 h-4 mr-3" />
              Reports
            </button>
          </nav>
        </div>

        <div className="p-6 border-t border-blue-800 flex items-center space-x-2 text-blue-200 hover:text-red-400 cursor-pointer transition">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </div>
      </aside>

      {/* Main Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-10">
        <div className="mb-10">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="w-10 h-10 text-blue-700" />
            <h1 className="text-xl font-semibold text-gray-800">
              INTRACRANIAL ANEURYSM DETECTION SYSTEM (IADS)
            </h1>
          </div>
        </div>

        {/* Analysis Card */}
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-lg">
          <div className="flex flex-col items-center mb-6">
            <Brain className="w-16 h-16 text-blue-600 mb-3" />
            <h2 className="text-2xl font-semibold text-blue-800">
              Analyzing Scan...
            </h2>
            <p className="text-blue-500 mt-1 text-lg font-medium">
              {progress}%
            </p>
          </div>

          <ul className="text-left space-y-2 text-gray-700 text-sm">
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              <span>Preprocessing Image</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              <span>Running Classification Model (CNN)</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              <span>Running Segmentation (U-Net)</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              <span>Generating Grad-CAM Visualization</span>
            </li>
          </ul>

          {/* Progress Bar */}
          <div className="mt-6 w-full bg-blue-100 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          Prototype v1.0 | IADS © 2025
        </p>
      </main>
    </div>
  );
}
