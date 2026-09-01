import { Link, useParams } from "react-router-dom";
import {
  useGetEmployeeByIdQuery,
  usePatchEmployeeMutation,
} from "../api/employeeApi";
import Loading from "../components/Loading";

export default function EmployeeDetails() {
  const { id } = useParams<{ id: string }>();
  const employeeId = Number(id);

  const { data: employee, isLoading, isError, refetch } =
    useGetEmployeeByIdQuery(employeeId);
  const [patchEmployee, { isLoading: isPatching }] = usePatchEmployeeMutation();

  const handleStatusChange = async (newStatus: "Active" | "Inactive") => {
    try {
      // PATCH — only the status field is sent (partial update)
      await patchEmployee({ id: employeeId, status: newStatus }).unwrap();
    } catch {
      alert("Failed to update status.");
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString();
  };

  if (isLoading) return <Loading message="Loading employee details..." />;

  if (isError || !employee) {
    return (
      <div className="mx-auto max-w-lg px-4 py-8 text-center">
        <p className="text-red-700">Employee not found or failed to load.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 rounded-md bg-red-600 px-4 py-2 text-sm text-white"
        >
          Retry
        </button>
        <div className="mt-4">
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            ← Back to list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="text-sm text-blue-600 hover:text-blue-800">
          ← Back to Employee List
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Employee Details</h1>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <dl className="space-y-4">
          <DetailRow label="Name" value={employee.name} />
          <DetailRow label="Email" value={employee.email} />
          <DetailRow label="Phone" value={employee.phone || "—"} />
          <DetailRow label="Department" value={employee.department || "—"} />
          <DetailRow
            label="Salary"
            value={
              employee.salary
                ? `₹${Number(employee.salary).toLocaleString()}`
                : "—"
            }
          />
          <DetailRow label="Status" value={employee.status} />
          <DetailRow label="Created Date" value={formatDate(employee.created_at)} />
          <DetailRow label="Updated Date" value={formatDate(employee.updated_at)} />
        </dl>

        {/* PATCH demo — partial update of status only */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">Employee Status</h2>
          <p className="mt-1 text-sm text-gray-600">
            Current Status:{" "}
            <span
              className={
                employee.status === "Active" ? "text-green-600" : "text-red-600"
              }
            >
              {employee.status}
            </span>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Uses PATCH — only the status field is updated
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              disabled={isPatching || employee.status === "Active"}
              onClick={() => handleStatusChange("Active")}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              Activate
            </button>
            <button
              type="button"
              disabled={isPatching || employee.status === "Inactive"}
              onClick={() => handleStatusChange("Inactive")}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              Deactivate
            </button>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to={`/employees/${employee.id}/edit`}
            className="text-amber-600 hover:text-amber-800"
          >
            Edit full record (PUT) →
          </Link>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-2">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900">{value}</dd>
    </div>
  );
}
