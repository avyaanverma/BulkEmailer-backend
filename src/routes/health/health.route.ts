import { Router } from "express";

const router = Router();

router.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "Server Running 🚀",
  });
});

export default router;
