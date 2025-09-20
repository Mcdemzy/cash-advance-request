import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
} from "lucide-react";
import { requestService } from "../../services/requests";
import type { CreateRequestData } from "../../services/requests";

const NewRequest = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    purpose: "",
    amount: "",
    dateNeeded: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.purpose.trim()) newErrors.purpose = "Purpose is required";
    if (!formData.amount || Number(formData.amount) <= 0)
      newErrors.amount = "Valid amount is required";
    if (!formData.dateNeeded) newErrors.dateNeeded = "Date needed is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Convert form data to match the expected interface
      const requestData: CreateRequestData = {
        purpose: formData.purpose,
        description: formData.description,
        amount: Number(formData.amount),
        dateNeeded: formData.dateNeeded,
        priority: formData.priority,
      };

      await requestService.createRequest(requestData);
      navigate("/dashboard/requests", {
        state: { message: "Cash advance request submitted successfully!" },
      });
    } catch (error) {
      console.error("Error submitting request:", error);
      setErrors({ submit: "Failed to submit request. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            New Cash Advance Request
          </h1>
          <p className="text-gray-600">
            Submit a new cash advance request for approval
          </p>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Purpose */}
            <div>
              <label
                htmlFor="purpose"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Purpose of Advance *
              </label>
              <input
                type="text"
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.purpose ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="e.g., Conference attendance, Office supplies"
              />
              {errors.purpose && (
                <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>
              )}
            </div>

            {/* Amount, Date, and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Amount Requested ($) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`pl-10 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.amount ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="dateNeeded"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date Needed By *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="dateNeeded"
                    name="dateNeeded"
                    value={formData.dateNeeded}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className={`pl-10 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.dateNeeded ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.dateNeeded && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateNeeded}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Detailed Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Provide detailed information about what the cash advance will be used for..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Submit button */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>

        {/* Help text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Need help?</h3>
          <p className="text-sm text-blue-600">
            For questions about cash advance policies or approval processes,
            please contact the finance department at finance@company.com or
            extension 1234.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewRequest;