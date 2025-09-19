import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
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
} from "lucide-react";
import { authService } from "../../services/auth";
import { requestService } from "../../services/requests";

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
}

const StaffDashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [requests, setRequests] = useState<CashAdvanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user?.role !== "staff") {
      navigate("/dashboard");
      return;
    }

    fetchUserRequests();
  }, [user, navigate]);

  const fetchUserRequests = async () => {
    try {
      setIsLoading(true);
      // This would be an API call in a real application
      const userRequests = await requestService.getUserRequests(user?._id);
      setRequests(userRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
  };

  const pendingRequests = requests.filter((req) => req.status === "pending");
  const recentRequests = requests.slice(0, 5); // Show most recent 5 requests

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
                      {user?.firstName} {user?.lastName}
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
                {user?.firstName} {user?.lastName}
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
          <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
        </div>

        {/* Quick actions */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div
            className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition duration-300"
            onClick={() => navigate("/dashboard/request")}
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <PlusCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    New Request
                  </h3>
                  <p className="text-sm text-gray-500">
                    Submit a cash advance request
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition duration-300"
            onClick={() => navigate("/dashboard/requests")}
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    View Requests
                  </h3>
                  <p className="text-sm text-gray-500">
                    Check status of your requests
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition duration-300"
            onClick={() => navigate("/dashboard/retirement")}
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Retire Advance
                  </h3>
                  <p className="text-sm text-gray-500">
                    Submit retirement documents
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                    Total Requests
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
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
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
                  <p className="text-sm font-medium text-gray-500">Approved</p>
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
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Amount
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${stats.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent requests */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Recent Requests
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                {isLoading ? (
                  <div className="text-center py-4">
                    <p>Loading requests...</p>
                  </div>
                ) : recentRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No requests
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating a new cash advance request.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {recentRequests.map((request) => (
                        <li key={request.id} className="py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {getStatusIcon(request.status)}
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">
                                  ${request.amount} - {request.purpose}
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
                    onClick={() => navigate("/dashboard/requests")}
                    className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    View all requests
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pending approvals */}
          <div>
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Pending Approval
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                {isLoading ? (
                  <div className="text-center py-4">
                    <p>Loading...</p>
                  </div>
                ) : pendingRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No pending requests
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      All your requests have been processed.
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {pendingRequests.map((request) => (
                      <li key={request.id} className="py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              ${request.amount}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {request.purpose}
                            </p>
                          </div>
                          <Clock className="h-5 w-5 text-yellow-500" />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Quick resources */}
            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Resources
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <ul className="space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      • How to submit a cash advance request
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      • Retirement process guidelines
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      • Finance policy documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      • Contact finance department
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
