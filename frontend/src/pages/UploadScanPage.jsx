import { FileText, Loader2, UploadCloud } from "lucide-react";
import { useState } from "react";
import axiosInstance from "../axiosConfig";
import Layout from "../components/Layout";
import PatientModal from "../components/PatientModal";
import ResultDisplay from "../components/ResultDisplay";

export default function UploadScanPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);
  const [segmentedImage, setSegmentedImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResults(null);
      setSegmentedImage(null);
    } else {
      alert("Please upload a valid image file");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-blue-50", "border-blue-300");
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("bg-blue-50", "border-blue-300");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-blue-50", "border-blue-300");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const runAnalysis = async () => {
    if (!selectedFile) {
      alert("Please upload a scan first!");
      return;
    }

    setShowPatientModal(true);
  };

  const handlePatientSubmit = async (patientData) => {
    setPatientInfo(patientData);
    setShowPatientModal(false);
    setLoading(true);

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("patientName", patientData.patientName);
    formData.append("patientId", patientData.patientId);

    try {
      // First analysis - Detection
      const response = await axiosInstance.post("/api/analyze-scan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Analysis response:", response.data);
      
      // Transform response to match ResultDisplay expectations
      const analysisResult = {
        label: response.data.label, // "Positive" or "Negative"
        confidence: response.data.confidence, // percentage (0-100)
        segmentation_url: response.data.segmentation_url,
      };

      setResults(analysisResult);

      // If positive and segmentation URL provided, load the segmented image
      if (analysisResult.label === "Positive" && analysisResult.segmentation_url) {
        try {
          const segmentResponse = await axiosInstance.get(analysisResult.segmentation_url, {
            responseType: "blob",
          });
          const segmentedImageUrl = URL.createObjectURL(segmentResponse.data);
          setSegmentedImage(segmentedImageUrl);
        } catch (segError) {
          console.error("Failed to load segmented image:", segError);
        }
      }
    } catch (error) {
      console.error("Analysis Error:", error);
      alert(`Analysis failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout active="Upload Scan">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analyze Brain Scan</h1>
        <p className="text-gray-600 mb-8">Upload a brain MRI scan for AI-powered aneurysm detection</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center transition-all hover:border-blue-300 cursor-pointer mb-6"
            >
              <label htmlFor="fileInput" className="cursor-pointer block">
                <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-900 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Preview */}
            {preview && (
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm mb-6">
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-700">Preview</p>
                </div>
                <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-auto">
                  <img src={preview} alt="Preview" className="w-full h-full object-contain p-4" />
                </div>
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={runAnalysis}
              disabled={!selectedFile || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Analyze Scan
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
                <Loader2 className="w-12 h-12 text-blue-600 mx-auto animate-spin mb-4" />
                <p className="text-gray-900 font-semibold mb-2">Analyzing your scan...</p>
                <p className="text-sm text-gray-600">This usually takes 30-60 seconds</p>
              </div>
            ) : results ? (
              <ResultDisplay
                result={results}
                originalImage={preview}
                segmentedImage={segmentedImage}
                patientInfo={patientInfo}
              />
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
                <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-900 font-semibold mb-2">No analysis yet</p>
                <p className="text-sm text-gray-600">Upload a scan and click "Analyze Scan" to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <PatientModal
        isOpen={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        onSubmit={handlePatientSubmit}
      />
    </Layout>
  );
}