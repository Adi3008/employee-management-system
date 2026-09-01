import { useState } from "react";
import type { EmployeeInput } from "../types/employee";

interface EmployeeFormProps {
  initialValues?: EmployeeInput;
  onSubmit: (data: EmployeeInput) => Promise<void>;
  submitLabel: string;
  isSubmitting?: boolean;
}

const defaultValues: EmployeeInput = {
  name: "",
  email: "",
  phone: "",
  department: "",
  salary: undefined,
  status: "Active",
};

export default function EmployeeForm({
  initialValues,
  onSubmit,
  submitLabel,
  isSubmitting = false,
}: EmployeeFormProps) {
  const [formData, setFormData] = useState<EmployeeInput>({
    ...defaultValues,
    ...initialValues,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email must be valid";
    }

    if (formData.salary !== undefined && formData.salary !== null) {
      if (Number(formData.salary) <= 0) {
        newErrors.salary = "Salary must be a positive number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "salary" ? (value ? Number(value) : undefined) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
          Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
          Email *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="text"
          value={formData.phone || ""}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="department" className="mb-1 block text-sm font-medium text-gray-700">
          Department
        </label>
        <input
          id="department"
          name="department"
          type="text"
          value={formData.department || ""}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="salary" className="mb-1 block text-sm font-medium text-gray-700">
          Salary
        </label>
        <input
          id="salary"
          name="salary"
          type="number"
          min="0"
          step="0.01"
          value={formData.salary ?? ""}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary}</p>}
      </div>

      <div>
        <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
