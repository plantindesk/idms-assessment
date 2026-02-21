import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import logger from "../utils/logger";
import env from "../config/env";

/**
 * Centralised error handler — catches all errors thrown/next'd in the app.
 * Differentiates between operational errors (ApiError) and unexpected crashes.
 */
const errorMiddleware = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: any[] = [];

  // ─── Known operational error (thrown by us) ───
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }

  // ─── Mongoose validation error ───
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    const mongooseErr = err as any;
    errors = Object.values(mongooseErr.errors).map(
      (e: any) => e.message
    );
  }

  // ─── Mongoose duplicate key error ───
  else if ((err as any).code === 11000) {
    statusCode = 409;
    const duplicateField = Object.keys((err as any).keyValue).join(", ");
    message = `Duplicate value for field(s): ${duplicateField}`;
  }

  // ─── Mongoose bad ObjectId ───
  else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID format";
  }

  // Log the full error in non-production
  logger.error(`[${statusCode}] ${message}`);
  if (env.NODE_ENV !== "production") {
    logger.debug(err.stack || "No stack trace available");
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    ...(env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

export default errorMiddleware;
