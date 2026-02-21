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

export const EMPLOYMENT_STATUS_OPTIONS = [
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

// Regex: exactly 10 digits
export const PHONE_REGEX = /^\d{10}$/;

// Regex: standard email validation
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
