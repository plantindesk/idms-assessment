
import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import { EMAIL_REGEX } from "../constants";

/**
 * Validates the login request body before it reaches the controller.
 * Fails fast with descriptive error messages.
 */
export const validateLoginBody = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;
  const errors: string[] = [];

  // ─── Email checks ───
  if (!email || typeof email !== "string" || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push("Please provide a valid email address");
  }

  // ─── Password checks ───
  if (!password || typeof password !== "string" || password.trim().length === 0) {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  // Sanitize: attach trimmed values back
  req.body.email = email.trim().toLowerCase();
  req.body.password = password;

  next();
};

export const validateRegisterBody = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const { userName, email, password } = req.body;
  const errors: string[] = [];

  if (!userName || typeof userName !== "string" || userName.trim().length === 0) {
    errors.push("Username is required");
  } else if (userName.trim().length < 3 || userName.trim().length > 30) {
    errors.push("Username must be between 3 and 30 characters");
  }

  if (!email || typeof email !== "string" || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push("Please provide a valid email address");
  }

  if (!password || typeof password !== "string" || password.trim().length === 0) {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  req.body.userName = userName.trim().toLowerCase();
  req.body.email = email.trim().toLowerCase();
  req.body.password = password;

  next();
};
