
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model";
import type { IAdmin } from "../types/admin.types";
import ApiError from "../utils/ApiError";
import env from "../config/env";
import logger from "../utils/logger";

// ─── JWT Payload shape ───
export interface JwtPayload {
  adminId: string;
  email: string;
}

class AdminService {
  async register(
    userName: string,
    email: string,
    password: string
  ): Promise<{ admin: Partial<IAdmin>; token: string }> {
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { userName }],
    }).exec();

    if (existingAdmin) {
      if (existingAdmin.email === email) {
        logger.warn(`Registration attempt failed — email already exists: ${email}`);
        throw new ApiError(400, "Email is already registered");
      }
      logger.warn(`Registration attempt failed — username already exists: ${userName}`);
      throw new ApiError(400, "Username is already taken");
    }

    const admin = await Admin.create({ userName, email, password });

    const payload: JwtPayload = {
      adminId: admin._id.toString(),
      email: admin.email,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });

    const adminResponse = admin.toObject();
    delete (adminResponse as any).password;

    logger.info(`Admin registered successfully: ${email}`);

    return { admin: adminResponse, token };
  }

  /**
   * Authenticates an admin by email + password.
   * Returns the admin document (without password) and a signed JWT.
   */
  async login(
    email: string,
    password: string
  ): Promise<{ admin: Partial<IAdmin>; token: string }> {
    // 1️⃣  Find admin — explicitly select password (schema has select:false)
    const admin = await Admin.findOne({ email }).select("+password").exec();

    if (!admin) {
      logger.warn(`Login attempt failed — no admin found for: ${email}`);
      throw new ApiError(401, "Invalid email or password");
    }

    // 2️⃣  Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      logger.warn(`Login attempt failed — wrong password for: ${email}`);
      throw new ApiError(401, "Invalid email or password");
    }

    // 3️⃣  Generate JWT
    const payload: JwtPayload = {
      adminId: admin._id.toString(),
      email: admin.email,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });

    // 4️⃣  Strip password before returning
    const adminResponse = admin.toObject();
    delete (adminResponse as any).password;

    logger.info(`Admin logged in successfully: ${email}`);

    return { admin: adminResponse, token };
  }

  /**
   * Finds an admin by ID — used by auth middleware to re-hydrate req.admin
   */
  async findById(adminId: string): Promise<IAdmin | null> {
    return Admin.findById(adminId).exec();
  }
}

export default new AdminService();
