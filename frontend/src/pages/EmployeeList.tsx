import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  useDeleteEmployeeMutation,
  useGetEmployeesQuery,
} from "../api/employeeApi";
import EmployeeTable from "../components/EmployeeTable";
import Loading from "../components/Loading";

export default function EmployeeList() {
  const [search, setSearch] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { data: employees, isLoading, isError, refetch } = useGetEmployeesQuery();
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();

  // Frontend filtering (Step 27)
  const filteredEmployees = useMemo(() => {
    if (!employees) return [];
    const term = search.trim().toLowerCase();
    if (!term) return employees;

    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        (emp.department?.toLowerCase().includes(term) ?? false) ||
        (emp.phone?.includes(term) ?? false)
    );
  }, [employees, search]);

  const handleDelete = async (id: number, name: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );
    if (!confirmed) return;

    try {
      await deleteEmployee(id).unwrap();
      setSuccessMessage(`Employee "${name}" deleted successfully.`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      alert("Failed to delete employee.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
        <Link
          to="/employees/add"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Employee
        </Link>
      </div>

      {successMessage && (
        <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-green-700">
          {successMessage}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="search" className="mb-1 block text-sm font-medium text-gray-700">
          Search Employee:
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, department..."
          className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {isLoading && <Loading message="Loading employees..." />}

      {isError && (
        <div className="rounded-md bg-red-50 px-4 py-6 text-center">
          <p className="text-red-700">Failed to load employees.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <EmployeeTable
          employees={filteredEmployees}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
