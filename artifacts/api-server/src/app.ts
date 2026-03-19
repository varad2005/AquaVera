import express, { type Express, type Request, type Response, type NextFunction } from "express";
import { applySecurity } from "./middlewares/security";
import router from "./routes";

const app: Express = express();

// Apply security first
applySecurity(app);

// Routes
app.use("/api", router);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler (must be last)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  
  const status = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

export default app;
