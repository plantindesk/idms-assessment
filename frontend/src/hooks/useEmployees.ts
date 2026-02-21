
import { useState, useEffect, useCallback, useRef } from "react";
import { employeeApi } from "@/api/employeeApi";
import { useDebounce } from "./useDebounce";
import type {
  Employee,
  EmployeeFilters,
  Pagination,
} from "@/types/employee.types";

const DEFAULT_FILTERS: EmployeeFilters = {
  search: "",
  department: "",
  designation: "",
  gender: "",
  status: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: 10,
};

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState<EmployeeFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(filters.search, 400);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryFilters: EmployeeFilters = {
        ...filtersRef.current,
        search: debouncedSearch,
      };
      const response = await employeeApi.getAll(queryFilters);
      setEmployees(response.data.employees);
      setPagination(response.data.pagination);
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : "Failed to fetch employees";
      setError(message || "Failed to fetch employees");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const updateFilter = (key: keyof EmployeeFilters, value: string | number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : (value as number) ?? 1,
    }));
  };

  const setPage = (page: number) => updateFilter("page", page);
  const resetFilters = () => setFilters(DEFAULT_FILTERS);
  const refetch = () => fetchEmployees();

  return {
    employees,
    pagination,
    filters,
    isLoading,
    error,
    updateFilter,
    setPage,
    resetFilters,
    refetch,
  };
};
