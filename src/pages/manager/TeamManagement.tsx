import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Mail,
  Phone,
  User,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { managerService } from "../../services/manager";
import type { TeamMember } from "../../services/manager";

const TeamManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const fetchTeamMembers = useCallback(async (search = "") => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await managerService.getTeamMembers({ search });
      setTeamMembers(data.teamMembers);
    } catch (err) {
      console.error("Error fetching team members:", err);
      setError("Failed to load team members");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeamMembers(searchTerm);
  }, [fetchTeamMembers, searchTerm]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const totalStats = teamMembers.reduce(
    (acc, member) => ({
      total: acc.total + member.stats.total,
      approved: acc.approved + member.stats.approved,
      pending: acc.pending + member.stats.pending,
      rejected: acc.rejected + member.stats.rejected,
    }),
    { total: 0, approved: 0, pending: 0, rejected: 0 }
  );

  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Error</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => fetchTeamMembers(searchTerm)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading team members...</p>
          </div>
        ) : (
          <>
            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div
                  key={member._id}
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
                        <p className="text-sm text-gray-500">
                          {member.position}
                        </p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      {member.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                          {member.phone}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        Joined {formatDate(member.hireDate)}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">
                            {member.stats.total}
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
                          navigate(`/manager/team/${member._id}/requests`)
                        }
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        View Requests
                      </button>
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Contact
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {teamMembers.length === 0 && (
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
            {teamMembers.length > 0 && (
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
                      {totalStats.approved}
                    </div>
                    <div className="text-sm text-gray-500">
                      Approved Requests
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {totalStats.pending}
                    </div>
                    <div className="text-sm text-gray-500">
                      Pending Requests
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {totalStats.total}
                    </div>
                    <div className="text-sm text-gray-500">Total Requests</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TeamManagement;
