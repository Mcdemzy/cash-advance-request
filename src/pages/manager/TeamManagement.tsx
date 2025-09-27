// pages/manager/TeamManagement.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Mail, Phone, User, Calendar } from "lucide-react";
// import { authService } from "../../services/auth";

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  department: string;
  position: string;
  phone: string;
  hireDate: string;
  status: "active" | "inactive";
  stats: {
    totalRequests: number;
    pending: number;
    approved: number;
    rejected: number;
    retired: number;
  };
}

const TeamManagement = () => {
  const navigate = useNavigate();
//   const user = authService.getCurrentUser();
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy data for team members
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@company.com",
      employeeId: "EMP-001",
      department: "Engineering",
      position: "Senior Developer",
      phone: "+1 (555) 123-4567",
      hireDate: "2022-03-15",
      status: "active",
      stats: {
        totalRequests: 12,
        pending: 1,
        approved: 8,
        rejected: 1,
        retired: 2,
      },
    },
    {
      id: "2",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@company.com",
      employeeId: "EMP-002",
      department: "Marketing",
      position: "Marketing Specialist",
      phone: "+1 (555) 123-4568",
      hireDate: "2021-07-20",
      status: "active",
      stats: {
        totalRequests: 8,
        pending: 2,
        approved: 5,
        rejected: 0,
        retired: 1,
      },
    },
    {
      id: "3",
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.brown@company.com",
      employeeId: "EMP-003",
      department: "Sales",
      position: "Sales Executive",
      phone: "+1 (555) 123-4569",
      hireDate: "2023-01-10",
      status: "active",
      stats: {
        totalRequests: 5,
        pending: 0,
        approved: 4,
        rejected: 1,
        retired: 0,
      },
    },
    {
      id: "4",
      firstName: "Emily",
      lastName: "Davis",
      email: "emily.davis@company.com",
      employeeId: "EMP-004",
      department: "Engineering",
      position: "Project Manager",
      phone: "+1 (555) 123-4570",
      hireDate: "2020-11-05",
      status: "active",
      stats: {
        totalRequests: 15,
        pending: 1,
        approved: 12,
        rejected: 1,
        retired: 1,
      },
    },
    {
      id: "5",
      firstName: "David",
      lastName: "Wilson",
      email: "david.wilson@company.com",
      employeeId: "EMP-005",
      department: "Quality Assurance",
      position: "QA Engineer",
      phone: "+1 (555) 123-4571",
      hireDate: "2022-09-30",
      status: "active",
      stats: {
        totalRequests: 6,
        pending: 0,
        approved: 5,
        rejected: 0,
        retired: 1,
      },
    },
  ]);

  const filteredMembers = teamMembers.filter(
    (member) =>
      `${member.firstName} ${member.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                Team Management
              </h1>
              <p className="text-gray-600">
                Manage and view details of your team members
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-blue-100 rounded-full p-3">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{member.position}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {member.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {member.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Joined {new Date(member.hireDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Stats */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">
                        {member.stats.totalRequests}
                      </div>
                      <div className="text-gray-500">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-yellow-600">
                        {member.stats.pending}
                      </div>
                      <div className="text-gray-500">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">
                        {member.stats.approved}
                      </div>
                      <div className="text-gray-500">Approved</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-red-600">
                        {member.stats.rejected}
                      </div>
                      <div className="text-gray-500">Rejected</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() =>
                      navigate(`/manager/team/${member.id}/requests`)
                    }
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Requests
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No team members found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No team members match your search criteria.
            </p>
          </div>
        )}

        {/* Team Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Team Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {teamMembers.length}
              </div>
              <div className="text-sm text-gray-500">Total Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {teamMembers.reduce(
                  (sum, member) => sum + member.stats.approved,
                  0
                )}
              </div>
              <div className="text-sm text-gray-500">Approved Requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {teamMembers.reduce(
                  (sum, member) => sum + member.stats.pending,
                  0
                )}
              </div>
              <div className="text-sm text-gray-500">Pending Requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {teamMembers.reduce(
                  (sum, member) => sum + member.stats.totalRequests,
                  0
                )}
              </div>
              <div className="text-sm text-gray-500">Total Requests</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
