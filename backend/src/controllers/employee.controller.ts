
import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import employeeService, {
  type EmployeeQueryParams,
} from "../services/employee.service";

/**
 * @route   POST /api/v1/employees
 * @desc    Create a new employee (with optional profile image upload)
 * @access  Private
 */
export const createEmployee = asyncHandler(
  async (req: Request, res: Response) => {
    // req.body  → validated text fields (from validateEmployeeBody)
    // req.file  → uploaded image file (from uploadProfileImage multer middleware)
    const employee = await employeeService.createEmployee(
      req.body,
      req.file
    );

    res
      .status(201)
      .json(
        new ApiResponse(201, { employee }, "Employee created successfully")
      );
  }
);

/**
 * @route   GET /api/v1/employees
 * @desc    Get all employees with search, filter, sort, and pagination
 * @access  Private
 *
 * @query   search      - Search by name, email, or uniqueId (case-insensitive regex)
 * @query   department  - Filter by department (exact match)
 * @query   designation - Filter by designation (exact match)
 * @query   gender      - Filter by gender (exact match)
 * @query   status      - Filter by employment status (exact match)
 * @query   sortBy      - Field to sort by (default: createdAt)
 * @query   sortOrder   - "asc" or "desc" (default: desc)
 * @query   page        - Page number (default: 1)
 * @query   limit       - Results per page (default: 10, max: 100)
 *
 * Example: GET /api/v1/employees?search=john&department=Engineering&sortBy=name&sortOrder=asc&page=1&limit=10
 */
export const getEmployees = asyncHandler(
  async (req: Request, res: Response) => {
    // Extract all query parameters with type safety
    const queryParams: EmployeeQueryParams = {
      search: req.query.search as string | undefined,
      department: req.query.department as string | undefined,
      designation: req.query.designation as string | undefined,
      gender: req.query.gender as string | undefined,
      status: req.query.status as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : undefined,
    };

    const result = await employeeService.getEmployees(queryParams);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            employees: result.employees,
            pagination: result.pagination,
          },
          "Employees fetched successfully"
        )
      );
  }
);

/**
 * @route   GET /api/v1/employees/:id
 * @desc    Get a single employee by ID
 * @access  Private
 */
export const getEmployeeById = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.params.id) {
      return res.status(400).json(
        new ApiResponse(400, null, "Invalid resource ID")
      );
    }
    const employee = await employeeService.getEmployeeById(req.params.id as string);

    res
      .status(200)
      .json(
        new ApiResponse(200, { employee }, "Employee fetched successfully")
      );
  }
);

/**
 * @route   PUT /api/v1/employees/:id
 * @desc    Update an employee (with optional new profile image)
 * @access  Private
 */
export const updateEmployee = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.params.id) {
      return res.status(400).json(
        new ApiResponse(400, null, "Invalid resource ID")
      );
    }
    const employee = await employeeService.updateEmployee(
      req.params.id as string,
      req.body,
      req.file
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, { employee }, "Employee updated successfully")
      );
  }
);

/**
 * @route   DELETE /api/v1/employees/:id
 * @desc    Delete an employee and their profile image
 * @access  Private
 */
export const deleteEmployee = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.params.id) {
      return res.status(400).json(
        new ApiResponse(400, null, "Invalid resource ID")
      );
    }
    const employee = await employeeService.deleteEmployee(req.params.id as string);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { employee: { _id: employee._id, uniqueId: employee.uniqueId } },
          "Employee deleted successfully"
        )
      );
  }
);

/**
 * @route   GET /api/v1/employees/stats
 * @desc    Get employee statistics for dashboard
 * @access  Private
 */
export const getEmployeeStats = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await employeeService.getEmployeeStats();

    res
      .status(200)
      .json(
        new ApiResponse(200, { stats }, "Employee stats fetched successfully")
      );
  }
);
