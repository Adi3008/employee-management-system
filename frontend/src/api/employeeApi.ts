import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  ApiResponse,
  Employee,
  EmployeeInput,
  PatchEmployeePayload,
  UpdateEmployeePayload,
} from "../types/employee";

// Use relative URL so Vite dev proxy forwards /api → http://localhost:6000/api
// This avoids cross-origin (CORS) issues in development.
const API_BASE_URL = "/api";

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Employees"],
  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], string | void>({
      query: (search) => {
        if (search) {
          return `/employees?search=${encodeURIComponent(search)}`;
        }
        return "/employees";
      },
      transformResponse: (response: ApiResponse<Employee[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Employees" as const, id })),
              { type: "Employees", id: "LIST" },
            ]
          : [{ type: "Employees", id: "LIST" }],
    }),

    getEmployeeById: builder.query<Employee, number>({
      query: (id) => `/employees/${id}`,
      transformResponse: (response: ApiResponse<Employee>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Employees", id }],
    }),

    createEmployee: builder.mutation<Employee, EmployeeInput>({
      query: (body) => ({
        url: "/employees",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<Employee>) => response.data,
      invalidatesTags: [{ type: "Employees", id: "LIST" }],
    }),

    updateEmployee: builder.mutation<Employee, UpdateEmployeePayload>({
      query: ({ id, ...body }) => ({
        url: `/employees/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<Employee>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Employees", id },
        { type: "Employees", id: "LIST" },
      ],
    }),

    patchEmployee: builder.mutation<Employee, PatchEmployeePayload>({
      query: ({ id, ...body }) => ({
        url: `/employees/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponse<Employee>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Employees", id },
        { type: "Employees", id: "LIST" },
      ],
    }),

    deleteEmployee: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Employees", id },
        { type: "Employees", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  usePatchEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
