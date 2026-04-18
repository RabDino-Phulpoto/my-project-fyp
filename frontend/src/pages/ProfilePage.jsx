import { Activity, AlertCircle, Calendar, CheckCircle, Mail, Phone, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo, getUserStats } from "../api";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user info
        const userRes = await getUserInfo(token);
        setUser(userRes.data);

        // Fetch stats
        const statsRes = await getUserStats();
        setStats(statsRes.data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <Layout active="Profile">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout active="Profile">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout active="Profile">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">View your account information and scan statistics</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* User Information Card */}
        <div className="col-span-2 bg-white shadow-sm rounded-xl border border-gray-200 p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.fullName || "Doctor"}</h2>
              <p className="text-gray-600 mt-1">PMDC ID: {user?.pmdcId}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {user?.fullName?.charAt(0) || "D"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-900 font-medium">{user?.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Mobile</p>
                <p className="text-gray-900 font-medium">{user?.mobile || "N/A"}</p>
              </div>
            </div>

            {/* Account Created */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Created</p>
                <p className="text-gray-900 font-medium">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Last Login */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Login</p>
                <p className="text-gray-900 font-medium">
                  {user?.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : "Never"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Scans</p>
              <p className="text-2xl font-bold text-blue-600">{stats?.totalScans || 0}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Positive Results</p>
              <p className="text-2xl font-bold text-green-600">{stats?.positiveScans || 0}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Negative Results</p>
              <p className="text-2xl font-bold text-red-600">{stats?.negativeScans || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Activity}
          label="Total Scans"
          value={stats?.totalScans || 0}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={CheckCircle}
          label="Positive Results"
          value={stats?.positiveScans || 0}
          bgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          icon={AlertCircle}
          label="Negative Results"
          value={stats?.negativeScans || 0}
          bgColor="bg-red-50"
          iconColor="text-red-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Confidence"
          value={`${stats?.averageConfidence || 0}%`}
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Recent Scans */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Scans</h3>
        
        {stats?.recentScans && stats.recentScans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Patient</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Patient ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Result</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Confidence</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentScans.map((scan) => (
                  <tr key={scan._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{scan.patientName}</td>
                    <td className="py-3 px-4 text-gray-600">{scan.patientId}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          scan.result === "Positive"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {scan.result}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{scan.confidence}%</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(scan.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No scans yet. Start by uploading a scan!</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
