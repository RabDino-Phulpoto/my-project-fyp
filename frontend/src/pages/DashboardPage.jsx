import { Brain, Clock, FileText, Loader, TrendingUp, Upload, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo, getUserReports, getUserStats } from "../api";
import Layout from "../components/Layout";
import QuickActionCard from "../components/QuickActionCard";
import StatCard from "../components/StatCard";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState("Doctor");
  const [stats, setStats] = useState({
    totalScans: 0,
    aneurysmsDetected: 0,
    positiveRate: 0,
    patientsManaged: 0,
  });
  const [recentScans, setRecentScans] = useState([]);
  const [loadingScans, setLoadingScans] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await getUserInfo(token);
        setDoctorName(res.data.fullName || "Doctor");
        
        // Fetch actual stats from backend
        const statsRes = await getUserStats();
        const userStats = statsRes.data;
        
        const positiveRate = userStats.totalScans > 0 
          ? ((userStats.positiveScans / userStats.totalScans) * 100).toFixed(1)
          : 0;
        
        setStats({
          totalScans: userStats.totalScans,
          aneurysmsDetected: userStats.positiveScans,
          positiveRate: parseFloat(positiveRate),
          patientsManaged: userStats.totalScans,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        // Keep default stats on error, don't redirect
        setDoctorName("Doctor");
        setStats({
          totalScans: 0,
          aneurysmsDetected: 0,
          positiveRate: 0,
          patientsManaged: 0,
        });
      }
    };

    // Fetch recent scans
    const fetchRecentScans = async () => {
      try {
        setLoadingScans(true);
        const res = await getUserReports(1, 3, "all");
        const reportsData = res.data.reports || [];
        
        // Format reports for display
        const formattedScans = reportsData.map((report) => ({
          id: report._id,
          patientName: report.patientName,
          patientId: report.patientId,
          scanDate: new Date(report.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          result: report.result?.toLowerCase() || "unknown",
          confidence: report.confidence || 0,
        }));
        
        setRecentScans(formattedScans);
      } catch (err) {
        console.error("Error fetching recent scans:", err);
        setRecentScans([]);
      } finally {
        setLoadingScans(false);
      }
    };

    fetchUser();
    fetchRecentScans();
  }, [navigate]);

  return (
    <Layout active="Dashboard">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {doctorName.startsWith("Dr.") ? doctorName : `Dr. ${doctorName}`}
        </h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your scans today</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Upload}
          label="Total Scans Uploaded"
          value={stats.totalScans}
          trend={5}
          color="blue"
        />
        <StatCard
          icon={Brain}
          label="Aneurysms Detected"
          value={stats.aneurysmsDetected}
          trend={-2}
          color="red"
        />
        <StatCard
          icon={TrendingUp}
          label="Positive Detection Rate"
          value={`${stats.positiveRate}%`}
          color="purple"
        />
        <StatCard
          icon={Users}
          label="Patients Managed"
          value={stats.patientsManaged}
          trend={3}
          color="green"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickActionCard
            icon={Upload}
            title="Analyze New Scan"
            description="Upload and analyze a new brain MRI scan"
            onClick={() => navigate("/upload-scan")}
            color="blue"
          />
          <QuickActionCard
            icon={FileText}
            title="View Reports"
            description="Browse all patient reports and history"
            onClick={() => navigate("/report-history")}
            color="purple"
          />
          <QuickActionCard
            icon={Users}
            title="Manage Patients"
            description="View and manage patient information"
            onClick={() => navigate("/patients")}
            color="green"
          />
          <QuickActionCard
            icon={Clock}
            title="Recent Activity"
            description="Check your latest scan analysis"
            onClick={() => navigate("/report-history")}
            color="blue"
          />
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Recent Scans</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Result</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loadingScans ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <Loader className="w-5 h-5 animate-spin text-blue-600 mr-2" />
                      <span className="text-gray-600">Loading recent scans...</span>
                    </div>
                  </td>
                </tr>
              ) : recentScans.length > 0 ? (
                recentScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{scan.patientName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{scan.scanDate}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          scan.result === "positive"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {scan.result.charAt(0).toUpperCase() + scan.result.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{(scan.confidence * 100).toFixed(1)}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No recent scans available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
