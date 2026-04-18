import axios from "axios";
import { AlertCircle, CheckCircle, Download, Loader2, Save } from "lucide-react";
import { useState } from "react";
import { downloadReportPDF } from "../utils/pdfGenerator";

export default function ResultDisplay({ 
  result, 
  originalImage, 
  segmentedImage, 
  patientInfo,
  onSaveSuccess 
}) {
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const isAneurysm = result?.label === "Positive";

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      setMessage("");
      
      // Convert segmentation URL to data if needed
      let segmentedData = null;
      if (segmentedImage && isAneurysm) {
        segmentedData = segmentedImage;
      }

      await downloadReportPDF(
        patientInfo,
        {
          label: result.label,
          confidence: result.confidence,
        },
        originalImage,
        segmentedData
      );
      
      setMessage("✅ Report downloaded successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("PDF download error:", error);
      setMessage("❌ Failed to download report");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setDownloading(false);
    }
  };

  const handleSaveToPatient = async () => {
    try {
      setSaving(true);
      setMessage("");

      const reportData = {
        patientName: patientInfo.patientName,
        patientId: patientInfo.patientId,
        age: patientInfo.age,
        gender: patientInfo.gender,
        result: result.label,
        confidence: result.confidence,
        scanDate: new Date().toISOString(),
        originalImagePath: originalImage,
        segmentedImagePath: segmentedImage || null,
      };

      // Save to backend
      const response = await axios.post(
        "http://127.0.0.1:5000/api/save-report",
        reportData
      );

      setMessage("✅ Report saved to patient file successfully!");
      if (onSaveSuccess) {
        onSaveSuccess(response.data);
      }
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Save error:", error);
      setMessage(error.response?.data?.error || "❌ Failed to save report");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Result Badge */}
      <div className={`rounded-2xl p-6 border-2 ${isAneurysm ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
        <div className="flex items-center gap-3 mb-2">
          {isAneurysm ? (
            <AlertCircle className="w-6 h-6 text-red-600" />
          ) : (
            <CheckCircle className="w-6 h-6 text-green-600" />
          )}
          <h3 className={`text-xl font-bold ${isAneurysm ? "text-red-900" : "text-green-900"}`}>
            {isAneurysm ? "Aneurysm Detected" : "No Aneurysm Detected"}
          </h3>
        </div>
        <p className={`text-sm ${isAneurysm ? "text-red-700" : "text-green-700"}`}>
          Confidence Score: <span className="font-semibold">{result?.confidence?.toFixed(1)}%</span>
        </p>
      </div>

      {/* Image Comparison */}
      <div className="grid grid-cols-2 gap-6">
        {/* Original Image */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-700">Original Scan</p>
          </div>
          <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-auto">
            {originalImage ? (
              <img src={originalImage} alt="Original" className="w-full h-full object-contain p-4" />
            ) : (
              <p className="text-gray-400">No image</p>
            )}
          </div>
        </div>

        {/* Segmented Image */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-700">Segmented Result</p>
          </div>
          <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-auto">
            {segmentedImage && isAneurysm ? (
              <img src={segmentedImage} alt="Segmented" className="w-full h-full object-contain p-4" />
            ) : (
              <p className="text-gray-400">{isAneurysm ? "Processing..." : "N/A"}</p>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Details */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-4">Analysis Details</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-600 mb-1">Prediction</p>
            <p className="text-lg font-bold text-gray-900">{result?.label}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-600 mb-1">Confidence</p>
            <p className="text-lg font-bold text-gray-900">{result?.confidence?.toFixed(1)}%</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-600 mb-1">Scan Date</p>
            <p className="text-lg font-bold text-gray-900">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-xl text-center font-semibold ${
          message.includes("✅") 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleDownloadPDF}
          disabled={downloading || saving}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download Report as PDF
            </>
          )}
        </button>
        <button
          onClick={handleSaveToPatient}
          disabled={downloading || saving}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save to Patient File
            </>
          )}
        </button>
      </div>
    </div>
  );
}
