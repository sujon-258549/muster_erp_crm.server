import express from "express";
import type { Request, Response } from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/router/index.js";
import notFound from "./app/router/notFound.js";
import globalErrorHandler from "./app/middleware/globalErrorHandler.ts";

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3500","http://localhost:4800"], credentials: true }));

app.get("/api", (req: Request, res: Response) => {
  res.send("Kaj lagbe bd");
});

app.use("/api",router);

// Not Found - catch all unmatched routes (must be last)
app.use(notFound);
app.use(globalErrorHandler);
export default app;

// middleware