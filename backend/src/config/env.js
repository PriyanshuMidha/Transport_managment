import dotenv from "dotenv";

dotenv.config();

const defaultClientOrigins = ["http://localhost:5173", "http://localhost", "https://localhost", "capacitor://localhost"];
const configuredClientOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
  : defaultClientOrigins;

export const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI,
  clientOrigin: configuredClientOrigins[0] || defaultClientOrigins[0],
  clientOrigins: configuredClientOrigins,
  enableDeletedParcelCleanup: process.env.ENABLE_DELETED_PARCEL_CLEANUP === "true",
};
