import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  FileText,

  DollarSign,
  Calendar,
} from "lucide-react";
import { requestService } from "../../services/requests";

interface AdvanceForRetirement {
  id: string;
  purpose: string;
  amount: number;
  disbursedDate: string;
  retired: boolean;
}

const Retirement = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [advances, setAdvances] = useState<AdvanceForRetirement[]>([]);
  // const [selectedAdvance, setSelectedAdvance] = useState<string>("");
  const [formData, setFormData] = useState({
    advanceId: "",
    retirementDate: new Date().toISOString().split("T")[0],
    totalExpenses: "",
    description: "",
    receipts: [] as File[],
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      receipts: [...prev.receipts, ...files],
    }));
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      receipts: prev.receipts.filter((_, i) => i !== index),
    }));
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
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.receipts.length === 0)
      newErrors.receipts = "At least one receipt is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await requestService.submitRetirement(formData);
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
                    (Disbursed: {formatDate(advance.disbursedDate)})
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

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Expense Breakdown *
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
                placeholder="Provide a detailed breakdown of how the advance was used..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Receipts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Receipts *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="receipts"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>Upload receipts</span>
                      <input
                        id="receipts"
                        name="receipts"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="sr-only"
                        accept=".jpg,.jpeg,.png,.pdf"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    JPG, PNG, PDF up to 10MB each
                  </p>
                </div>
              </div>
              {errors.receipts && (
                <p className="mt-1 text-sm text-red-600">{errors.receipts}</p>
              )}

              {/* File list */}
              {formData.receipts.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Uploaded receipts:
                  </h4>
                  <ul className="space-y-2">
                    {formData.receipts.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                      >
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600 truncate">
                            {file.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
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
            <li>• Submit retirement within 30 days of advance disbursement</li>
            <li>
              • Include all original receipts and supporting documentation
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
