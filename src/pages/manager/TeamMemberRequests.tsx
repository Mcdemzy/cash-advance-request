// pages/manager/TeamMemberRequests.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Calendar, Building, DollarSign } from "lucide-react";
// import { authService } from "../../services/auth";

interface TeamRequest {
  id: string;
  amount: number;
  purpose: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "retired";
  submittedDate: string;
  dateNeeded: string;
  priority: "low" | "medium" | "high" | "urgent";
}

const TeamMemberRequests = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
//   const user = authService.getCurrentUser();

  // Dummy data for team member
  const [teamMember] = useState({
    id: id || "5",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@company.com",
    employeeId: "EMP-001",
    department: "Engineering",
    position: "Senior Developer",
    phone: "+1 (555) 123-4567",
    hireDate: "2022-03-15",
    status: "active" as const
  });

  // Dummy data for team member requests
  const [requests] = useState<TeamRequest[]>([
    {
      id: "CA-2024-001",
      amount: 1200,
      purpose: "Conference Travel",
      description: "Travel expenses for annual tech conference in San Francisco including flight, accommodation, and conference tickets",
      status: "approved",
      submittedDate: "2024-01-15",
      dateNeeded: "2024-02-01",
      priority: "high"
    },
    {
      id: "CA-2024-006",
      amount: 350,
      purpose: "Software Tools",
      description: "Purchase of development tools and licenses for Q1 projects",
      status: "pending",
      submittedDate: "2024-01-18",
      dateNeeded: "2024-01-25",
      priority: "medium"
    },
    {
      id: "CA-2023-045",
      amount: 500,
      purpose: "Training Workshop",
      description: "Advanced React training workshop registration fee",
      status: "retired",
      submittedDate: "2023-12-10",
      dateNeeded: "2024-01-15",
      priority: "high"
    },
    {
      id: "CA-2023-038",
      amount: 200,
      purpose: "Team Building",
      description: "Department team building activity expenses",
      status: "rejected",
      submittedDate: "2023-11-20",
      dateNeeded: "2023-12-01",
      priority: "low"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "retired": return "bg-purple-100 text-purple-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    rejected: requests.filter(r => r.status === "rejected").length,
    retired: requests.filter(r => r.status === "retired").length,
    totalAmount: requests.reduce((sum, req) => sum + req.amount, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/manager/dashboard/team")}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Team Management
          </button>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-full p-4">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {teamMember.firstName} {teamMember.lastName}
                  </h1>
                  <p className="text-gray-600">{teamMember.position}</p>
                  <div className="flex flex-wrap gap-4 mt-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="h-4 w-4 mr-2" />
                      {teamMember.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-2" />
                      {teamMember.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Building className="h-4 w-4 mr-2" />
                      {teamMember.department}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      Joined {new Date(teamMember.hireDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500">Employee ID</div>
                  <div className="text-lg font-semibold text-gray-900">{teamMember.employeeId}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-gray-500">Approved</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-500">Rejected</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">${stats.totalAmount}</div>
            <div className="text-sm text-gray-500">Total Amount</div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Cash Advance Requests</h2>
            <p className="text-sm text-gray-600">All requests submitted by {teamMember.firstName}</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{request.purpose}</div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">{request.description}</div>
                        <div className="text-xs text-gray-400 mt-1">ID: {request.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{request.amount.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Needed: {new Date(request.dateNeeded).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">
                        Submitted: {new Date(request.submittedDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {requests.length === 0 && (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {teamMember.firstName} hasn't submitted any cash advance requests yet.
              </p>
            </div>
          )}
        </div>

        {/* Performance Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Rate</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {Math.round((stats.approved / stats.total) * 100)}%
                </div>
                <div className="text-sm text-gray-500">Requests approved</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">{stats.approved} of {stats.total} requests</div>
                <div className="text-xs text-gray-400">Overall approval rate</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Request</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  ${Math.round(stats.totalAmount / stats.total)}
                </div>
                <div className="text-sm text-gray-500">Average amount</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">${stats.totalAmount.toLocaleString()} total</div>
                <div className="text-xs text-gray-400">Across all requests</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberRequests;