// pages/manager/TeamRequests.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
//   Filter,
  Download,
  Eye,
  Calendar,
  User,
} from "lucide-react";
// import { authService } from "../../services/auth";

interface TeamRequest {
  id: string;
  amount: number;
  purpose: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "retired";
  submittedDate: string;
  dateNeeded: string;
  submittedBy: string;
  department: string;
  employeeId: string;
  priority: "low" | "medium" | "high" | "urgent";
}

const TeamRequests = () => {
  const navigate = useNavigate();
//   const user = authService.getCurrentUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Dummy data for team requests
  const [teamRequests] = useState<TeamRequest[]>([
    {
      id: "CA-2024-001",
      amount: 1200,
      purpose: "Conference Travel",
      description: "Travel expenses for annual tech conference",
      status: "approved",
      submittedDate: "2024-01-15",
      dateNeeded: "2024-02-01",
      submittedBy: "John Smith",
      department: "Engineering",
      employeeId: "EMP-001",
      priority: "high",
    },
    {
      id: "CA-2024-002",
      amount: 350,
      purpose: "Office Supplies",
      description: "Purchase of stationery and office supplies",
      status: "pending",
      submittedDate: "2024-01-14",
      dateNeeded: "2024-01-20",
      submittedBy: "Sarah Johnson",
      department: "Marketing",
      employeeId: "EMP-002",
      priority: "medium",
    },
    {
      id: "CA-2024-003",
      amount: 500,
      purpose: "Client Meeting",
      description: "Expenses for client dinner and meeting",
      status: "retired",
      submittedDate: "2024-01-10",
      dateNeeded: "2024-01-18",
      submittedBy: "Michael Brown",
      department: "Sales",
      employeeId: "EMP-003",
      priority: "urgent",
    },
    {
      id: "CA-2024-004",
      amount: 200,
      purpose: "Team Lunch",
      description: "Quarterly team building lunch",
      status: "rejected",
      submittedDate: "2024-01-08",
      dateNeeded: "2024-01-15",
      submittedBy: "Emily Davis",
      department: "Engineering",
      employeeId: "EMP-004",
      priority: "low",
    },
    {
      id: "CA-2024-005",
      amount: 800,
      purpose: "Software License",
      description: "Annual subscription for design software",
      status: "approved",
      submittedDate: "2024-01-05",
      dateNeeded: "2024-01-25",
      submittedBy: "David Wilson",
      department: "Design",
      employeeId: "EMP-005",
      priority: "high",
    },
  ]);

  const departments = Array.from(
    new Set(teamRequests.map((req) => req.department))
  );

  const filteredRequests = teamRequests.filter((request) => {
    const matchesSearch =
      request.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    const matchesDepartment =
      departmentFilter === "all" || request.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

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
              <h1 className="text-2xl font-bold text-gray-900">
                Team Requests
              </h1>
              <p className="text-gray-600">
                View all cash advance requests from your team
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="retired">Retired</option>
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Team Requests ({filteredRequests.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Member
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          ${request.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-900 font-semibold">
                          {request.purpose}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {request.description}
                        </div>
                        <div className="text-xs text-gray-400">
                          ID: {request.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.submittedBy}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.department}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                          request.priority
                        )}`}
                      >
                        {request.priority.charAt(0).toUpperCase() +
                          request.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(request.dateNeeded).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        Submitted:{" "}
                        {new Date(request.submittedDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() =>
                          navigate(`/manager/requests/${request.id}`)
                        }
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <Eye className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No requests found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                No team requests match your current filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamRequests;
