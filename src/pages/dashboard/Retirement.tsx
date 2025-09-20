import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
} from "lucide-react";
import { requestService } from "../../services/requests";
import type { AdvanceForRetirement } from "../../services/requests";

const Retirement = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [advances, setAdvances] = useState<AdvanceForRetirement[]>([]);
  const [formData, setFormData] = useState({
    advanceId: "",
    retirementDate: new Date().toISOString().split("T")[0],
    totalExpenses: "",
    expenseBreakdown: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchAdvancesForRetirement();
  }, []);

  const fetchAdvancesForRetirement = async () => {
    try {
      const advancesData = await requestService.getAdvancesForRetirement();
      setAdvances(advancesData);
    } catch (error) {
      console.error("Error fetching advances:", error);
    }
  };

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

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.advanceId)
      newErrors.advanceId = "Please select an advance to retire";
    if (!formData.retirementDate)
      newErrors.retirementDate = "Retirement date is required";
    if (!formData.totalExpenses || Number(formData.totalExpenses) <= 0) {
      newErrors.totalExpenses = "Valid expense amount is required";
    }
    if (!formData.expenseBreakdown.trim())
      newErrors.expenseBreakdown = "Expense breakdown is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const retirementData = {
        retirementDate: formData.retirementDate,
        totalExpenses: Number(formData.totalExpenses),
        expenseBreakdown: formData.expenseBreakdown,
      };

      await requestService.retireAdvance(formData.advanceId, retirementData);
      navigate("/dashboard/requests", {
        state: { message: "Advance retirement submitted successfully!" },
      });
    } catch (error) {
      console.error("Error submitting retirement:", error);
      setErrors({ submit: "Failed to submit retirement. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
            Retire Cash Advance
          </h1>
          <p className="text-gray-600">
            Submit documentation for advance retirement
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

            {/* Select Advance */}
            <div>
              <label
                htmlFor="advanceId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Advance to Retire *
              </label>
              <select
                id="advanceId"
                name="advanceId"
                value={formData.advanceId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.advanceId ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Select an advance</option>
                {advances.map((advance) => (
                  <option key={advance.id} value={advance.id}>
                    {advance.purpose} - {formatCurrency(advance.amount)}{" "}
                    (Needed by: {formatDate(advance.dateNeeded)})
                  </option>
                ))}
              </select>
              {errors.advanceId && (
                <p className="mt-1 text-sm text-red-600">{errors.advanceId}</p>
              )}
            </div>

            {/* Retirement Date and Total Expenses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="retirementDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Retirement Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="retirementDate"
                    name="retirementDate"
                    value={formData.retirementDate}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split("T")[0]}
                    className={`pl-10 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.retirementDate
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.retirementDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.retirementDate}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="totalExpenses"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Total Expenses ($) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="totalExpenses"
                    name="totalExpenses"
                    value={formData.totalExpenses}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`pl-10 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.totalExpenses
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.totalExpenses && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.totalExpenses}
                  </p>
                )}
              </div>
            </div>

            {/* Expense Breakdown */}
            <div>
              <label
                htmlFor="expenseBreakdown"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Expense Breakdown *
              </label>
              <textarea
                id="expenseBreakdown"
                name="expenseBreakdown"
                value={formData.expenseBreakdown}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.expenseBreakdown ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Provide a detailed breakdown of how the advance was used..."
              />
              {errors.expenseBreakdown && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.expenseBreakdown}
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
                {isSubmitting ? "Submitting..." : "Submit Retirement"}
              </button>
            </div>
          </form>
        </div>

        {/* Help text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Important Information
          </h3>
          <ul className="text-sm text-blue-600 space-y-1">
            <li>• Submit retirement within 30 days of advance approval</li>
            <li>
              • Provide detailed breakdown of all expenses
            </li>
            <li>
              • Any unspent funds must be returned with the retirement
              submission
            </li>
            <li>
              • Contact finance@company.com for questions about retirement
              process
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Retirement;