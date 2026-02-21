// frontend/src/types/employee.types.ts

export interface Employee {
  _id: string;
  uniqueId: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  department: string;
  designation: string;
  status: string;
  courses: string[];
  dateOfJoining: string;
  salary: number;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  gender: string;
  department: string;
  designation: string;
  status: string;
  courses: string[];
  dateOfJoining: string;
  salary: string;
  profileImage: File | null;
}

export interface EmployeeFilters {
  search?: string;
  department?: string;
  designation?: string;
  gender?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalEmployees: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedEmployeeResponse {
  employees: Employee[];
  pagination: Pagination;
}
