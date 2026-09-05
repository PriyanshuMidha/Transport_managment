import bcrypt from "bcryptjs";

process.env.JWT_SECRET = "test-jwt-secret";
process.env.JWT_EXPIRES_IN = "1h";
process.env.MONGO_URI = "mongodb://127.0.0.1:27017/transport_stock_test";
process.env.CLIENT_ORIGIN = "http://localhost:5173";
process.env.ADMIN_USERNAME = "admin";
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync("adminpass", 4);
process.env.USER_USERNAME = "plazer";
process.env.USER_PASSWORD_HASH = bcrypt.hashSync("userpass", 4);
process.env.DELETE_PASSWORD_HASH = bcrypt.hashSync("deletepass", 4);

export const credentials = {
  admin: { username: "admin", password: "adminpass" },
  user: { username: "plazer", password: "userpass" },
  deletePassword: "deletepass",
};
