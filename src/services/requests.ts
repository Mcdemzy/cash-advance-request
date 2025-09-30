import api from "./api";

export interface CashAdvanceRequest {
  _id: string;
  id: string; // For compatibility with existing code
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    employeeId: string;
    department?: string;
    position?: string;
    phone?: string; // ✅ ADD THIS
  };
  amount: number;
  purpose: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "retired";
  priority: "low" | "medium" | "high" | "urgent";
  dateNeeded: string;
  retirement?: {
    retirementDate: string;
    totalExpenses: number;
    expenseBreakdown: string;
    retiredAt: string;
  };
  approvedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  approvedAt?: string; // ✅ ADD THIS
  rejectedBy?: string;
  rejectedReason?: string;
  rejectedAt?: string; // ✅ ADD THIS
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestData {
  purpose: string;
  description: string;
  amount: number;
  dateNeeded: string;
  priority?: "low" | "medium" | "high" | "urgent";
}

export interface RetirementData {
  retirementDate: string;
  totalExpenses: number;
  expenseBreakdown: string;
}

export interface AdvanceForRetirement {
  _id: string;
  id: string;
  purpose: string;
  amount: number;
  dateNeeded: string;
  status: "approved";
}

export interface RequestsResponse {
  success: boolean;
  message: string;
  data: {
    advances: CashAdvanceRequest[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalAdvances: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface RequestResponse {
  success: boolean;
  message: string;
  data: {
    advance: CashAdvanceRequest;
  };
}

export interface StatsResponse {
  success: boolean;
  data: {
    stats: {
      totalRequests: number;
      pending: number;
      approved: number;
      rejected: number;
      retired: number;
      totalAmount: number;
    };
  };
}

export interface RecentRequestsResponse {
  success: boolean;
  data: {
    advances: CashAdvanceRequest[];
  };
}

export const requestService = {
  // Get all user requests with pagination and filtering
  async getUserRequests(params?: {
    status?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<{
    advances: CashAdvanceRequest[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalAdvances: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      const response = await api.get<RequestsResponse>(
        "/advances/my-requests",
        {
          params,
        }
      );

      // Transform the data to ensure compatibility
      const advances = response.data.data.advances.map((advance) => ({
        ...advance,
        id: advance._id,
      }));

      return {
        advances,
        pagination: response.data.data.pagination,
      };
    } catch (error) {
      console.error("Error fetching user requests:", error);
      throw error;
    }
  },

  // Get a specific request by ID
  async getRequestById(requestId: string): Promise<CashAdvanceRequest> {
    try {
      const response = await api.get<RequestResponse>(
        `/advances/my-requests/${requestId}`
      );
      return {
        ...response.data.data.advance,
        id: response.data.data.advance._id,
      };
    } catch (error) {
      console.error("Error fetching request:", error);
      throw error;
    }
  },

  // Create a new cash advance request
  async createRequest(
    requestData: CreateRequestData
  ): Promise<CashAdvanceRequest> {
    try {
      const response = await api.post<RequestResponse>(
        "/advances",
        requestData
      );

      return {
        ...response.data.data.advance,
        id: response.data.data.advance._id,
      };
    } catch (error) {
      console.error("Error creating request:", error);
      throw error;
    }
  },

  // Retire a cash advance
  async retireAdvance(
    advanceId: string,
    retirementData: RetirementData
  ): Promise<CashAdvanceRequest> {
    try {
      const response = await api.put<RequestResponse>(
        `/advances/${advanceId}/retire`,
        retirementData
      );

      return {
        ...response.data.data.advance,
        id: response.data.data.advance._id,
      };
    } catch (error) {
      console.error("Error retiring advance:", error);
      throw error;
    }
  },

  // Get dashboard statistics
  async getDashboardStats(): Promise<{
    totalRequests: number;
    pending: number;
    approved: number;
    rejected: number;
    retired: number;
    totalAmount: number;
  }> {
    try {
      const response = await api.get<StatsResponse>("/advances/staff/stats");
      return response.data.data.stats;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },

  // Get recent requests for dashboard
  async getRecentRequests(): Promise<CashAdvanceRequest[]> {
    try {
      const response = await api.get<RecentRequestsResponse>(
        "/advances/staff/recent"
      );

      return response.data.data.advances.map((advance) => ({
        ...advance,
        id: advance._id,
      }));
    } catch (error) {
      console.error("Error fetching recent requests:", error);
      throw error;
    }
  },

  // Get pending requests for dashboard
  async getPendingRequests(): Promise<CashAdvanceRequest[]> {
    try {
      const response = await api.get<RecentRequestsResponse>(
        "/advances/staff/pending"
      );

      return response.data.data.advances.map((advance) => ({
        ...advance,
        id: advance._id,
      }));
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      throw error;
    }
  },

  // Get advances that are approved and can be retired
  async getAdvancesForRetirement(): Promise<AdvanceForRetirement[]> {
    try {
      // We'll filter approved advances from the user's requests
      const response = await api.get<RequestsResponse>(
        "/advances/my-requests",
        {
          params: { status: "approved" },
        }
      );

      const advances = response.data.data.advances
        .filter((advance) => advance.status === "approved")
        .map((advance) => ({
          _id: advance._id,
          id: advance._id,
          purpose: advance.purpose,
          amount: advance.amount,
          dateNeeded: advance.dateNeeded,
          status: advance.status as "approved",
        }));

      return advances;
    } catch (error) {
      console.error("Error fetching advances for retirement:", error);
      throw error;
    }
  },

  // // The following methods are for admin/manager functionality
  // // You can implement these later when you add those roles

  // // Update request status (for managers/admin) - TO BE IMPLEMENTED
  // async updateRequestStatus(
  //   requestId: string,
  //   status: "approved" | "rejected",
  //   comments?: string
  // ): Promise<CashAdvanceRequest> {
  //   try {
  //     // This will be implemented when you add admin endpoints
  //     throw new Error("Not implemented yet");
  //   } catch (error) {
  //     console.error("Error updating request status:", error);
  //     throw error;
  //   }
  // },

  // // Get all requests for managers/admin - TO BE IMPLEMENTED
  // async getAllRequests(): Promise<CashAdvanceRequest[]> {
  //   try {
  //     // This will be implemented when you add admin endpoints
  //     throw new Error("Not implemented yet");
  //   } catch (error) {
  //     console.error("Error fetching all requests:", error);
  //     throw error;
  //   }
  // },

  // // Get requests by status - TO BE IMPLEMENTED
  // async getRequestsByStatus(status: string): Promise<CashAdvanceRequest[]> {
  //   try {
  //     // This will be implemented when you add admin endpoints
  //     throw new Error("Not implemented yet");
  //   } catch (error) {
  //     console.error("Error fetching requests by status:", error);
  //     throw error;
  //   }
  // },

  // // Delete a request - TO BE IMPLEMENTED
  // async deleteRequest(requestId: string): Promise<void> {
  //   try {
  //     // This will be implemented when you add admin endpoints
  //     throw new Error("Not implemented yet");
  //   } catch (error) {
  //     console.error("Error deleting request:", error);
  //     throw error;
  //   }
  // }
};
