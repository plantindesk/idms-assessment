import { Document } from "mongoose";
import {
  GENDER_OPTIONS,
  DEPARTMENT_OPTIONS,
  DESIGNATION_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  COURSE_OPTIONS,
} from "../constants";

// Derive union types from const arrays
export type Gender = (typeof GENDER_OPTIONS)[number];
export type Department = (typeof DEPARTMENT_OPTIONS)[number];
export type Designation = (typeof DESIGNATION_OPTIONS)[number];
export type EmploymentStatus = (typeof EMPLOYMENT_STATUS_OPTIONS)[number];
export type Course = (typeof COURSE_OPTIONS)[number];

export interface IEmployee extends Document {
  uniqueId: string;
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  department: Department;
  designation: Designation;
  status: EmploymentStatus;
  courses: Course[];
  dateOfJoining: Date;
  salary: number;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}
