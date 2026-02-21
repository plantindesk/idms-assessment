
import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import ApiError from "../utils/ApiError";

/**
 * Catches Multer-specific errors (file too large, unexpected field, etc.)
 * and converts them into our standard ApiError format.
 */
const multerErrorHandler = (
  err: Error,
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return next(
          new ApiError(400, "File size exceeds the 2MB limit")
        );
      case "LIMIT_FILE_COUNT":
        return next(
          new ApiError(400, "Only one file upload is allowed")
        );
      case "LIMIT_UNEXPECTED_FILE":
        return next(
          new ApiError(
            400,
            `Unexpected field name: "${err.field}". Use "profileImage"`
          )
        );
      default:
        return next(new ApiError(400, `Upload error: ${err.message}`));
    }
  }

  next(err);
};

export default multerErrorHandler;
