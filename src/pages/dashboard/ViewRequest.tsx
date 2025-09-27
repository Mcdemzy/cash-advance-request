import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Printer,
  Share2,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
  MessageSquare,
  Tag,
} from "lucide-react";
import { requestService } from "../../services/requests";
import type { CashAdvanceRequest } from "../../services/requests";

const ViewRequest = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<CashAdvanceRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchRequestDetails(id);
    }
  }, [id]);

  const fetchRequestDetails = async (requestId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      // Use the proper service method to get request by ID
      const requestData = await requestService.getRequestById(requestId);
      setRequest(requestData);
    } catch (err) {
      setError("Failed to load request details");
      console.error("Error fetching request:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          label: "Approved",
        };
      case "rejected":
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          label: "Rejected",
        };
      case "retired":
        return {
          icon: CheckCircle,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
          label: "Retired",
        };
      default:
        return {
          icon: Clock,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          label: "Pending",
        };
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implement download functionality
    console.log("Download request details");
  };

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: `Cash Advance Request - ${request?.purpose}`,
        text: `Cash advance request for ${request?.purpose}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleSubmitRetirement = () => {
    if (request) {
      navigate(`/dashboard/retirement/${request.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Request Not Found
          </h3>
          <p className="mt-2 text-gray-600">
            {error || "The requested cash advance could not be found."}
          </p>
          <button
            onClick={() => navigate("/dashboard/requests")}
            className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            Back to My Requests
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(request.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard/requests")}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to My Requests
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">
                  Cash Advance Request
                </h1>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color} border ${statusConfig.borderColor}`}
                >
                  <statusConfig.icon className="h-4 w-4 mr-1" />
                  {statusConfig.label}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                    request.priority
                  )} border`}
                >
                  {request.priority.charAt(0).toUpperCase() +
                    request.priority.slice(1)}{" "}
                  Priority
                </span>
              </div>
              <p className="text-gray-600">Request ID: {request.id}</p>
            </div>

            <div className="flex items-center gap-2 mt-4 lg:mt-0">
              <button
                onClick={handlePrint}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
              <button
                onClick={handleShare}
                className="flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Request Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Request Details
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      Purpose
                    </label>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {request.purpose}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Amount Requested
                    </label>
                    <p className="mt-1 text-lg font-medium text-green-600">
                      {formatCurrency(request.amount)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Description
                  </label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                    {request.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Date Needed
                    </label>
                    <p className="mt-1 text-gray-900">
                      {formatDate(request.dateNeeded)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Priority
                    </label>
                    <p className="mt-1 text-gray-900 capitalize">
                      {request.priority}
                    </p>
                  </div>
                </div>

                {request.user.department && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Department
                    </label>
                    <p className="mt-1 text-gray-900">
                      {request.user.department}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline Card */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Request Timeline
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        Request Submitted
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(request.createdAt)}
                      </p>
                      <p className="text-sm text-gray-600">
                        By: {request.user.firstName} {request.user.lastName}
                      </p>
                    </div>
                  </div>

                  {request.status === "approved" && request.approvedBy && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          Approved by Manager
                        </p>
                        <p className="text-sm text-gray-500">
                          {request.updatedAt
                            ? formatDateTime(request.updatedAt)
                            : "Pending approval"}
                        </p>
                        <p className="text-sm text-gray-600">
                          By: {request.approvedBy.firstName}{" "}
                          {request.approvedBy.lastName}
                        </p>
                      </div>
                    </div>
                  )}

                  {request.status === "rejected" && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <XCircle className="h-4 w-4 text-red-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          Rejected
                        </p>
                        <p className="text-sm text-gray-500">
                          {request.updatedAt
                            ? formatDateTime(request.updatedAt)
                            : "Recently rejected"}
                        </p>
                        {request.rejectedReason && (
                          <p className="text-sm text-gray-600 mt-1">
                            Reason: {request.rejectedReason}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {request.status === "retired" && request.retirement && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          Retirement Submitted
                        </p>
                        <p className="text-sm text-gray-500">
                          {request.retirement.retiredAt
                            ? formatDateTime(request.retirement.retiredAt)
                            : "Recently retired"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total Expenses:{" "}
                          {formatCurrency(request.retirement.totalExpenses)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Retirement Details Card - Only show if retired */}
            {request.status === "retired" && request.retirement && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Retirement Details
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Retirement Date
                      </label>
                      <p className="mt-1 text-gray-900">
                        {formatDate(request.retirement.retirementDate)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Total Expenses
                      </label>
                      <p className="mt-1 text-green-600 font-medium">
                        {formatCurrency(request.retirement.totalExpenses)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Expense Breakdown
                    </label>
                    <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                      {request.retirement.expenseBreakdown}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Request Status
                </h2>
              </div>
              <div className="p-6">
                <div className="text-center">
                  <div
                    className={`mx-auto w-16 h-16 rounded-full ${statusConfig.bgColor} flex items-center justify-center mb-4`}
                  >
                    <statusConfig.icon
                      className={`h-8 w-8 ${statusConfig.color}`}
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 capitalize">
                    {request.status}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {request.status === "pending" &&
                      "Your request is awaiting review by your manager."}
                    {request.status === "approved" &&
                      "Your request has been approved and is ready for processing."}
                    {request.status === "rejected" &&
                      "Your request was not approved."}
                    {request.status === "retired" &&
                      "This advance has been successfully retired."}
                  </p>
                </div>

                {request.status === "approved" && (
                  <button
                    onClick={handleSubmitRetirement}
                    className="w-full mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 cursor-pointer"
                  >
                    Submit Retirement
                  </button>
                )}

                {request.status === "rejected" && (
                  <button
                    onClick={() => navigate("/dashboard/request")}
                    className="w-full mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  >
                    Submit New Request
                  </button>
                )}
              </div>
            </div>

            {/* User Information Card */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Requester Information
                </h2>
              </div>
              <div className="p-6 space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Name
                  </label>
                  <p className="text-gray-900">
                    {request.user.firstName} {request.user.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Employee ID
                  </label>
                  <p className="text-gray-900">{request.user.employeeId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-gray-900">{request.user.email}</p>
                </div>
                {request.user.position && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Position
                    </label>
                    <p className="text-gray-900">{request.user.position}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Quick Actions
                </h2>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Approver
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  View Supporting Docs
                </button>
                {request.status === "pending" && (
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 cursor-pointer">
                    <Clock className="h-4 w-4 mr-2" />
                    Withdraw Request
                  </button>
                )}
              </div>
            </div>

            {/* Important Notes Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-800 mb-3">
                Important Information
              </h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Keep all receipts for expenses during retirement</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Retirement must be submitted within 30 days</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Contact finance for payment inquiries</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRequest;
