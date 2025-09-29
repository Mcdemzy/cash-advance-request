// pages/manager/ManagerRequestDetail.tsx
import { useState } from "react";
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
// import { authService } from "../../services/auth";

const ManagerRequestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
//   const user = authService.getCurrentUser();

  // Dummy data for request details
  const [request] = useState({
    id: id || "CA-2024-001",
    amount: 1200,
    purpose: "Conference Travel",
    description:
      "Travel expenses for the Annual Tech Conference 2024 in San Francisco. This includes round-trip flight tickets, 3-night hotel accommodation, conference registration fee, and local transportation.",
    detailedBreakdown: `• Flight: $600 (round-trip)
• Hotel: $400 (3 nights)
• Conference Ticket: $150
• Transportation: $50
• Total: $1200`,
    status: "pending" as "pending" | "approved" | "rejected" | "retired",
    submittedDate: "2024-01-15T10:30:00Z",
    dateNeeded: "2024-02-01",
    priority: "high" as "low" | "medium" | "high" | "urgent",
    submittedBy: {
      id: "1",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@company.com",
      employeeId: "EMP-001",
      department: "Engineering",
      position: "Senior Developer",
      phone: "+1 (555) 123-4567",
    },
    projectCode: "PROJ-2024-CONF",
    additionalNotes:
      "This conference is crucial for staying updated with the latest React and TypeScript developments. The knowledge gained will directly benefit our current projects.",
  });

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

  const handleApprove = () => {
    if (confirm(`Are you sure you want to approve request ${request.id}?`)) {
      alert(`Request ${request.id} approved successfully!`);
      navigate("/manager/dashboard/approvals");
    }
  };

  const handleReject = () => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason) {
      alert(`Request ${request.id} rejected. Reason: ${reason}`);
      navigate("/manager/dashboard/approvals");
    }
  };

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
              <div className="flex items-center gap-4 mb-2">
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
              <p className="text-gray-600">Request ID: {request.id}</p>
            </div>

            {request.status === "pending" && (
              <div className="flex items-center gap-2 mt-4 lg:mt-0">
                <button
                  onClick={handleApprove}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
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

                {request.detailedBreakdown && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Expense Breakdown
                    </label>
                    <pre className="mt-1 text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded-md text-sm">
                      {request.detailedBreakdown}
                    </pre>
                  </div>
                )}

                {request.additionalNotes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Additional Notes
                    </label>
                    <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                      {request.additionalNotes}
                    </p>
                  </div>
                )}

                {request.projectCode && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Project Code
                    </label>
                    <p className="mt-1 text-gray-900 font-mono">
                      {request.projectCode}
                    </p>
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
                        {new Date(request.submittedDate).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        By: {request.submittedBy.firstName}{" "}
                        {request.submittedBy.lastName}
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
                      {request.submittedBy.firstName}{" "}
                      {request.submittedBy.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {request.submittedBy.position}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {request.submittedBy.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Building className="h-4 w-4 mr-2" />
                    {request.submittedBy.department}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {request.submittedBy.phone}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    {request.submittedBy.employeeId}
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
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Requester
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <FileText className="h-4 w-4 mr-2" />
                  Request More Info
                </button>
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
