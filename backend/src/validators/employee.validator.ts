
import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import {
  EMAIL_REGEX,
  PHONE_REGEX,
  GENDER_OPTIONS,
  DEPARTMENT_OPTIONS,
  DESIGNATION_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  COURSE_OPTIONS,
} from "../constants";

/**
 * Validates employee creation / full-update request body.
 * Handles both JSON body fields and multipart/form-data string fields.
 */
export const validateEmployeeBody = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const {
    name,
    email,
    phone,
    gender,
    department,
    designation,
    status,
    courses,
    dateOfJoining,
    salary,
  } = req.body;

  const errors: string[] = [];

  // ─── Name ───
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Employee name is required");
  } else if (name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  } else if (name.trim().length > 50) {
    errors.push("Name must not exceed 50 characters");
  }

  // ─── Email ───
  if (!email || typeof email !== "string" || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push("Please provide a valid email address");
  }

  // ─── Phone ───
  if (!phone || typeof phone !== "string" || phone.trim().length === 0) {
    errors.push("Phone number is required");
  } else if (!PHONE_REGEX.test(phone.trim())) {
    errors.push("Phone number must be exactly 10 digits");
  }

  // ─── Gender (Dropdown) ───
  if (!gender) {
    errors.push("Gender is required");
  } else if (!GENDER_OPTIONS.includes(gender)) {
    errors.push(`Gender must be one of: ${GENDER_OPTIONS.join(", ")}`);
  }

  // ─── Department (Dropdown) ───
  if (!department) {
    errors.push("Department is required");
  } else if (!DEPARTMENT_OPTIONS.includes(department)) {
    errors.push(
      `Department must be one of: ${DEPARTMENT_OPTIONS.join(", ")}`
    );
  }

  // ─── Designation (Dropdown) ───
  if (!designation) {
    errors.push("Designation is required");
  } else if (!DESIGNATION_OPTIONS.includes(designation)) {
    errors.push(
      `Designation must be one of: ${DESIGNATION_OPTIONS.join(", ")}`
    );
  }

  // ─── Status (Dropdown) ───
  if (status && !EMPLOYMENT_STATUS_OPTIONS.includes(status)) {
    errors.push(
      `Status must be one of: ${EMPLOYMENT_STATUS_OPTIONS.join(", ")}`
    );
  }

  // ─── Courses (Checkbox array) ───
  // From form-data, courses may arrive as a single string or comma-separated
  let parsedCourses: string[] = [];

  if (!courses) {
    errors.push("At least one course must be selected");
  } else {
    // Handle multiple formats: JSON string, comma-separated, or array
    if (typeof courses === "string") {
      try {
        parsedCourses = JSON.parse(courses);
      } catch {
        parsedCourses = courses.split(",").map((c: string) => c.trim());
      }
    } else if (Array.isArray(courses)) {
      parsedCourses = courses;
    }

    if (parsedCourses.length === 0) {
      errors.push("At least one course must be selected");
    } else {
      const invalidCourses = parsedCourses.filter(
        (c) => !COURSE_OPTIONS.includes(c as any)
      );
      if (invalidCourses.length > 0) {
        errors.push(
          `Invalid course(s): ${invalidCourses.join(", ")}. Allowed: ${COURSE_OPTIONS.join(", ")}`
        );
      }
    }

    // Attach parsed array back for controller/service use
    req.body.courses = parsedCourses;
  }

  // ─── Date of Joining ───
  if (!dateOfJoining) {
    errors.push("Date of joining is required");
  } else {
    const parsedDate = new Date(dateOfJoining);
    if (isNaN(parsedDate.getTime())) {
      errors.push("Date of joining must be a valid date");
    } else if (parsedDate > new Date()) {
      errors.push("Date of joining cannot be in the future");
    }
  }

  // ─── Salary ───
  if (salary === undefined || salary === null || salary === "") {
    errors.push("Salary is required");
  } else {
    const parsedSalary = Number(salary);
    if (isNaN(parsedSalary)) {
      errors.push("Salary must be a valid number");
    } else if (parsedSalary < 0) {
      errors.push("Salary cannot be negative");
    }
  }

  // ─── Fail fast ───
  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  // ─── Sanitize ───
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.phone = phone.trim();
  req.body.salary = Number(salary);

  next();
};

/**
 * Lighter validation for partial updates (PATCH).
 * Only validates fields that are actually present in the body.
 */
export const validateEmployeeUpdate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const {
    name,
    email,
    phone,
    gender,
    department,
    designation,
    status,
    courses,
    dateOfJoining,
    salary,
  } = req.body;

  const errors: string[] = [];

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    } else if (name.trim().length > 50) {
      errors.push("Name must not exceed 50 characters");
    } else {
      req.body.name = name.trim();
    }
  }

  if (email !== undefined) {
    if (!EMAIL_REGEX.test(email.trim())) {
      errors.push("Please provide a valid email address");
    } else {
      req.body.email = email.trim().toLowerCase();
    }
  }

  if (phone !== undefined) {
    if (!PHONE_REGEX.test(phone.trim())) {
      errors.push("Phone number must be exactly 10 digits");
    } else {
      req.body.phone = phone.trim();
    }
  }

  if (gender !== undefined && !GENDER_OPTIONS.includes(gender)) {
    errors.push(`Gender must be one of: ${GENDER_OPTIONS.join(", ")}`);
  }

  if (department !== undefined && !DEPARTMENT_OPTIONS.includes(department)) {
    errors.push(
      `Department must be one of: ${DEPARTMENT_OPTIONS.join(", ")}`
    );
  }

  if (designation !== undefined && !DESIGNATION_OPTIONS.includes(designation)) {
    errors.push(
      `Designation must be one of: ${DESIGNATION_OPTIONS.join(", ")}`
    );
  }

  if (status !== undefined && !EMPLOYMENT_STATUS_OPTIONS.includes(status)) {
    errors.push(
      `Status must be one of: ${EMPLOYMENT_STATUS_OPTIONS.join(", ")}`
    );
  }

  if (courses !== undefined) {
    let parsedCourses: string[] = [];
    if (typeof courses === "string") {
      try {
        parsedCourses = JSON.parse(courses);
      } catch {
        parsedCourses = courses.split(",").map((c: string) => c.trim());
      }
    } else if (Array.isArray(courses)) {
      parsedCourses = courses;
    }

    const invalidCourses = parsedCourses.filter(
      (c) => !COURSE_OPTIONS.includes(c as any)
    );
    if (invalidCourses.length > 0) {
      errors.push(
        `Invalid course(s): ${invalidCourses.join(", ")}. Allowed: ${COURSE_OPTIONS.join(", ")}`
      );
    }
    req.body.courses = parsedCourses;
  }

  if (dateOfJoining !== undefined) {
    const parsedDate = new Date(dateOfJoining);
    if (isNaN(parsedDate.getTime())) {
      errors.push("Date of joining must be a valid date");
    } else if (parsedDate > new Date()) {
      errors.push("Date of joining cannot be in the future");
    }
  }

  if (salary !== undefined) {
    const parsedSalary = Number(salary);
    if (isNaN(parsedSalary)) {
      errors.push("Salary must be a valid number");
    } else if (parsedSalary < 0) {
      errors.push("Salary cannot be negative");
    } else {
      req.body.salary = parsedSalary;
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  next();
};
