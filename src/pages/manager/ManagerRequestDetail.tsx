import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Building,
  Mail,
  Phone,
} from "lucide-react";
import { managerService } from "../../services/manager";
import type { CashAdvanceRequest } from "../../services/requests";

const ManagerRequestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState<CashAdvanceRequest | null>(null);
  const [processing, setProcessing] = useState(false);

  const fetchRequestDetail = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await managerService.getRequestDetail(id);
      setRequest(data.request);
    } catch (err) {
      console.error("Error fetching request details:", err);
      setError("Failed to load request details");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRequestDetail();
  }, [fetchRequestDetail]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
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
      case "retired":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleApprove = async () => {
    if (!request || !confirm(`Are you sure you want to approve this request?`))
      return;

    try {
      setProcessing(true);
      await managerService.approveRequest(request._id);
      alert("Request approved successfully!");
      navigate("/manager/dashboard/approvals");
    } catch (err) {
      console.error("Error approving request:", err);
      alert("Failed to approve request. Please try again.");
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!request) return;

    const reason = prompt("Please provide a reason for rejection:");
    if (!reason || reason.trim().length === 0) {
      alert("Rejection reason is required");
      return;
    }

    try {
      setProcessing(true);
      await managerService.rejectRequest(request._id, reason.trim());
      alert("Request rejected successfully!");
      navigate("/manager/dashboard/approvals");
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert("Failed to reject request. Please try again.");
      setProcessing(false);
    }
  };

  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Error</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={fetchRequestDetail}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/manager/dashboard/approvals")}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Approvals
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">
                  Request Details
                </h1>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    request.status
                  )}`}
                >
                  {getStatusIcon(request.status)}
                  <span className="ml-1 capitalize">{request.status}</span>
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                    request.priority
                  )}`}
                >
                  {request.priority.charAt(0).toUpperCase() +
                    request.priority.slice(1)}{" "}
                  Priority
                </span>
              </div>
            </div>

            {request.status === "pending" && (
              <div className="flex items-center gap-2 mt-4 lg:mt-0">
                <button
                  onClick={handleApprove}
                  disabled={processing}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  disabled={processing}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Request Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Request Information
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Amount Requested
                    </label>
                    <p className="mt-1 text-2xl font-bold text-green-600">
                      ${request.amount.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Date Needed
                    </label>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {new Date(request.dateNeeded).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Purpose
                  </label>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {request.purpose}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Description
                  </label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                    {request.description}
                  </p>
                </div>

                {request.rejectedReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <label className="text-sm font-medium text-red-800">
                      Rejection Reason
                    </label>
                    <p className="mt-1 text-red-900">
                      {request.rejectedReason}
                    </p>
                  </div>
                )}

                {request.retirement && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <label className="text-sm font-medium text-purple-800 mb-2 block">
                      Retirement Information
                    </label>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {new Date(
                          request.retirement.retirementDate
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium">Total Expenses:</span> $
                        {request.retirement.totalExpenses.toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">Breakdown:</span>
                      </p>
                      <pre className="whitespace-pre-wrap bg-white p-2 rounded">
                        {request.retirement.expenseBreakdown}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
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
                        {new Date(request.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        By: {request.user.firstName} {request.user.lastName}
                      </p>
                    </div>
                  </div>

                  {request.status === "pending" && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-yellow-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          Awaiting Approval
                        </p>
                        <p className="text-sm text-gray-500">
                          Pending manager review
                        </p>
                      </div>
                    </div>
                  )}

                  {request.status === "approved" && request.approvedAt && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          Approved
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(request.approvedAt).toLocaleString()}
                        </p>
                        {request.approvedBy && (
                          <p className="text-sm text-gray-600">
                            By: {request.approvedBy.firstName}{" "}
                            {request.approvedBy.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {request.status === "rejected" && request.rejectedAt && (
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
                          {new Date(request.rejectedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Requester Information */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Requester Information
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-100 rounded-full p-2">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {request.user.firstName} {request.user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {request.user.position}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{request.user.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                    {request.user.department}
                  </div>
                  {request.user.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                      {request.user.phone}
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 mr-2 flex-shrink-0" />
                    {request.user.employeeId}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Quick Actions
                </h2>
              </div>
              <div className="p-6 space-y-3">
                <a
                  href={`mailto:${request.user.email}`}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Requester
                </a>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-800 mb-3 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Approval Guidelines
              </h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Verify that the purpose aligns with company policies
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Ensure the amount is reasonable for the stated purpose
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Check if the timeline is appropriate</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Provide clear feedback when rejecting requests</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerRequestDetail;
