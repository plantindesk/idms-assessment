import mongoose, { Schema } from "mongoose";
import type { IEmployee } from "../types/employee.types";
import {
  GENDER_OPTIONS,
  DEPARTMENT_OPTIONS,
  DESIGNATION_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  COURSE_OPTIONS,
  PHONE_REGEX,
  EMAIL_REGEX,
} from "../constants";

const EmployeeSchema: Schema<IEmployee> = new Schema(
  {
    // ─── Auto-generated unique employee identifier ───
    uniqueId: {
      type: String,
      unique: true,
      trim: true,
    },

    // ─── Personal Information ───
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must not exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(value: string): boolean {
          return EMAIL_REGEX.test(value);
        },
        message: "Please provide a valid email address",
      },
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: function(value: string): boolean {
          return PHONE_REGEX.test(value);
        },
        message: "Phone number must be exactly 10 digits",
      },
    },

    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: [...GENDER_OPTIONS],
        message: `Gender must be one of: ${GENDER_OPTIONS.join(", ")}`,
      },
    },

    // ─── Employment Information ───
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: {
        values: [...DEPARTMENT_OPTIONS],
        message: `Department must be one of: ${DEPARTMENT_OPTIONS.join(", ")}`,
      },
    },

    designation: {
      type: String,
      required: [true, "Designation is required"],
      enum: {
        values: [...DESIGNATION_OPTIONS],
        message: `Designation must be one of: ${DESIGNATION_OPTIONS.join(", ")}`,
      },
    },

    status: {
      type: String,
      required: true,
      enum: {
        values: [...EMPLOYMENT_STATUS_OPTIONS],
        message: `Status must be one of: ${EMPLOYMENT_STATUS_OPTIONS.join(", ")}`,
      },
      default: "Active",
    },

    // ─── Education: multiple courses (checkbox array) ───
    courses: {
      type: [
        {
          type: String,
          enum: {
            values: [...COURSE_OPTIONS],
            message: `Each course must be one of: ${COURSE_OPTIONS.join(", ")}`,
          },
        },
      ],
      validate: {
        validator: function(value: string[]): boolean {
          return value.length > 0;
        },
        message: "At least one course must be selected",
      },
    },

    dateOfJoining: {
      type: Date,
      required: [true, "Date of joining is required"],
      validate: {
        validator: function(value: Date): boolean {
          // Date of joining must not be in the future
          return value <= new Date();
        },
        message: "Date of joining cannot be in the future",
      },
    },

    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary cannot be negative"],
    },

    // ─── Profile Image (file path / URL stored as string) ───
    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    versionKey: false,
  }
);

// ─── Indexes for search, filter, and sort operations ───
EmployeeSchema.index({ email: 1 });
EmployeeSchema.index({ department: 1 });
EmployeeSchema.index({ status: 1 });
EmployeeSchema.index({ name: "text" }); // Text index for search
EmployeeSchema.index({ createdAt: -1 });

// ─── Pre-save hook: auto-generate uniqueId (e.g., EMP-00001) ───
EmployeeSchema.pre<IEmployee>("save", async function() {
  if (this.isNew && !this.uniqueId) {
    const lastEmployee = await mongoose
      .model<IEmployee>("Employee")
      .findOne({})
      .sort({ createdAt: -1 })
      .select("uniqueId")
      .lean();

    let nextNumber = 1;

    if (lastEmployee?.uniqueId) {
      const lastNumber = parseInt(
        lastEmployee.uniqueId.replace("EMP-", ""),
        10
      );
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    this.uniqueId = `EMP-${String(nextNumber).padStart(5, "0")}`;
  }
});

const Employee = mongoose.model<IEmployee>("Employee", EmployeeSchema);

export default Employee;
