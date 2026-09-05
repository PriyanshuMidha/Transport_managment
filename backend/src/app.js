import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { requireAuth } from "./middleware/auth.js";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import parcelRoutes from "./routes/parcelRoutes.js";
import transportRoutes from "./routes/transportRoutes.js";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts, please try again later" },
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later" },
});

export const createApp = () => {
  const app = express();

  app.set("trust proxy", 1);

  if (process.env.NODE_ENV === "production") {
    app.use((req, res, next) => {
      if (req.secure || req.headers["x-forwarded-proto"] === "https") {
        return next();
      }
      return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
    });
  }

  app.use(helmet());
  app.use(compression());

  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || env.clientOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));

  app.use(express.json());
  app.use(morgan("dev"));
  app.use(apiLimiter);

  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "Transport Management Backend API is running",
    });
  });

  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      message: "Server is running",
    });
  });

  app.use("/api/auth", loginLimiter, authRoutes);
  app.use("/api/transports", requireAuth, transportRoutes);
  app.use("/api/parcels", requireAuth, parcelRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
