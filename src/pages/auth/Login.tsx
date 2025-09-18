import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Shield,
  CreditCard,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import { authService } from "../../services/auth";
import { toast } from "react-hot-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRoleSelected, setIsRoleSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const navigate = useNavigate();

  const userRoles = [
    {
      id: "staff",
      title: "Regular Staff",
      description: "Submit cash advance requests, view status, retire funds",
      icon: <User className="w-6 h-6" />,
    },
    {
      id: "manager",
      title: "Line Manager",
      description: "Review and approve requests from subordinates",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      id: "finance",
      title: "Finance Officer",
      description: "Final approval, disbursement, monitoring",
      icon: <CreditCard className="w-6 h-6" />,
    },
    {
      id: "admin",
      title: "Auditor/Admin",
      description: "Generate reports, monitor usage, manage users",
      icon: <BarChart3 className="w-6 h-6" />,
    },
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setIsRoleSelected(true);
    setErrors({});
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole("");
    setIsRoleSelected(false);
    setEmail("");
    setPassword("");
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});

    try {
      const response = await authService.login({ email, password });

      if (response.success) {
        toast.success("Login successful!");
        
        // Store role preference for future logins
        localStorage.setItem('preferredRole', selectedRole);

        // Redirect based on role
        switch (response.data.user.role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "finance":
            navigate("/finance/dashboard");
            break;
          case "manager":
            navigate("/manager/dashboard");
            break;
          default:
            navigate("/dashboard");
        }
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.details?.[0]?.message ||
        "An error occurred during login. Please try again.";
      
      toast.error(errorMessage);
      
      // Set specific field errors if available
      if (error.response?.data?.details) {
        const fieldErrors: {email?: string; password?: string} = {};
        error.response.data.details.forEach((detail: {field: string; message: string}) => {
          if (detail.field === 'email') fieldErrors.email = detail.message;
          if (detail.field === 'password') fieldErrors.password = detail.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-1 bg-blue-600"></div>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <BarChart3 className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {isRoleSelected ? "Login to Your Account" : "Select Your Role"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isRoleSelected
                ? "Enter your credentials to access the system"
                : "Choose your role to continue to the login page"}
            </p>
          </div>

          {!isRoleSelected ? (
            <div className="space-y-4">
              {userRoles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200"
                >
                  <div className="flex-shrink-0 text-blue-600 mt-1">
                    {role.icon}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {role.title}
                    </h3>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                </div>
              ))}
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md bg-blue-50 p-4 mb-4 flex items-start">
                <div className="flex-shrink-0">
                  {userRoles.find((role) => role.id === selectedRole)?.icon}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-800">
                    Logging in as{" "}
                    {userRoles.find((role) => role.id === selectedRole)?.title}
                  </p>
                  <button
                    type="button"
                    onClick={handleBackToRoleSelection}
                    className="mt-1 text-xs text-blue-600 hover:text-blue-500 flex items-center"
                  >
                    <ArrowLeft className="w-3 h-3 mr-1" /> Change role
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({...errors, email: undefined});
                    }}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({...errors, password: undefined});
                    }}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>

        <div className="px-8 py-4 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} AdvanceTracker. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;