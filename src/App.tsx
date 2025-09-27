// Update your App.tsx to include the new manager routes
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/landing/LandingPage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import FinanceDashboard from "./pages/finance/FinanceDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerApprovals from "./pages/manager/ManagerApprovals";
import TeamManagement from "./pages/manager/TeamManagement";
import TeamRequests from "./pages/manager/TeamRequests";
import Reports from "./pages/manager/Reports";
import ProtectedRoute from "./components/ProtectedRoute";
import NewRequest from "./pages/dashboard/NewRequest";
import AllRequests from "./pages/dashboard/AllRequests";
import Retirement from "./pages/dashboard/Retirement";
import ViewRequest from "./pages/dashboard/ViewRequest";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/request"
            element={
              <ProtectedRoute>
                <NewRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/requests"
            element={
              <ProtectedRoute>
                <AllRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/requests/:id"
            element={
              <ProtectedRoute>
                <ViewRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/retirement"
            element={
              <ProtectedRoute>
                <Retirement />
              </ProtectedRoute>
            }
          />

          {/* Manager Routes */}
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute requiredRole="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/dashboard/approvals"
            element={
              <ProtectedRoute requiredRole="manager">
                <ManagerApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/dashboard/team"
            element={
              <ProtectedRoute requiredRole="manager">
                <TeamManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/dashboard/team-requests"
            element={
              <ProtectedRoute requiredRole="manager">
                <TeamRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/dashboard/reports"
            element={
              <ProtectedRoute requiredRole="manager">
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Finance Routes */}
          <Route
            path="/finance/dashboard"
            element={
              <ProtectedRoute requiredRole="finance">
                <FinanceDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
};

export default App;
