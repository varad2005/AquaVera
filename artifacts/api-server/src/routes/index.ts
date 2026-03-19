import { Router } from "express";
import profileRouter from "./profile";
import requestsRouter from "./requests";
import billingRouter from "./billing";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV
  });
});

router.use("/profile", profileRouter);
router.use("/requests", requestsRouter);
router.use("/billing", billingRouter);

export default router;
