import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { managerService } from "../../services/manager";

const Reports = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("year");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);

  const getDateRange = (range: string) => {
    const endDate = new Date();
    const startDate = new Date();

    switch (range) {
      case "7days":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "90days":
        startDate.setDate(endDate.getDate() - 90);
        break;
      case "year":
        startDate.setMonth(0, 1); // January 1st of current year
        break;
    }

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  };

  const fetchReports = useCallback(async (range: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const dates = getDateRange(range);
      const data = await managerService.getReports(dates);
      setReportData(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports(dateRange);
  }, [fetchReports, dateRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getMonthName = (monthNumber: number) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthNumber - 1] || "N/A";
  };

  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Error</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => fetchReports(dateRange)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  const approvalRate =
    reportData.summary.totalRequests > 0
      ? Math.round(
          (reportData.summary.approvedRequests /
            reportData.summary.totalRequests) *
            100
        )
      : 0;

  const averageAmount =
    reportData.summary.totalRequests > 0
      ? Math.round(
          reportData.summary.totalAmount / reportData.summary.totalRequests
        )
      : 0;

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
                  {reportData.summary.approvedRequests}
                </p>
                <p className="text-sm text-green-600">
                  {approvalRate}% approval rate
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
                  {formatCurrency(reportData.summary.totalAmount)}
                </p>
                <p className="text-sm text-gray-500">
                  Avg: {formatCurrency(averageAmount)}
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
                  {reportData.summary.pendingRequests}
                </p>
                <p className="text-sm text-yellow-600">Awaiting approval</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Status Breakdown
            </h2>
            <div className="space-y-4">
              {reportData.statusBreakdown.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No data available for this period
                </p>
              ) : (
                reportData.statusBreakdown.map((status: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-3 ${
                          status._id === "approved"
                            ? "bg-green-500"
                            : status._id === "pending"
                            ? "bg-yellow-500"
                            : status._id === "rejected"
                            ? "bg-red-500"
                            : "bg-purple-500"
                        }`}
                      ></div>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {status._id}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {status.count} requests
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(status.totalAmount)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Monthly Trends
            </h2>
            <div className="space-y-4">
              {reportData.monthlyTrends.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No monthly data available
                </p>
              ) : (
                reportData.monthlyTrends.map((month: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900">
                        {getMonthName(month.month)} {month.year}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {month.totalRequests} requests
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(month.totalAmount)} •{" "}
                        {Math.round(month.approvalRate)}% approved
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Team Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {reportData.teamMembersCount}
              </div>
              <div className="text-sm text-gray-500">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(reportData.summary.approvedAmount)}
              </div>
              <div className="text-sm text-gray-500">Approved Amount</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(reportData.summary.pendingAmount)}
              </div>
              <div className="text-sm text-gray-500">Pending Amount</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
