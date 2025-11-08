import { Brain } from "lucide-react";
import Layout from "../components/Layout";

export default function ResultPage() {
  return (
    <Layout active="Results">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">
        Scan Analysis Result
      </h2>

      {/* Analysis Section */}
      <div className="bg-white shadow-lg rounded-2xl p-8 grid grid-cols-2 gap-8 items-center">
        {/* Image Section */}
        <div className="flex flex-col items-center">
          <div className="bg-black rounded-lg overflow-hidden w-full max-w-sm">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/3a/MRI_head_with_fMRI_activation.jpg"
              alt="MRI Scan"
              className="w-full h-auto"
            />
          </div>
          <p className="mt-3 text-gray-600 text-sm font-medium">
            Original Scan
          </p>
        </div>

        {/* Analysis Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-blue-600 text-white rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold">Aneurysm Detected</h3>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="bg-white border rounded-lg p-4 text-center shadow-sm">
            <p className="text-gray-600 text-sm mb-2">Confidence Score</p>
            <div className="relative w-20 h-20 mx-auto">
              <svg
                className="w-20 h-20 transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-600"
                  strokeDasharray="87, 100"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-semibold text-blue-700">
                0.87
              </span>
            </div>
          </div>

          {/* Model Used */}
          <div className="bg-white border rounded-lg p-4 flex flex-col justify-center items-center shadow-sm">
            <p className="text-gray-600 text-sm mb-2">Model Used</p>
            <span className="font-medium text-gray-800">CNN + U-Net</span>
          </div>

          {/* Buttons */}
          <button className="col-span-2 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            Save Report
          </button>

          <button className="col-span-2 border border-blue-600 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition">
            View Full Report
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        Prototype v1.0 | IADS © 2025
      </p>
    </Layout>
  );
}
