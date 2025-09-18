import { authService } from "../../services/auth";

const ManagerDashboard = () => {
  const user = authService.getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Manager Dashboard</h1>
        <p>Welcome, Manager {user?.firstName}!</p>
        {/* Add manager-specific content here */}
      </div>
    </div>
  );
};

export default ManagerDashboard;
