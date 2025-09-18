import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    // Redirect to appropriate dashboard based on role
    if (user) {
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'finance':
          navigate('/finance/dashboard');
          break;
        case 'manager':
          navigate('/manager/dashboard');
          break;
        default:
          // Stay on staff dashboard
          break;
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <p>Welcome, {user?.firstName}!</p>
        {/* Add staff-specific content here */}
      </div>
    </div>
  );
};

export default Dashboard;