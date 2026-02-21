// frontend/src/utils/constants.ts

export const GENDER_OPTIONS = ["Male", "Female", "Other"] as const;

export const DEPARTMENT_OPTIONS = [
  "HR",
  "Engineering",
  "Marketing",
  "Sales",
  "Finance",
  "Operations",
  "IT",
  "Legal",
] as const;

export const DESIGNATION_OPTIONS = [
  "Intern",
  "Junior Developer",
  "Senior Developer",
  "Team Lead",
  "Manager",
  "Senior Manager",
  "Director",
  "VP",
  "CTO",
  "CEO",
] as const;

export const STATUS_OPTIONS = [
  "Active",
  "Inactive",
  "Terminated",
  "On Leave",
  "Probation",
] as const;

export const COURSE_OPTIONS = [
  "MCA",
  "BCA",
  "BSc",
  "MSc",
  "BTech",
  "MTech",
  "MBA",
  "BBA",
] as const;

export const STATUS_VARIANT_MAP: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Active: "default",
  Inactive: "secondary",
  Terminated: "destructive",
  "On Leave": "outline",
  Probation: "secondary",
};

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

export const UPLOADS_BASE_URL =
  import.meta.env.VITE_UPLOADS_BASE_URL || "http://localhost:5000";
