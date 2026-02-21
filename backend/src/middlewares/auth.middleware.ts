import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import adminService, { type JwtPayload } from "../services/admin.service";
import env from "../config/env";
import logger from "../utils/logger";

/**
 * Protects routes by:
 * 1. Extracting the JWT from the HTTP-only cookie (primary)
 *    or the Authorization header (fallback for tools like Postman).
 * 2. Verifying the token's signature and expiry.
 * 3. Hydrating `req.admin` with the full Admin document.
 */
const authMiddleware = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    let token: string | undefined;

    // ─── 1. Extract token ───
    // Primary: HTTP-only cookie
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }
    // Fallback: Authorization: Bearer <token>
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      logger.warn(
        `Unauthenticated request to protected route: ${req.method} ${req.originalUrl}`
      );
      throw new ApiError(
        401,
        "Authentication required. Please log in."
      );
    }

    // ─── 2. Verify token ───
    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch (err: any) {
      // Distinguish between expired vs malformed tokens
      if (err.name === "TokenExpiredError") {
        logger.warn("JWT has expired");
        throw new ApiError(
          401,
          "Session expired. Please log in again."
        );
      }

      if (err.name === "JsonWebTokenError") {
        logger.warn(`Invalid JWT: ${err.message}`);
        throw new ApiError(401, "Invalid authentication token");
      }

      throw new ApiError(401, "Authentication failed");
    }

    // ─── 3. Hydrate req.admin ───
    const admin = await adminService.findById(decoded.adminId);

    if (!admin) {
      logger.warn(
        `JWT valid but admin no longer exists: ${decoded.adminId}`
      );
      throw new ApiError(
        401,
        "The admin associated with this token no longer exists"
      );
    }

    // Attach admin to request for downstream usage
    req.admin = admin;

    next();
  }
);

export default authMiddleware;
