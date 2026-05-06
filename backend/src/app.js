import cors from "cors";
import express from "express";
import morgan from "morgan";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import parcelRoutes from "./routes/parcelRoutes.js";
import transportRoutes from "./routes/transportRoutes.js";

export const createApp = () => {
  const app = express();
  const allowedOrigins = [
    process.env.CLIENT_ORIGIN,
    "https://transport-management-frontend.onrender.com",
    "http://localhost:5173",
    "http://localhost",
    "https://localhost",
    "capacitor://localhost",
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`CORS blocked origin: ${origin}`));
      },
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(morgan("dev"));

  app.use("/api/transports", transportRoutes);
  app.use("/api/parcels", parcelRoutes);

  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      message: "Server is running",
    });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
