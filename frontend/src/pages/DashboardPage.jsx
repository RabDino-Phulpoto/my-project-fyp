import { BarChart2, FileText, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../api";
import Layout from "../components/Layout";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState("Loading...");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // if no token, redirect to login
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await getUserInfo(token);
        setDoctorName(res.data.name || "Doctor");
      } catch (err) {
        console.error(err);
        navigate("/"); // invalid token
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <Layout active="Dashboard">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800">
        Welcome {doctorName.startsWith("Dr.") ? doctorName : `Dr. ${doctorName}`}
      </h2>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Total Scans Uploaded</p>
            <h3 className="text-2xl font-bold text-gray-800">24</h3>
          </div>
          <Upload className="w-6 h-6 text-blue-600" />
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Aneurysms Detected</p>
            <h3 className="text-2xl font-bold text-gray-800">5</h3>
          </div>
          <BarChart2 className="w-6 h-6 text-blue-600" />
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Accuracy Rate</p>
            <h3 className="text-2xl font-bold text-gray-800">92%</h3>
          </div>
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {/* Quick Actions */}
      <section className="mt-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/upload")}
            className="px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition"
          >
            Upload New Scan
          </button>
          <button
            onClick={() => navigate("/reports")}
            className="px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition"
          >
            View Reports
          </button>
        </div>
      </section>

      {/* Chart Placeholder */}
      <section className="mt-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Weekly Analysis Volume
        </h3>
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="w-full h-48 flex items-center justify-center text-gray-400 text-sm">
            (Chart Component Here)
          </div>
        </div>
      </section>

      <p className="text-xs text-gray-400 mt-8">
        Prototype v1.0 | IADS © 2025
      </p>
    </Layout>
  );
}
