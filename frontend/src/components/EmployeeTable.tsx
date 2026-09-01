import { Link } from "react-router-dom";
import type { Employee } from "../types/employee";

interface EmployeeTableProps {
  employees: Employee[];
  onDelete: (id: number, name: string) => void;
  isDeleting: boolean;
}

export default function EmployeeTable({
  employees,
  onDelete,
  isDeleting,
}: EmployeeTableProps) {
  if (employees.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
        No employees found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Email
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Department
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Salary
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                {employee.id}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                {employee.name}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                {employee.email}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                {employee.department || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                {employee.salary ? `₹${Number(employee.salary).toLocaleString()}` : "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    employee.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {employee.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <div className="flex gap-2">
                  <Link
                    to={`/employees/${employee.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View
                  </Link>
                  <Link
                    to={`/employees/${employee.id}/edit`}
                    className="text-amber-600 hover:text-amber-800"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(employee.id, employee.name)}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
