import { Router, type Response } from "express";
import { db } from "@workspace/db";
import { waterRequests } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "../middlewares/auth";
import { type AuthRequest } from "../types";
import { insertWaterRequestSchema } from "@workspace/db/schema";

const router = Router();

// Apply auth middleware to all request routes
router.use(verifyToken as any);

// GET /requests
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userRequests = await db.select().from(waterRequests).where(eq(waterRequests.userId, userId));
    res.json(userRequests);
  } catch (err) {
    console.error("Get Requests Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /requests
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const validation = insertWaterRequestSchema.safeParse({ ...req.body, userId });
    
    if (!validation.success) {
      return res.status(400).json({ error: "Invalid data", details: validation.error.format() });
    }
    
    const [newRequest] = await db.insert(waterRequests)
      .values(validation.data)
      .returning();
      
    res.json(newRequest);
  } catch (err) {
    console.error("Create Request Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
