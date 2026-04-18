import { Download, Edit2, Loader, Search, Trash2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import Layout from "../components/Layout";
import { downloadReportPDF, generateReportPDF } from "../utils/pdfGenerator";

export default function PatientManagementPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPatient, setEditingPatient] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [downloading, setDownloading] = useState(null);

  // Fetch patients
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/patients");
      
      const formattedPatients = (res.data || []).map((patient) => ({
        id: patient._id,
        patientId: patient._id,
        name: patient.patientName,
        age: patient.age || "N/A",
        gender: patient.gender || "N/A",
        totalScans: patient.totalScans || 0,
        lastScan: patient.lastScan 
          ? new Date(patient.lastScan).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A",
        rawData: patient,
      }));
      
      setPatients(formattedPatients);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Edit modal handlers
  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setEditFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
    });
  };

  const handleSaveEdit = async () => {
    try {
      // Make API call to update patient in database
      await axiosInstance.put(`/api/patients/${editingPatient.id}`, {
        patientName: editFormData.name || editingPatient.name,
        age: editFormData.age || editingPatient.age,
        gender: editFormData.gender || editingPatient.gender,
      });
      
      // Update local state after successful database update
      const updatedPatients = patients.map((p) =>
        p.id === editingPatient.id
          ? {
              ...p,
              name: editFormData.name || p.name,
              age: editFormData.age || p.age,
              gender: editFormData.gender || p.gender,
            }
          : p
      );
      setPatients(updatedPatients);
      setEditingPatient(null);
      setEditFormData({});
      alert("Patient updated successfully!");
    } catch (err) {
      console.error("Error updating patient:", err);
      alert("Failed to update patient. Please try again.");
    }
  };

  // Delete handler
  const handleDelete = async () => {
    try {
      // Make API call to delete patient from database
      await axiosInstance.delete(`/api/patients/${deleteConfirm.id}`);
      
      // Remove from local state after successful deletion
      setPatients(patients.filter((p) => p.id !== deleteConfirm.id));
      setDeleteConfirm(null);
      alert("Patient deleted successfully!");
    } catch (err) {
      console.error("Error deleting patient:", err);
      alert("Failed to delete patient. Please try again.");
    }
  };

  // Download PDF handler
  const handleDownloadPDF = async (patient) => {
    try {
      setDownloading(patient.id);
      
      await generateReportPDF(
        {
          patientName: patient.name,
          patientId: patient.id,
          age: patient.age,
          gender: patient.gender,
        },
        {
          label: "Patient Report",
          confidence: patient.totalScans,
        },
        null,
        null
      );
      
      await downloadReportPDF(`${patient.name}_Report.pdf`);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      alert("Failed to download report");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <Layout active="Patients">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Management</h1>
            <p className="text-gray-600">View and manage all registered patients</p>
          </div>
          <button 
            onClick={() => navigate("/upload-scan")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
          >
            <Upload className="w-4 h-4" />
            Scan
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading patients...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Patient Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Patient ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Age</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Gender</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Total Scans</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Last Scan</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-gray-900">{patient.name}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-600">{patient.id}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-600">{patient.age}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-600">{patient.gender}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {patient.totalScans}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-600">{patient.lastScan}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {/* Edit Button */}
                              <button 
                                onClick={() => handleEdit(patient)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" 
                                title="Edit Patient"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              
                              {/* Download PDF Button */}
                              <button 
                                onClick={() => handleDownloadPDF(patient)}
                                disabled={downloading === patient.id}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50" 
                                title="Download Report PDF"
                              >
                                {downloading === patient.id ? (
                                  <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Download className="w-4 h-4" />
                                )}
                              </button>
                              
                              {/* Delete Button */}
                              <button 
                                onClick={() => setDeleteConfirm(patient)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" 
                                title="Delete Patient"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center">
                          <p className="text-gray-600">No patients found. Upload scans to see patients here.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Patient</h2>
              <button 
                onClick={() => setEditingPatient(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Patient ID (Read-only) */}
              <div>
                <label className="text-sm font-medium text-gray-700">Patient ID (Cannot be changed)</label>
                <input
                  type="text"
                  value={editingPatient.id}
                  disabled
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Patient Name */}
              <div>
                <label className="text-sm font-medium text-gray-700">Patient Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter patient name"
                />
              </div>

              {/* Age */}
              <div>
                <label className="text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  value={editFormData.age}
                  onChange={(e) => setEditFormData({ ...editFormData, age: parseInt(e.target.value) || "N/A" })}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter age"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <select
                  value={editFormData.gender}
                  onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setEditingPatient(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Delete Patient?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete <strong>{deleteConfirm.name}</strong> and all their associated data?
            </p>
            <p className="text-sm text-red-600 mb-6">⚠️ This action cannot be undone.</p>

            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
