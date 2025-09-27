// pages/manager/Reports.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
} from "lucide-react";
// import { authService } from "../../services/auth";

const Reports = () => {
  const navigate = useNavigate();
//   const user = authService.getCurrentUser();
  const [dateRange, setDateRange] = useState("30days");

  // Dummy data for reports
  const reportData = {
    summary: {
      totalRequests: 45,
      approved: 32,
      pending: 8,
      rejected: 5,
      totalAmount: 28500,
      averageAmount: 633,
      approvalRate: 71,
    },
    departmentBreakdown: [
      {
        department: "Engineering",
        requests: 18,
        amount: 12500,
        approvalRate: 78,
      },
      { department: "Marketing", requests: 12, amount: 8500, approvalRate: 67 },
      { department: "Sales", requests: 8, amount: 4500, approvalRate: 75 },
      { department: "Design", requests: 7, amount: 3000, approvalRate: 86 },
    ],
    monthlyTrends: [
      { month: "Jan", requests: 8, amount: 5200 },
      { month: "Feb", requests: 12, amount: 7800 },
      { month: "Mar", requests: 10, amount: 6500 },
      { month: "Apr", requests: 15, amount: 9000 },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/manager/dashboard")}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Team Reports</h1>
              <p className="text-gray-600">
                Analytics and insights for your team's cash advance activity
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="year">This year</option>
              </select>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Requests
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.summary.totalRequests}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.summary.approved}
                </p>
                <p className="text-sm text-green-600">
                  {reportData.summary.approvalRate}% approval rate
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${reportData.summary.totalAmount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Avg: ${reportData.summary.averageAmount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.summary.pending}
                </p>
                <p className="text-sm text-yellow-600">Awaiting approval</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Department Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Department Breakdown
            </h2>
            <div className="space-y-4">
              {reportData.departmentBreakdown.map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">
                      {dept.department}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {dept.requests} requests
                    </div>
                    <div className="text-sm text-gray-500">
                      ${dept.amount.toLocaleString()} • {dept.approvalRate}%
                      approved
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Monthly Trends
            </h2>
            <div className="space-y-4">
              {reportData.monthlyTrends.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-900">
                      {month.month}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {month.requests} requests
                    </div>
                    <div className="text-sm text-gray-500">
                      ${month.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2.1 days</div>
              <div className="text-sm text-gray-500">Average approval time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">94%</div>
              <div className="text-sm text-gray-500">
                On-time retirement rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">$2,500</div>
              <div className="text-sm text-gray-500">
                Monthly budget utilization
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
