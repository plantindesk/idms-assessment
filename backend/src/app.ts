import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import env from "./config/env";
import connectDB from "./config/db";
import routes from "./routes";
import errorMiddleware from "./middlewares/error.middleware";
import logger from "./utils/logger";

const app = express();

// ─── Security Headers ───
app.use(helmet());

// ─── CORS — allow frontend origin with credentials ───
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,             // Required for cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Body Parsers ───
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Cookie Parser — reads HTTP-only cookies into req.cookies ───
app.use(cookieParser());

// ─── HTTP Request Logger (dev only) ───
if (env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ─── Health Check ───
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───
app.use("/api/v1", routes);

// ─── 404 Handler ───
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ─── Global Error Handler (must be last) ───
app.use(errorMiddleware);

// ─── Start Server ───
const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(env.PORT, () => {
    logger.info(`🚀 Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
};

startServer();

export default app;
