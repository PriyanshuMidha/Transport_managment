import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import parcelRoutes from "./routes/parcelRoutes.js";
import transportRoutes from "./routes/transportRoutes.js";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || env.clientOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS`));
      },
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
