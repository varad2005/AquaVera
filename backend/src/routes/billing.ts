import { Router, type Response } from "express";
import { db } from "@workspace/db";
import { billing } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "../middlewares/auth";
import { type AuthRequest } from "../types";

const router = Router();

// Apply auth middleware to all billing routes
router.use(verifyToken as any);

// GET /billing
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userBilling = await db.select().from(billing).where(eq(billing.userId, userId));
    res.json(userBilling);
  } catch (err) {
    console.error("Get Billing Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
