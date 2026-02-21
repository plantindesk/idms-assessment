
import multer, { type StorageEngine, type FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import type { Request } from "express";
import ApiError from "../utils/ApiError";

// ─── Ensure upload directory exists ───
const UPLOAD_DIR = path.resolve(__dirname, "../../uploads/profiles");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ─── Allowed MIME types ───
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// ─── Max file size: 2MB ───
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// ─── Disk Storage: saves files with unique timestamped names ───
const storage: StorageEngine = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, UPLOAD_DIR);
  },

  filename: (_req: Request, file: Express.Multer.File, cb) => {
    // Generate unique filename: employee-<timestamp>-<random>.<ext>
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `employee-${uniqueSuffix}${extension}`);
  },
});

// ─── File filter: reject non-image files before they hit disk ───
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        400,
        `Invalid file type: ${file.mimetype}. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`
      )
    );
  }
};

// ─── Export configured multer instance ───
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1, // Only one profile image at a time
  },
});

/**
 * Middleware to handle single profile image upload.
 * Field name: "profileImage"
 *
 * Usage in routes:
 *   router.post("/", uploadProfileImage, createEmployee);
 */
export const uploadProfileImage = upload.single("profileImage");

export default upload;
