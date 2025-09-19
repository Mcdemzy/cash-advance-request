import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Users,
  AlertCircle,
  Filter,
  Download,
} from "lucide-react";
import { authService } from "../../services/auth";

interface CashAdvanceRequest {
  id: string;
  amount: number;
  purpose: string;
  status: "pending" | "approved" | "rejected" | "disbursed" | "retired";
  submittedDate: string;
  approvedDate?: string;
  disbursedDate?: string;
  retiredDate?: string;
  approverComments?: string;
  submittedBy: string;
  department: string;
  employeeId: string;
}

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [requests] = useState<CashAdvanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user?.role !== "manager") {
      navigate("/dashboard");
      return;
    }

    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "disbursed":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "retired":
        return <CheckCircle className="h-5 w-5 text-purple-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "disbursed":
        return "bg-blue-100 text-blue-800";
      case "retired":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Calculate statistics for the dashboard
  const stats = {
    totalRequests: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter(
      (r) => r.status === "approved" || r.status === "disbursed"
    ).length,
    retired: requests.filter((r) => r.status === "retired").length,
    totalAmount: requests.reduce((sum, req) => sum + req.amount, 0),
    pendingAmount: requests
      .filter((r) => r.status === "pending")
      .reduce((sum, req) => sum + req.amount, 0),
  };

  const pendingRequests = requests.filter((req) => req.status === "pending");
  const teamRequests = requests.slice(0, 5); // Show most recent 5 requests from team

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="hidden md:block ml-6">
                <h1 className="text-xl font-semibold text-gray-900">
                  AdvanceTracker
                </h1>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                  <Bell className="h-6 w-6" />
                </button>
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-2">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.firstName} {user?.lastName} (Manager)
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="flex items-center px-3 py-2">
              <div className="bg-blue-100 rounded-full p-2 mr-2">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.firstName} {user?.lastName} (Manager)
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Manager Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, Manager {user?.firstName}!
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("approvals")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "approvals"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Pending Approvals
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "team"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Team Requests
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Stats overview */}
            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        Team Requests
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {stats.totalRequests}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <AlertCircle className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        Pending Approval
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {stats.pending}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        Approved
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {stats.approved}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        Team Members
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">8</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Team requests */}
              <div className="lg:col-span-2">
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Recent Team Requests
                    </h3>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    {isLoading ? (
                      <div className="text-center py-4">
                        <p>Loading requests...</p>
                      </div>
                    ) : teamRequests.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No team requests
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Your team hasn't submitted any cash advance requests
                          yet.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                          {teamRequests.map((request) => (
                            <li key={request.id} className="py-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  {getStatusIcon(request.status)}
                                  <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-900">
                                      ${request.amount} - {request.purpose}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {request.submittedBy} •{" "}
                                      {request.department}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Submitted on{" "}
                                      {new Date(
                                        request.submittedDate
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                      request.status
                                    )}`}
                                  >
                                    {request.status.charAt(0).toUpperCase() +
                                      request.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="mt-6">
                      <button
                        onClick={() => navigate("/dashboard/team-requests")}
                        className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        View all team requests
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div>
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Quick Actions
                    </h3>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="space-y-4">
                      <button
                        onClick={() => navigate("/dashboard/approvals")}
                        className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-md text-left hover:bg-gray-50 cursor-pointer"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Review Requests
                          </p>
                          <p className="text-sm text-gray-500">
                            {stats.pending} requests pending approval
                          </p>
                        </div>
                        <FileText className="h-5 w-5 text-gray-400" />
                      </button>

                      <button
                        onClick={() => navigate("/dashboard/team")}
                        className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-md text-left hover:bg-gray-50 cursor-pointer"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Team Management
                          </p>
                          <p className="text-sm text-gray-500">
                            View your team members
                          </p>
                        </div>
                        <Users className="h-5 w-5 text-gray-400" />
                      </button>

                      <button
                        onClick={() => navigate("/dashboard/reports")}
                        className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-md text-left hover:bg-gray-50 cursor-pointer"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Team Reports
                          </p>
                          <p className="text-sm text-gray-500">
                            Department spending analytics
                          </p>
                        </div>
                        <FileText className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Team metrics */}
                <div className="mt-8 bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Team Metrics
                    </h3>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Team Members
                        </span>
                        <span className="text-sm font-medium text-blue-600">
                          8
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Pending Approvals
                        </span>
                        <span className="text-sm font-medium text-yellow-600">
                          {stats.pending}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Monthly Budget
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          $5,000
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Budget Used
                        </span>
                        <span className="text-sm font-medium text-red-600">
                          $3,200
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Approvals Tab */}
        {activeTab === "approvals" && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Pending Approvals
                </h3>
                <div className="flex space-x-2">
                  <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </button>
                  <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </button>
                </div>
              </div>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {isLoading ? (
                <div className="text-center py-4">
                  <p>Loading approvals...</p>
                </div>
              ) : pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No pending approvals
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    All team requests have been processed.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Request
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted By
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  ${request.amount}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {request.purpose}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {request.submittedBy}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {request.department}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(
                              request.submittedDate
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-green-600 hover:text-green-900 mr-3">
                              Approve
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === "team" && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Team Management
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900">
                  Your Team Members
                </h4>
                <p className="text-sm text-gray-500">
                  8 team members in your department
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Team member cards */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-3">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        John Smith
                      </h3>
                      <p className="text-sm text-gray-500">Senior Developer</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-sm text-gray-500">
                    <span>Requests: 3</span>
                    <span>Pending: 1</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-3">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Sarah Johnson
                      </h3>
                      <p className="text-sm text-gray-500">
                        Marketing Specialist
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-sm text-gray-500">
                    <span>Requests: 5</span>
                    <span>Pending: 2</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-3">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Michael Brown
                      </h3>
                      <p className="text-sm text-gray-500">Sales Executive</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-sm text-gray-500">
                    <span>Requests: 2</span>
                    <span>Pending: 0</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-3">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Emily Davis
                      </h3>
                      <p className="text-sm text-gray-500">Project Manager</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-sm text-gray-500">
                    <span>Requests: 4</span>
                    <span>Pending: 1</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-3">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        David Wilson
                      </h3>
                      <p className="text-sm text-gray-500">QA Engineer</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-sm text-gray-500">
                    <span>Requests: 1</span>
                    <span>Pending: 0</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-3">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        View All Team
                      </h3>
                      <p className="text-sm text-gray-500">
                        See complete team details
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      View All Members
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
