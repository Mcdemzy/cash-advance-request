// Re-export the CashAdvanceRequest interface and other types from the requests service
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

// Additional types for dashboard and UI components
export interface DashboardStats {
  totalRequests: number;
  pending: number;
  approved: number;
  rejected: number;
  disbursed: number;
  retired: number;
  totalAmount: number;
}

export interface FilterOptions {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

// Form validation types
export interface FormErrors {
  [key: string]: string;
}

// User role types (extending the existing User interface)
export type UserRole = "staff" | "manager" | "finance" | "admin";

export interface RequestFormData {
  purpose: string;
  description: string;
  amount: string;
  documents: File[];
}

export interface RetirementFormData {
  advanceId: string;
  retirementDate: string;
  totalExpenses: string;
  description: string;
  receipts: File[];
}

// Status update types for managers/admin
export interface StatusUpdateData {
  status: "approved" | "rejected" | "disbursed";
  comments?: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Navigation and routing types
export interface NavigationState {
  message?: string;
  type?: "success" | "error" | "info";
}

// File upload types
export interface DocumentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

// Activity/Audit log types
export interface ActivityLog {
  id: string;
  requestId: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details?: Record<string, any>;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type:
    | "request_submitted"
    | "request_approved"
    | "request_rejected"
    | "disbursement_ready"
    | "retirement_due";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedRequestId?: string;
}
