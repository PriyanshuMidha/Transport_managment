import cors from "cors";
import express from "express";
import morgan from "morgan";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import parcelRoutes from "./routes/parcelRoutes.js";
import transportRoutes from "./routes/transportRoutes.js";

export const createApp = () => {
  const app = express();

  app.use((req, res, next) => {
    res.setHeader("X-Cors-Version", "open-cors-v3");
    next();
  });

  const corsOptions = {
    origin: "*",
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));

  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "Transport Management Backend API is running",
      corsVersion: "open-cors-v3",
    });
  });

  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      message: "Server is running",
      corsVersion: "open-cors-v3",
    });
  });

  app.use("/api/transports", transportRoutes);
  app.use("/api/parcels", parcelRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};