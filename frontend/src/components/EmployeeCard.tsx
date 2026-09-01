import type { Employee } from "../types/employee";

interface EmployeeCardProps {
  employee: Employee;
}

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
      <p className="text-sm text-gray-600">{employee.email}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <span className="text-gray-500">Department</span>
        <span>{employee.department || "—"}</span>
        <span className="text-gray-500">Salary</span>
        <span>{employee.salary ? `₹${employee.salary.toLocaleString()}` : "—"}</span>
        <span className="text-gray-500">Status</span>
        <span
          className={
            employee.status === "Active"
              ? "font-medium text-green-600"
              : "font-medium text-red-600"
          }
        >
          {employee.status}
        </span>
      </div>
    </div>
  );
}
