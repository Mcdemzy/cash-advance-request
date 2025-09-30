// services/manager.ts
import api from "./api";

// Reuse existing interfaces from request service
import type { CashAdvanceRequest } from "./requests";

export interface TeamMember {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  department: string;
  position: string;
  phone?: string;
  hireDate?: string;
  stats: {
    pending: number;
    approved: number;
    rejected: number;
    retired: number;
    total: number;
    totalAmount: number;
  };
}

export interface ManagerDashboardStats {
  pendingApprovals: number;
  teamMembers: number;
  totalTeamRequests: number;
  approvedRequests: number;
  pendingRequests: number;
  totalAmount: number;
}

export interface ManagerDashboardResponse {
  success: boolean;
  data: {
    stats: ManagerDashboardStats;
    pendingApprovals: CashAdvanceRequest[];
    teamMembers: TeamMember[];
    recentTeamRequests: CashAdvanceRequest[];
  };
}

export interface PendingApprovalsResponse {
  success: boolean;
  data: {
    pendingApprovals: CashAdvanceRequest[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalRequests: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface TeamRequestsResponse {
  success: boolean;
  data: {
    requests: CashAdvanceRequest[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalRequests: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface TeamMembersResponse {
  success: boolean;
  data: {
    teamMembers: TeamMember[];
    total: number;
  };
}

export interface TeamMemberRequestsResponse {
  success: boolean;
  data: {
    teamMember: TeamMember;
    requests: CashAdvanceRequest[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalRequests: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface RequestDetailResponse {
  success: boolean;
  data: {
    request: CashAdvanceRequest;
  };
}

export interface ReportsResponse {
  success: boolean;
  data: {
    summary: {
      totalRequests: number;
      totalAmount: number;
      approvedRequests: number;
      approvedAmount: number;
      pendingRequests: number;
      pendingAmount: number;
    };
    statusBreakdown: Array<{
      _id: string;
      count: number;
      totalAmount: number;
    }>;
    monthlyTrends: Array<{
      month: number;
      year: number;
      totalRequests: number;
      totalAmount: number;
      approvedRequests: number;
      approvalRate: number;
    }>;
    teamMembersCount: number;
  };
}

// Specific interface for approve/reject responses
export interface ProcessRequestResponse {
  success: boolean;
  message: string;
  data: {
    advance: CashAdvanceRequest;
  };
}

export const managerService = {
  // Get manager dashboard overview
  async getDashboardStats(): Promise<ManagerDashboardResponse["data"]> {
    try {
      const response = await api.get<ManagerDashboardResponse>(
        "/manager/dashboard"
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching manager dashboard:", error);
      throw error;
    }
  },

  // Get pending approvals with pagination and search
  async getPendingApprovals(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PendingApprovalsResponse["data"]> {
    try {
      const response = await api.get<PendingApprovalsResponse>(
        "/manager/pending-approvals",
        {
          params: {
            page: params?.page || 1,
            limit: params?.limit || 10,
            search: params?.search || "",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching pending approvals:", error);
      throw error;
    }
  },

  // Approve a request
  async approveRequest(requestId: string): Promise<ProcessRequestResponse> {
    try {
      const response = await api.put<ProcessRequestResponse>(
        `/manager/requests/${requestId}/approve`
      );
      return response.data;
    } catch (error) {
      console.error("Error approving request:", error);
      throw error;
    }
  },

  // Reject a request
  async rejectRequest(
    requestId: string,
    reason: string
  ): Promise<ProcessRequestResponse> {
    try {
      const response = await api.put<ProcessRequestResponse>(
        `/manager/requests/${requestId}/reject`,
        {
          reason,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error rejecting request:", error);
      throw error;
    }
  },

  // Get team requests with filtering
  async getTeamRequests(params?: {
    status?: string;
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
  }): Promise<TeamRequestsResponse["data"]> {
    try {
      const response = await api.get<TeamRequestsResponse>(
        "/manager/team-requests",
        {
          params: {
            status: params?.status || "all",
            page: params?.page || 1,
            limit: params?.limit || 10,
            sort: params?.sort || "-createdAt",
            search: params?.search || "",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching team requests:", error);
      throw error;
    }
  },

  // Get team members with stats
  async getTeamMembers(params?: {
    search?: string;
  }): Promise<TeamMembersResponse["data"]> {
    try {
      const response = await api.get<TeamMembersResponse>(
        "/manager/team-members",
        {
          params: {
            search: params?.search || "",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching team members:", error);
      throw error;
    }
  },

  // Get requests for a specific team member
  async getTeamMemberRequests(
    memberId: string,
    params?: {
      status?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<TeamMemberRequestsResponse["data"]> {
    try {
      const response = await api.get<TeamMemberRequestsResponse>(
        `/manager/team-members/${memberId}/requests`,
        {
          params: {
            status: params?.status || "all",
            page: params?.page || 1,
            limit: params?.limit || 10,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching team member requests:", error);
      throw error;
    }
  },

  // Get detailed view of a specific request
  async getRequestDetail(
    requestId: string
  ): Promise<RequestDetailResponse["data"]> {
    try {
      const response = await api.get<RequestDetailResponse>(
        `/manager/requests/${requestId}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching request details:", error);
      throw error;
    }
  },

  // Get reports and analytics
  async getReports(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ReportsResponse["data"]> {
    try {
      const response = await api.get<ReportsResponse>(
        "/manager/reports/summary",
        {
          params: {
            startDate: params?.startDate,
            endDate: params?.endDate,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  },
};
