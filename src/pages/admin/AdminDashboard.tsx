import { authService } from '../../services/auth';

const AdminDashboard = () => {
  const user = authService.getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p>Welcome, Administrator {user?.firstName}!</p>
        {/* Add admin-specific content here */}
      </div>
    </div>
  );
};

export default AdminDashboard;