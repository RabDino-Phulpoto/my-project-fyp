import { UploadCloud } from "lucide-react";
import { useState } from "react";
import Layout from "../components/Layout";

export default function UploadScanPage() {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
  };

  return (
    <Layout active="Upload Scan">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">
        Upload Medical Scan for Analysis
      </h2>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl shadow p-8">
        {/* Upload Box */}
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-xl p-10 cursor-pointer hover:bg-blue-50 transition"
        >
          <UploadCloud className="w-10 h-10 text-blue-500 mb-2" />
          <p className="text-gray-700 font-medium">Drag & drop to upload</p>
          <p className="text-sm text-gray-500 mt-1">
            DICOM (.dcm) / PNG / JPG — Max 10MB
          </p>
          <input
            id="file-upload"
            type="file"
            accept=".dcm,.png,.jpg,.jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
          {fileName && (
            <p className="mt-3 text-sm text-blue-600">
              Selected file: {fileName}
            </p>
          )}
        </label>

        {/* Optional Info */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Optional Patient Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Age"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Patient ID"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        {/* Run Analysis Button */}
        <button
          type="button"
          className="mt-8 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition flex justify-center items-center space-x-2"
        >
          <span>Run AI Analysis</span>
        </button>

        {/* Footer Info */}
        <p className="text-sm text-gray-500 mt-4">
          Supported Formats: DICOM (.dcm), PNG, JPG — Max 10 MB
        </p>
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        Prototype v1.0 | IADS © 2025
      </p>
    </Layout>
  );
}
