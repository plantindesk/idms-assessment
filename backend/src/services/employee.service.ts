
import fs from "fs";
import path from "path";
import Employee from "../models/employee.model";
import type { IEmployee } from "../types/employee.types";
import ApiError from "../utils/ApiError";
import logger from "../utils/logger";

// ─── Query interface for search/filter/sort/paginate ───
export interface EmployeeQueryParams {
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

export interface PaginatedResult {
  employees: IEmployee[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalEmployees: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

class EmployeeService {
  /**
   * CREATE — Handles new employee creation with optional profile image.
   */
  async createEmployee(
    data: Partial<IEmployee>,
    file?: Express.Multer.File
  ): Promise<IEmployee> {
    // Check for duplicate email
    const existingEmployee = await Employee.findOne({
      email: data.email,
    }).lean();

    if (existingEmployee) {
      // Clean up uploaded file if email is duplicate
      if (file?.path) {
        this.deleteFile(file.path);
      }
      throw new ApiError(409, "An employee with this email already exists");
    }

    // Attach profile image path if file was uploaded
    if (file) {
      data.profileImage = `/uploads/profiles/${file.filename}`;
    }

    const employee = await Employee.create(data);

    logger.info(`Employee created: ${employee.uniqueId} — ${employee.name}`);

    return employee;
  }

  /**
   * READ ALL — Advanced search, filter, sort, and paginate.
   *
   * Builds a single Mongoose query object from all query parameters.
   * Uses $regex for case-insensitive text searching across name and email.
   */
  async getEmployees(params: EmployeeQueryParams): Promise<PaginatedResult> {
    const {
      search,
      department,
      designation,
      gender,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = params;

    // ─── Build the filter object ───
    const filter: Record<string, any> = {};

    // 🔍 Search: case-insensitive regex across name, email, and uniqueId
    if (search && search.trim().length > 0) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { uniqueId: { $regex: searchRegex } },
      ];
    }

    // 🏢 Department filter (exact match from dropdown)
    if (department && department.trim().length > 0) {
      filter.department = department.trim();
    }

    // 💼 Designation filter (exact match from dropdown)
    if (designation && designation.trim().length > 0) {
      filter.designation = designation.trim();
    }

    // 👤 Gender filter (exact match from dropdown)
    if (gender && gender.trim().length > 0) {
      filter.gender = gender.trim();
    }

    // ✅ Status filter (exact match from dropdown)
    if (status && status.trim().length > 0) {
      filter.status = status.trim();
    }

    // ─── Sorting ───
    const allowedSortFields = [
      "name",
      "email",
      "department",
      "designation",
      "dateOfJoining",
      "salary",
      "createdAt",
      "uniqueId",
    ];

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortField]: sortDirection };

    // ─── Pagination ───
    const pageNum = Math.max(1, Math.floor(page));
    const limitNum = Math.min(100, Math.max(1, Math.floor(limit)));
    const skip = (pageNum - 1) * limitNum;

    // ─── Execute query + count in parallel for performance ───
    const [employees, totalEmployees] = await Promise.all([
      Employee.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean()
        .exec(),
      Employee.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(totalEmployees / limitNum);

    logger.debug(
      `Query: filter=${JSON.stringify(filter)}, sort=${JSON.stringify(sort)}, ` +
      `page=${pageNum}, limit=${limitNum}, found=${totalEmployees}`
    );

    return {
      employees: employees as IEmployee[],
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalEmployees,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    };
  }

  /**
   * READ ONE — Get a single employee by MongoDB _id.
   */
  async getEmployeeById(id: string): Promise<IEmployee> {
    const employee = await Employee.findById(id).exec();

    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    return employee;
  }

  /**
   * UPDATE — Partial or full update with optional new profile image.
   * Deletes old profile image file from disk if a new one is uploaded.
   */
  async updateEmployee(
    id: string,
    data: Partial<IEmployee>,
    file?: Express.Multer.File
  ): Promise<IEmployee> {
    const existingEmployee = await Employee.findById(id).exec();

    if (!existingEmployee) {
      // Clean up uploaded file if employee doesn't exist
      if (file?.path) {
        this.deleteFile(file.path);
      }
      throw new ApiError(404, "Employee not found");
    }

    // Check for duplicate email (excluding current employee)
    if (data.email && data.email !== existingEmployee.email) {
      const emailTaken = await Employee.findOne({
        email: data.email,
        _id: { $ne: id },
      }).lean();

      if (emailTaken) {
        if (file?.path) {
          this.deleteFile(file.path);
        }
        throw new ApiError(409, "An employee with this email already exists");
      }
    }

    // Handle profile image replacement
    if (file) {
      // Delete old image from disk
      if (existingEmployee.profileImage) {
        const oldImagePath = path.resolve(
          __dirname,
          "../../",
          existingEmployee.profileImage.replace(/^\//, "")
        );
        this.deleteFile(oldImagePath);
      }

      data.profileImage = `/uploads/profiles/${file.filename}`;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { $set: data },
      {
        new: true,           // Return updated document
        runValidators: true, // Run schema validations on update
      }
    ).exec();

    if (!updatedEmployee) {
      throw new ApiError(500, "Failed to update employee");
    }

    logger.info(
      `Employee updated: ${updatedEmployee.uniqueId} — ${updatedEmployee.name}`
    );

    return updatedEmployee;
  }

  /**
   * DELETE — Remove employee and their profile image from disk.
   */
  async deleteEmployee(id: string): Promise<IEmployee> {
    const employee = await Employee.findById(id).exec();

    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    // Delete profile image from disk
    if (employee.profileImage) {
      const imagePath = path.resolve(
        __dirname,
        "../../",
        employee.profileImage.replace(/^\//, "")
      );
      this.deleteFile(imagePath);
    }

    await Employee.findByIdAndDelete(id).exec();

    logger.info(`Employee deleted: ${employee.uniqueId} — ${employee.name}`);

    return employee;
  }

  /**
   * GET EMPLOYEE COUNT BY DEPARTMENT — useful for dashboard stats.
   */
  async getEmployeeStats(): Promise<any> {
    const [
      totalCount,
      activeCount,
      departmentStats,
      designationStats,
    ] = await Promise.all([
      Employee.countDocuments().exec(),
      Employee.countDocuments({ status: "Active" }).exec(),
      Employee.aggregate([
        { $group: { _id: "$department", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).exec(),
      Employee.aggregate([
        { $group: { _id: "$designation", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).exec(),
    ]);

    return {
      totalEmployees: totalCount,
      activeEmployees: activeCount,
      inactiveEmployees: totalCount - activeCount,
      byDepartment: departmentStats,
      byDesignation: designationStats,
    };
  }

  // ─── Private helper: safely delete a file from disk ───
  private deleteFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.debug(`Deleted file: ${filePath}`);
      }
    } catch (error: any) {
      logger.warn(`Failed to delete file ${filePath}: ${error.message}`);
    }
  }
}

export default new EmployeeService();
