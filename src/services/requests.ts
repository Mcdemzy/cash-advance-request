import api from "./api";

export interface CashAdvanceRequest {
  _id: string;
  id: string; // For compatibility with existing code
  userId: string;
  employeeId: string;
  purpose: string;
  description: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "disbursed" | "retired";
  submittedDate: string;
  approvedDate?: string;
  disbursedDate?: string;
  retiredDate?: string;
  approverComments?: string;
  approvedBy?: string;
  rejectedBy?: string;
  documents?: string[];
  retirementDetails?: {
    retirementDate: string;
    totalExpenses: number;
    description: string;
    receipts: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestData {
  purpose: string;
  description: string;
  amount: number;
  documents?: File[];
}

export interface RetirementData {
  advanceId: string;
  retirementDate: string;
  totalExpenses: string;
  description: string;
  receipts: File[];
}

export interface AdvanceForRetirement {
  id: string;
  _id: string;
  purpose: string;
  amount: number;
  disbursedDate: string;
  retired: boolean;
}

export interface RequestsResponse {
  success: boolean;
  message: string;
  data: CashAdvanceRequest[];
}

export interface RequestResponse {
  success: boolean;
  message: string;
  data: CashAdvanceRequest;
}

export const requestService = {
  // Get all user requests
  async getUserRequests(userId?: string): Promise<CashAdvanceRequest[]> {
    try {
      const endpoint = userId ? `/requests/user/${userId}` : "/requests/user";
      const response = await api.get<RequestsResponse>(endpoint);

      // Transform the data to ensure compatibility
      const requests = response.data.data.map((request) => ({
        ...request,
        id: request._id || request.id, // Ensure id field exists
      }));

      return requests;
    } catch (error) {
      console.error("Error fetching user requests:", error);
      throw error;
    }
  },

  // Get a specific request by ID
  async getRequestById(requestId: string): Promise<CashAdvanceRequest> {
    try {
      const response = await api.get<RequestResponse>(`/requests/${requestId}`);
      return {
        ...response.data.data,
        id: response.data.data._id || response.data.data.id,
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
      const formData = new FormData();
      formData.append("purpose", requestData.purpose);
      formData.append("description", requestData.description);
      formData.append("amount", requestData.amount.toString());

      // Append documents if any
      if (requestData.documents) {
        requestData.documents.forEach((file) => {
          formData.append(`documents`, file);
        });
      }

      const response = await api.post<RequestResponse>("/requests", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        ...response.data.data,
        id: response.data.data._id || response.data.data.id,
      };
    } catch (error) {
      console.error("Error creating request:", error);
      throw error;
    }
  },

  // Get advances that can be retired (disbursed but not yet retired)
  async getAdvancesForRetirement(): Promise<AdvanceForRetirement[]> {
    try {
      const response = await api.get<{
        success: boolean;
        data: AdvanceForRetirement[];
      }>("/requests/retirement/available");

      // Transform data to ensure compatibility
      const advances = response.data.data.map((advance) => ({
        ...advance,
        id: advance._id || advance.id,
      }));

      return advances;
    } catch (error) {
      console.error("Error fetching advances for retirement:", error);
      throw error;
    }
  },

  // Submit retirement documentation
  async submitRetirement(retirementData: RetirementData): Promise<void> {
    try {
      const formData = new FormData();
      formData.append("advanceId", retirementData.advanceId);
      formData.append("retirementDate", retirementData.retirementDate);
      formData.append("totalExpenses", retirementData.totalExpenses);
      formData.append("description", retirementData.description);

      // Append receipt files
      retirementData.receipts.forEach((file) => {
        formData.append("receipts", file);
      });

      await api.post("/requests/retirement", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error submitting retirement:", error);
      throw error;
    }
  },

  // Update request status (for managers/admin)
  async updateRequestStatus(
    requestId: string,
    status: "approved" | "rejected" | "disbursed",
    comments?: string
  ): Promise<CashAdvanceRequest> {
    try {
      const response = await api.patch<RequestResponse>(
        `/requests/${requestId}/status`,
        {
          status,
          comments,
        }
      );

      return {
        ...response.data.data,
        id: response.data.data._id || response.data.data.id,
      };
    } catch (error) {
      console.error("Error updating request status:", error);
      throw error;
    }
  },

  // Get all requests for managers/admin
  async getAllRequests(): Promise<CashAdvanceRequest[]> {
    try {
      const response = await api.get<RequestsResponse>("/requests");

      const requests = response.data.data.map((request) => ({
        ...request,
        id: request._id || request.id,
      }));

      return requests;
    } catch (error) {
      console.error("Error fetching all requests:", error);
      throw error;
    }
  },

  // Get requests by status
  async getRequestsByStatus(status: string): Promise<CashAdvanceRequest[]> {
    try {
      const response = await api.get<RequestsResponse>(
        `/requests/status/${status}`
      );

      const requests = response.data.data.map((request) => ({
        ...request,
        id: request._id || request.id,
      }));

      return requests;
    } catch (error) {
      console.error("Error fetching requests by status:", error);
      throw error;
    }
  },

  // Delete a request (if allowed)
  async deleteRequest(requestId: string): Promise<void> {
    try {
      await api.delete(`/requests/${requestId}`);
    } catch (error) {
      console.error("Error deleting request:", error);
      throw error;
    }
  },

  // Download request document
  async downloadDocument(requestId: string, documentId: string): Promise<Blob> {
    try {
      const response = await api.get(
        `/requests/${requestId}/documents/${documentId}`,
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error downloading document:", error);
      throw error;
    }
  },

  // Get dashboard statistics
  async getDashboardStats(): Promise<{
    totalRequests: number;
    pending: number;
    approved: number;
    rejected: number;
    disbursed: number;
    retired: number;
    totalAmount: number;
  }> {
    try {
      const response = await api.get("/requests/stats");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },
};
