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
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  deletePasswordHash: process.env.DELETE_PASSWORD_HASH,
  users: [
    {
      username: process.env.ADMIN_USERNAME,
      passwordHash: process.env.ADMIN_PASSWORD_HASH,
      role: "admin",
    },
    {
      username: process.env.USER_USERNAME,
      passwordHash: process.env.USER_PASSWORD_HASH,
      role: "user",
    },
  ].filter((user) => user.username && user.passwordHash),
};

const requiredVars = {
  JWT_SECRET: env.jwtSecret,
  DELETE_PASSWORD_HASH: env.deletePasswordHash,
};

const missingVars = Object.entries(requiredVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
}

if (env.users.length === 0) {
  throw new Error(
    "No users configured. Set ADMIN_USERNAME/ADMIN_PASSWORD_HASH (and optionally USER_USERNAME/USER_PASSWORD_HASH)"
  );
}
