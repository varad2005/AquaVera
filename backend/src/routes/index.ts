import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV
  });
});

const dbRoutesEnabled = process.env.ENABLE_DB_ROUTES === "true";

if (dbRoutesEnabled) {
  void Promise.all([
    import("./profile"),
    import("./requests"),
    import("./billing"),
  ]).then(([profileModule, requestsModule, billingModule]) => {
    router.use("/profile", profileModule.default);
    router.use("/requests", requestsModule.default);
    router.use("/billing", billingModule.default);
  });
} else {
  const unavailable = (_req: any, res: any) => {
    res.status(503).json({
      error: "Database-backed routes are disabled for local run.",
    });
  };

  router.use("/profile", unavailable);
  router.use("/requests", unavailable);
  router.use("/billing", unavailable);
}

export default router;
