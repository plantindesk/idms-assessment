
import { Router } from "express";
import { login, logout, getMe, register } from "../controllers/admin.controller";
import { validateLoginBody, validateRegisterBody } from "../validators/admin.validator";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

// Public
router.post("/register", validateRegisterBody, register);
router.post("/login", validateLoginBody, login);

// Protected
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getMe);

export default router;
