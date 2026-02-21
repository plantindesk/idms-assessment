import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import adminService from "../services/admin.service";
import env from "../config/env";

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new admin & set JWT in HTTP-only cookie
 * @access  Public
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;

  const { admin, token } = await adminService.register(userName, email, password);

  const cookieOptions: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "strict" | "lax" | "none";
    maxAge: number;
    path: string;
  } = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: env.COOKIE_MAX_AGE_MS,
    path: "/",
  };

  res
    .status(201)
    .cookie("accessToken", token, cookieOptions)
    .json(new ApiResponse(201, { admin }, "Registration successful"));
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate admin & set JWT in HTTP-only cookie
 * @access  Public
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Delegate to service layer
  const { admin, token } = await adminService.login(email, password);

  // ─── Cookie options (production-hardened) ───
  const cookieOptions: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "strict" | "lax" | "none";
    maxAge: number;
    path: string;
  } = {
    httpOnly: true,                                   // JS cannot read/write
    secure: env.NODE_ENV === "production",            // HTTPS only in prod
    sameSite: env.NODE_ENV === "production"
      ? "strict"                                      // CSRF protection
      : "lax",                                        // Dev-friendly
    maxAge: env.COOKIE_MAX_AGE_MS,                    // Expiry in ms
    path: "/",                                        // Available site-wide
  };

  // Set the cookie and send response
  res
    .status(200)
    .cookie("accessToken", token, cookieOptions)
    .json(new ApiResponse(200, { admin }, "Login successful"));
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Clear JWT cookie
 * @access  Private (must be logged in)
 */
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: (env.NODE_ENV === "production" ? "strict" : "lax") as
      | "strict"
      | "lax",
    path: "/",
  };

  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get currently authenticated admin profile
 * @access  Private
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  // req.admin is populated by authMiddleware
  res
    .status(200)
    .json(new ApiResponse(200, { admin: req.admin }, "Admin profile fetched"));
});
