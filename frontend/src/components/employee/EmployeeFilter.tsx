import type { EmployeeFilters } from "../../types/employee.types";
import {
  DEPARTMENT_OPTIONS,
  DESIGNATION_OPTIONS,
  GENDER_OPTIONS,
  STATUS_OPTIONS,
} from "../../utils/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw, Search } from "lucide-react";

interface EmployeeFilterProps {
  filters: EmployeeFilters;
  onFilterChange: (key: keyof EmployeeFilters, value: EmployeeFilters[keyof EmployeeFilters]) => void;
  onReset: () => void;
}

const EmployeeFilter = ({
  filters,
  onFilterChange,
  onReset,
}: EmployeeFilterProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            name="search"
            placeholder="Search by name, email, or ID..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.department || "all"}
          onValueChange={(value) => onFilterChange("department", value === "all" ? undefined : value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENT_OPTIONS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.designation || "all"}
          onValueChange={(value) => onFilterChange("designation", value === "all" ? undefined : value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Designations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Designations</SelectItem>
            {DESIGNATION_OPTIONS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.gender || "all"}
          onValueChange={(value) => onFilterChange("gender", value === "all" ? undefined : value)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="All Genders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            {GENDER_OPTIONS.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status || "all"}
          onValueChange={(value) => onFilterChange("status", value === "all" ? undefined : value)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select
            value={filters.sortBy || "createdAt"}
            onValueChange={(value) => onFilterChange("sortBy", value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="salary">Salary</SelectItem>
              <SelectItem value="dateOfJoining">Date of Joining</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select
          value={filters.sortOrder || "desc"}
          onValueChange={(value) => onFilterChange("sortOrder", value)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Descending</SelectItem>
            <SelectItem value="asc">Ascending</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="size-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default EmployeeFilter;
