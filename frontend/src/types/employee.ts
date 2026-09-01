export type EmployeeStatus = "Active" | "Inactive";

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  department: string | null;
  salary: number | null;
  status: EmployeeStatus;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeInput {
  name: string;
  email: string;
  phone?: string;
  department?: string;
  salary?: number;
  status?: EmployeeStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface UpdateEmployeePayload extends EmployeeInput {
  id: number;
}

export interface PatchEmployeePayload {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  salary?: number;
  status?: EmployeeStatus;
}
