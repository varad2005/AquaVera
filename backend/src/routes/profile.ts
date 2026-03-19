import { Router, type Response } from "express";
import { db } from "@workspace/db";
import { profiles } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "../middlewares/auth";
import { type AuthRequest } from "../types";
import { insertProfileSchema } from "@workspace/db/schema";

const router = Router();

// Apply auth middleware to all profile routes
router.use(verifyToken as any);

// GET /profile
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const [userProfile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    
    if (!userProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    
    res.json(userProfile);
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /profile (Update or Create)
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const validation = insertProfileSchema.safeParse({ ...req.body, userId });
    
    if (!validation.success) {
      return res.status(400).json({ error: "Invalid data", details: validation.error.format() });
    }
    
    const [updatedProfile] = await db.insert(profiles)
      .values(validation.data)
      .onConflictDoUpdate({
        target: profiles.userId,
        set: validation.data
      })
      .returning();
      
    res.json(updatedProfile);
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
