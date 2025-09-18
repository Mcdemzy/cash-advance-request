import { useState } from "react";
import {
  Shield,
  BarChart3,
  Clock,
  CheckCircle,
  Users,
  Bell,
  FileText,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };
  const features = [
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Secure Authentication",
      description:
        "Role-based access control ensures only authorized users can access the system.",
    },
    {
      icon: <FileText className="w-10 h-10" />,
      title: "Online Request Form",
      description:
        "Submit cash advance requests digitally with all necessary details.",
    },
    {
      icon: <CheckCircle className="w-10 h-10" />,
      title: "Approval Workflow",
      description:
        "Multi-level approval process with supervisor, finance officer, and director roles.",
    },
    {
      icon: <BarChart3 className="w-10 h-10" />,
      title: "Dashboard & Reports",
      description:
        "Visualize transactions, trends, and summaries with comprehensive reporting.",
    },
    {
      icon: <Clock className="w-10 h-10" />,
      title: "Real-Time Tracking",
      description:
        "Monitor the status of your requests and advances in real-time.",
    },
    {
      icon: <Bell className="w-10 h-10" />,
      title: "Notifications",
      description: "Get instant alerts for pending actions and status changes.",
    },
  ];

  const userRoles = [
    {
      title: "Regular Staff",
      description:
        "Submit cash advance requests, view status, and retire funds.",
    },
    {
      title: "Line Manager",
      description: "Review and approve requests from subordinates.",
    },
    {
      title: "Finance Officer",
      description: "Final approval, disbursement, and monitoring.",
    },
    {
      title: "Auditor/Admin",
      description: "Generate reports, monitor usage, and manage users.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-800">
                  AdvanceTracker
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600">
                Features
              </a>
              <a href="#benefits" className="text-gray-600 hover:text-blue-600">
                Benefits
              </a>
              <a href="#roles" className="text-gray-600 hover:text-blue-600">
                User Roles
              </a>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 cursor-pointer"
                onClick={handleGetStarted}
              >
                Get Started
              </button>
            </div>

            {/* Mobile Navigation Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-blue-600"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#features"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600"
              >
                Features
              </a>
              <a
                href="#benefits"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600"
              >
                Benefits
              </a>
              <a
                href="#roles"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600"
              >
                User Roles
              </a>
              <button
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
                onClick={handleGetStarted}
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Streamline Your Cash Advance Process
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              A comprehensive web-based system for requesting, approving,
              monitoring, and retiring cash advances with improved financial
              accountability and transparency.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition duration-300 flex items-center justify-center cursor-pointer"
                onClick={handleGetStarted}
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-medium transition duration-300 cursor-pointer">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              System Features
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our comprehensive solution addresses all aspects of cash advance
              management with cutting-edge features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Key Benefits
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Experience improved efficiency, transparency, and financial
              accountability with our system.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="mb-6 flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Improved Efficiency
                  </h3>
                  <p className="text-gray-600">
                    Streamline the entire cash advance process from request to
                    retirement.
                  </p>
                </div>
              </div>

              <div className="mb-6 flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Enhanced Transparency
                  </h3>
                  <p className="text-gray-600">
                    Complete audit trail and logs for all user actions and
                    transactions.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Better Accountability
                  </h3>
                  <p className="text-gray-600">
                    Clear roles and responsibilities with proper approval
                    workflows.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 text-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Performance Metrics</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="bg-blue-500 p-2 rounded-full mr-4">
                    <Clock className="h-5 w-5" />
                  </div>
                  <span>Response time under 2 seconds</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-500 p-2 rounded-full mr-4">
                    <Shield className="h-5 w-5" />
                  </div>
                  <span>Bank-level data encryption</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-500 p-2 rounded-full mr-4">
                    <Users className="h-5 w-5" />
                  </div>
                  <span>24/7 availability from any web browser</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-500 p-2 rounded-full mr-4">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <span>Scalable for organizations of all sizes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section id="roles" className="py-16 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              User Roles & Responsibilities
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our system supports multiple user types with specific roles and
              permissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userRoles.map((role, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {role.title}
                </h3>
                <p className="text-gray-600">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Cash Advance Process?
          </h2>
          <p className="text-blue-100 max-w-3xl mx-auto mb-8">
            Join organizations that have improved financial accountability,
            efficiency and transparency with our system.
          </p>
          <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-medium transition duration-300">
            Request a Demo
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <BarChart3 className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">AdvanceTracker</span>
            </div>
            <p className="text-gray-400">
              Streamlining cash advance processes for improved financial
              accountability and transparency.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-gray-400 hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#benefits" className="text-gray-400 hover:text-white">
                  Benefits
                </a>
              </li>
              <li>
                <a href="#roles" className="text-gray-400 hover:text-white">
                  User Roles
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400">info@advancetracker.com</p>
            <p className="text-gray-400">+1 (555) 123-4567</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} AdvanceTracker. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
