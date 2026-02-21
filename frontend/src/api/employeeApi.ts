// frontend/src/api/employeeApi.ts

import API from "./axiosInstance";
import type {
  Employee,
  EmployeeFilters,
  PaginatedEmployeeResponse,
} from "@/types/employee.types";

interface SingleEmployeeResponse {
  success: boolean;
  data: { employee: Employee };
  message: string;
}

interface EmployeeListResponse {
  success: boolean;
  data: PaginatedEmployeeResponse;
  message: string;
}

interface StatsResponse {
  success: boolean;
  data: {
    stats: {
      totalEmployees: number;
      activeEmployees: number;
      inactiveEmployees: number;
      byDepartment: { _id: string; count: number }[];
      byDesignation: { _id: string; count: number }[];
    };
  };
  message: string;
}

function buildQueryParams(
  filters: EmployeeFilters
): Record<string, string | number> {
  const params: Record<string, string | number> = {};
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.department) params.department = filters.department;
  if (filters.designation) params.designation = filters.designation;
  if (filters.gender) params.gender = filters.gender;
  if (filters.status) params.status = filters.status;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  return params;
}

export const employeeApi = {
  getAll: async (filters: EmployeeFilters): Promise<EmployeeListResponse> => {
    const params = buildQueryParams(filters);
    const { data } = await API.get<EmployeeListResponse>("/employees", {
      params,
    });
    return data;
  },

  getById: async (id: string): Promise<SingleEmployeeResponse> => {
    const { data } = await API.get<SingleEmployeeResponse>(
      `/employees/${id}`
    );
    return data;
  },

  create: async (formData: FormData): Promise<SingleEmployeeResponse> => {
    const { data } = await API.post<SingleEmployeeResponse>(
      "/employees",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },

  update: async (
    id: string,
    formData: FormData
  ): Promise<SingleEmployeeResponse> => {
    const { data } = await API.put<SingleEmployeeResponse>(
      `/employees/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await API.delete(`/employees/${id}`);
  },

  getStats: async (): Promise<StatsResponse> => {
    const { data } = await API.get<StatsResponse>("/employees/stats");
    return data;
  },
};
