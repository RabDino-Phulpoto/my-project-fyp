import { Filter, RefreshCw, Search, Share2 } from "lucide-react";
import Layout from "../components/Layout";

export default function ReportHistoryPage() {
  const reports = [
    { name: "John Doe", type: "CT", date: "Mar 15, 2024", result: "Aneurysm" },
    { name: "John Doe", type: "MRI", date: "Mar 25, 2024", result: "No Aneurysm" },
    { name: "John Doe", type: "CT", date: "Mar 30, 2024", result: "Aneurysm" },
    { name: "John Doe", type: "MRI", date: "Mar 15, 2024", result: "No Aneurysm" },
    { name: "John Doe", type: "MRI", date: "Mar 15, 2024", result: "Aneurysm 92%" },
    { name: "John Doe", type: "CT", date: "Mar 16, 2024", result: "No Aneurysm" },
    { name: "John Doe", type: "MRI", date: "Mar 22, 2024", result: "Aneurysm 92%" },
    { name: "John Doe", type: "CT", date: "Mar 18, 2024", result: "No Aneurysm" },
    { name: "John Doe", type: "MRI", date: "Mar 17, 2024", result: "Aneurysm 70%" },
    { name: "John Doe", type: "MRI", date: "Mar 21, 2024", result: "No Aneurysm" },
    { name: "John Doe", type: "CT", date: "Mar 26, 2024", result: "No Aneurysm 81%" },
  ];

  return (
    <Layout active="Reports">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Report History</h2>

        <div className="flex space-x-2">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          {/* Filter Button */}
          <button className="flex items-center space-x-1 border border-gray-300 px-3 py-2 rounded-lg hover:bg-blue-50 transition">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Filter</span>
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-3 px-6 text-gray-600 font-medium">Patient Name</th>
              <th className="py-3 px-6 text-gray-600 font-medium">Scan Type</th>
              <th className="py-3 px-6 text-gray-600 font-medium">Date</th>
              <th className="py-3 px-6 text-gray-600 font-medium">Result</th>
              <th className="py-3 px-6 text-gray-600 font-medium text-right">
                <div className="flex items-center justify-end space-x-2">
                  <img
                    src="https://i.pravatar.cc/40"
                    alt="doctor"
                    className="w-6 h-6 rounded-full border"
                  />
                  <span>Dr. Alice Smith</span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report, index) => (
              <tr
                key={index}
                className="border-b hover:bg-blue-50 transition cursor-pointer"
              >
                <td className="py-3 px-6">{report.name}</td>
                <td className="py-3 px-6">{report.type}</td>
                <td className="py-3 px-6">{report.date}</td>
                <td className="py-3 px-6">{report.result}</td>
                <td className="py-3 px-6 flex items-center justify-end space-x-3 text-gray-500">
                  <Share2 className="w-4 h-4 hover:text-blue-600 cursor-pointer" />
                  <RefreshCw className="w-4 h-4 hover:text-blue-600 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 text-sm text-gray-500 bg-gray-50">
          <button className="hover:text-blue-600 transition">Previous</button>
          <p>
            Page <span className="font-medium text-gray-700">1</span> of{" "}
            <span className="font-medium text-gray-700">5</span>
          </p>
          <button className="hover:text-blue-600 transition">Next</button>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        Prototype v1.0 | IADS © 2025
      </p>
    </Layout>
  );
}
