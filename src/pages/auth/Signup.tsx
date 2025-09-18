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
  Mail,
  Lock,
  Building,
  Phone,
  UserPlus,
} from "lucide-react";
import { authService } from "../../services/auth";
import { toast } from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    employeeId: "",
    password: "",
    confirmPassword: "",
    adminKey: "",
  });
  const [isRoleSelected, setIsRoleSelected] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
      title: "Administrator",
      description: "System management, user administration, reports",
      icon: <BarChart3 className="w-6 h-6" />,
      requiresApproval: true,
    },
  ];

  const departments = [
    "Finance",
    "Human Resources",
    "Operations",
    "Sales",
    "Marketing",
    "IT",
    "Research & Development",
    "Customer Service",
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setIsRoleSelected(true);
    setErrors({});
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole("");
    setIsRoleSelected(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
      employeeId: "",
      password: "",
      confirmPassword: "",
      adminKey: "",
    });
    setErrors({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Required fields validation
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (selectedRole !== "admin") {
      if (!formData.department) newErrors.department = "Department is required";
      if (!formData.employeeId)
        newErrors.employeeId = "Employee ID is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (selectedRole === "admin" && !formData.adminKey) {
      newErrors.adminKey = "Admin registration key is required";
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    if (
      selectedRole === "admin" &&
      formData.adminKey !== "ADMIN_2023_SECURE_KEY"
    ) {
      toast.error("Invalid admin registration key");
      setIsLoading(false);
      return;
    }

    try {
      // Prepare data for API
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        employeeId: formData.employeeId,
        department: formData.department,
        position:
          selectedRole === "admin"
            ? "Administrator"
            : selectedRole === "finance"
            ? "Finance Officer"
            : selectedRole === "manager"
            ? "Line Manager"
            : "Staff",
        role: selectedRole as "staff" | "manager" | "finance" | "admin", // Add type assertion here
        phone: formData.phone || undefined,
      };

      const response = await authService.register(userData);

      if (response.success) {
        toast.success(
          `Account created successfully! ${
            selectedRole === "admin"
              ? "Your account requires administrator approval."
              : "Welcome To Your Dashboard"
          }`
        );

        // Store role preference
        localStorage.setItem("preferredRole", selectedRole);

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
        toast.error(response.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.details?.[0]?.message ||
        "An error occurred during registration. Please try again.";

      toast.error(errorMessage);

      // Set field-specific errors if available
      if (error.response?.data?.details) {
        const fieldErrors: { [key: string]: string } = {};
        error.response.data.details.forEach(
          (detail: { field: string; message: string }) => {
            fieldErrors[detail.field] = detail.message;
          }
        );
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRoleData = userRoles.find((role) => role.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-1 bg-blue-600"></div>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <UserPlus className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {isRoleSelected ? "Create Your Account" : "Join AdvanceTracker"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isRoleSelected
                ? `Register as ${selectedRoleData?.title}`
                : "Select your role to create an account"}
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
                    {role.requiresApproval && (
                      <p className="text-xs text-orange-600 mt-1">
                        Requires administrator approval
                      </p>
                    )}
                  </div>
                </div>
              ))}

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="rounded-md bg-blue-50 p-4 flex items-start">
                <div className="flex-shrink-0">{selectedRoleData?.icon}</div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-800">
                    Registering as {selectedRoleData?.title}
                  </p>
                  {selectedRoleData?.requiresApproval && (
                    <p className="text-xs text-orange-600 mt-1">
                      Administrator accounts require verification
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleBackToRoleSelection}
                    className="mt-1 text-xs text-blue-600 hover:text-blue-500 flex items-center"
                  >
                    <ArrowLeft className="w-3 h-3 mr-1" /> Change role
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name *
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.firstName ? "border-red-300" : "border-gray-300"
                      } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="Enter your first name"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name *
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.lastName ? "border-red-300" : "border-gray-300"
                      } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="Enter your last name"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                      errors.email ? "border-red-300" : "border-gray-300"
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
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {selectedRole !== "admin" && (
                <>
                  <div>
                    <label
                      htmlFor="department"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Department *
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="department"
                        name="department"
                        required
                        value={formData.department}
                        onChange={handleInputChange}
                        className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                          errors.department
                            ? "border-red-300"
                            : "border-gray-300"
                        } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      >
                        <option value="">Select your department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.department && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.department}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="employeeId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Employee ID *
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="employeeId"
                        name="employeeId"
                        type="text"
                        required
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                          errors.employeeId
                            ? "border-red-300"
                            : "border-gray-300"
                        } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        placeholder="Enter your employee ID"
                      />
                    </div>
                    {errors.employeeId && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.employeeId}
                      </p>
                    )}
                  </div>
                </>
              )}

              {selectedRole === "admin" && (
                <div>
                  <label
                    htmlFor="adminKey"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Admin Registration Key *
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="adminKey"
                      name="adminKey"
                      type="password"
                      required
                      value={formData.adminKey}
                      onChange={handleInputChange}
                      className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                        errors.adminKey ? "border-red-300" : "border-gray-300"
                      } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="Enter admin registration key"
                    />
                  </div>
                  {errors.adminKey && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.adminKey}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Contact system administrator to obtain the registration key
                  </p>
                </div>
              )}

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full pl-10 pr-10 py-2 border ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Create a password"
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
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 6 characters with uppercase, lowercase, and
                  number
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full pl-10 pr-10 py-2 border ${
                      errors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-900"
                >
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </a>
                </label>
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
                    "Create Account"
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign in
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

export default Signup;
