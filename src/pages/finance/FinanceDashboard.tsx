import { authService } from "../../services/auth";

const FinanceDashboard = () => {
  const user = authService.getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Finance Dashboard</h1>
        <p>Welcome, Finance Officer {user?.firstName}!</p>
        {/* Add finance-specific content here */}
      </div>
    </div>
  );
};

export default FinanceDashboard;
