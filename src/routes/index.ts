import { Router } from "express";
import healthRoutes from "./health/health.route.js";
import authRoutes from "./auth/auth.route.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
export default router;
