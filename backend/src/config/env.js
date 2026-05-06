import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret_here",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  enableDeletedParcelCleanup: process.env.ENABLE_DELETED_PARCEL_CLEANUP === "true",
};
