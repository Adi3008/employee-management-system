import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateEmployeeMutation } from "../api/employeeApi";
import EmployeeForm from "../components/EmployeeForm";
import type { EmployeeInput } from "../types/employee";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (data: EmployeeInput) => {
    setError("");
    try {
      await createEmployee(data).unwrap();
      setSuccess("Employee created successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : "Failed to create employee.";
      setError(message || "Failed to create employee.");
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="text-sm text-blue-600 hover:text-blue-800">
          ← Back to Employee List
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Add Employee</h1>
      </div>

      {success && (
        <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <EmployeeForm
          onSubmit={handleSubmit}
          submitLabel="Create Employee"
          isSubmitting={isLoading}
        />
      </div>
    </div>
  );
}
