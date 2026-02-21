import { Router } from "express";
import adminRoutes from "./admin.routes";
import employeeRoutes from "./employee.routes";

const router = Router();

router.use("/auth", adminRoutes);
router.use("/employees", employeeRoutes);

export default router;
