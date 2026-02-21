
import { Router } from "express";
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
} from "../controllers/employee.controller";
import { validateEmployeeBody } from "../validators/employee.validator";
import authMiddleware from "../middlewares/auth.middleware";
import { uploadProfileImage } from "../middlewares/multer.middleware";

const router = Router();

router.post("/", authMiddleware, uploadProfileImage, validateEmployeeBody, createEmployee);
router.get("/", authMiddleware, getEmployees);
router.get("/stats", authMiddleware, getEmployeeStats);
router.get("/:id", authMiddleware, getEmployeeById);
router.put("/:id", authMiddleware, uploadProfileImage, validateEmployeeBody, updateEmployee);
router.delete("/:id", authMiddleware, deleteEmployee);

export default router;
