import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
} from "../api/employeeApi";
import EmployeeForm from "../components/EmployeeForm";
import Loading from "../components/Loading";
import type { EmployeeInput } from "../types/employee";

export default function EditEmployee() {
  const { id } = useParams<{ id: string }>();
  const employeeId = Number(id);
  const navigate = useNavigate();

  const { data: employee, isLoading, isError, refetch } =
    useGetEmployeeByIdQuery(employeeId);
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (data: EmployeeInput) => {
    setError("");
    try {
      // PUT — sends the complete employee object for full replacement
      await updateEmployee({ id: employeeId, ...data }).unwrap();
      setSuccess("Employee updated successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : "Failed to update employee.";
      setError(message || "Failed to update employee.");
    }
  };

  if (isLoading) return <Loading message="Loading employee..." />;

  if (isError || !employee) {
    return (
      <div className="mx-auto max-w-lg px-4 py-8 text-center">
        <p className="text-red-700">Failed to load employee.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 rounded-md bg-red-600 px-4 py-2 text-sm text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="text-sm text-blue-600 hover:text-blue-800">
          ← Back to Employee List
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Edit Employee</h1>
        <p className="mt-1 text-sm text-gray-500">
          Uses PUT — complete replacement of all employee fields
        </p>
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
          initialValues={{
            name: employee.name,
            email: employee.email,
            phone: employee.phone || "",
            department: employee.department || "",
            salary: employee.salary ?? undefined,
            status: employee.status,
          }}
          onSubmit={handleSubmit}
          submitLabel="Update Employee"
          isSubmitting={isUpdating}
        />
      </div>
    </div>
  );
}
