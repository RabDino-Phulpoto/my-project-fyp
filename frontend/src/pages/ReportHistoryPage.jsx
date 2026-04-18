import { Download, Eye, Filter, Loader, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserReports } from "../api";
import Layout from "../components/Layout";

export default function ReportHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResult, setFilterResult] = useState("all");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await getUserReports(page, 10, filterResult);
        const reportsData = res.data.reports || [];
        
        // Convert createdAt to display date
        const formattedReports = reportsData.map((report) => ({
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
          fullData: report,
        }));
        
        setReports(formattedReports);
        setTotalPages(res.data.pagination?.pages || 1);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [filterResult, page]);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <Layout active="Reports">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Report History</h1>
        <p className="text-gray-600 mb-8">View and manage all patient scan reports</p>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Results</option>
              <option value="positive">Positive Only</option>
              <option value="negative">Negative Only</option>
            </select>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading reports...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Patient Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Patient ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Scan Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Result</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Confidence</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report) => (
                        <tr key={report.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-gray-900">{report.patientName}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-600">{report.patientId}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-600">{report.scanDate}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                report.result === "negative"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {report.result.charAt(0).toUpperCase() + report.result.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-gray-900">{report.confidence.toFixed(1)}%</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="View Report"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Download PDF"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Delete Report"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <p className="text-gray-600">No reports found. Upload and save a scan to see results here.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
